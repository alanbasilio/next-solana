use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer};

declare_id!("A2NKHo8dGdRmNgFfaxmqLmmDVJyeoxhYRyuC7WouMW47");

#[program]
pub mod solana_dex {
    use super::*;

    /// Initialize a new liquidity pool with concentrated liquidity
    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        tick_lower: i32,
        tick_upper: i32,
        sqrt_price_x64: u128,
        fee_rate: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        
        pool.token_a_mint = ctx.accounts.token_a_mint.key();
        pool.token_b_mint = ctx.accounts.token_b_mint.key();
        pool.token_a_vault = ctx.accounts.token_a_vault.key();
        pool.token_b_vault = ctx.accounts.token_b_vault.key();
        pool.tick_lower = tick_lower;
        pool.tick_upper = tick_upper;
        pool.sqrt_price_x64 = sqrt_price_x64;
        pool.fee_rate = fee_rate;
        pool.liquidity = 0;
        pool.total_fees_a = 0;
        pool.total_fees_b = 0;
        pool.authority = ctx.accounts.authority.key();
        
        msg!("Pool initialized with concentrated liquidity from tick {} to tick {}", tick_lower, tick_upper);
        Ok(())
    }

    /// Add liquidity to a concentrated liquidity pool
    pub fn add_liquidity(
        ctx: Context<AddLiquidity>,
        amount_a: u64,
        amount_b: u64,
        amount_a_min: u64,
        amount_b_min: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        
        // Calculate liquidity amount based on current price and amounts
        let liquidity_delta = calculate_liquidity_delta(
            pool.sqrt_price_x64,
            pool.tick_lower,
            pool.tick_upper,
            amount_a,
            amount_b,
        )?;
        
        // Transfer tokens from user to pool vaults
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_token_a.to_account_info(),
                    to: ctx.accounts.token_a_vault.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount_a,
        )?;

        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_token_b.to_account_info(),
                    to: ctx.accounts.token_b_vault.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount_b,
        )?;

        // Update pool liquidity
        pool.liquidity = pool.liquidity.checked_add(liquidity_delta).unwrap();
        
        // Update position
        let position = &mut ctx.accounts.position;
        position.pool = pool.key();
        position.owner = ctx.accounts.user.key();
        position.liquidity = position.liquidity.checked_add(liquidity_delta).unwrap();
        position.tick_lower = pool.tick_lower;
        position.tick_upper = pool.tick_upper;
        
        msg!("Added {} liquidity to pool", liquidity_delta);
        Ok(())
    }

    /// Swap tokens with optimized routing
    pub fn swap(
        ctx: Context<Swap>,
        amount_in: u64,
        amount_out_min: u64,
        a_to_b: bool,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        
        // Calculate swap amounts with fees
        let fee_amount = amount_in.checked_mul(pool.fee_rate).unwrap().checked_div(1_000_000).unwrap();
        let amount_in_after_fees = amount_in.checked_sub(fee_amount).unwrap();
        
        let amount_out = calculate_swap_output(
            pool.sqrt_price_x64,
            pool.liquidity,
            amount_in_after_fees,
            a_to_b,
        )?;
        
        require!(amount_out >= amount_out_min, DexError::SlippageExceeded);
        
        if a_to_b {
            // Transfer token A from user to pool
            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.user_token_a.to_account_info(),
                        to: ctx.accounts.token_a_vault.to_account_info(),
                        authority: ctx.accounts.user.to_account_info(),
                    },
                ),
                amount_in,
            )?;

            // Transfer token B from pool to user
            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.token_b_vault.to_account_info(),
                        to: ctx.accounts.user_token_b.to_account_info(),
                        authority: pool.to_account_info(),
                    },
                    &[&[b"pool", &[pool.bump]]],
                ),
                amount_out,
            )?;
            
            pool.total_fees_a = pool.total_fees_a.checked_add(fee_amount).unwrap();
        } else {
            // Transfer token B from user to pool
            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.user_token_b.to_account_info(),
                        to: ctx.accounts.token_b_vault.to_account_info(),
                        authority: ctx.accounts.user.to_account_info(),
                    },
                ),
                amount_in,
            )?;

            // Transfer token A from pool to user
            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.token_a_vault.to_account_info(),
                        to: ctx.accounts.user_token_a.to_account_info(),
                        authority: pool.to_account_info(),
                    },
                    &[&[b"pool", &[pool.bump]]],
                ),
                amount_out,
            )?;
            
            pool.total_fees_b = pool.total_fees_b.checked_add(fee_amount).unwrap();
        }
        
        // Update price based on swap
        pool.sqrt_price_x64 = calculate_new_sqrt_price(
            pool.sqrt_price_x64,
            pool.liquidity,
            amount_in_after_fees,
            a_to_b,
        )?;
        
        msg!("Swapped {} tokens for {} tokens", amount_in, amount_out);
        Ok(())
    }

    /// Place a limit order
    pub fn place_limit_order(
        ctx: Context<PlaceLimitOrder>,
        amount_in: u64,
        price: u64,
        is_bid: bool,
        expiry: i64,
    ) -> Result<()> {
        let order = &mut ctx.accounts.order;
        
        order.owner = ctx.accounts.user.key();
        order.pool = ctx.accounts.pool.key();
        order.amount_in = amount_in;
        order.amount_out = 0;
        order.price = price;
        order.is_bid = is_bid;
        order.is_filled = false;
        order.expiry = expiry;
        order.created_at = Clock::get()?.unix_timestamp;
        
        // Transfer tokens to escrow
        if is_bid {
            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.user_token_b.to_account_info(),
                        to: ctx.accounts.order_vault.to_account_info(),
                        authority: ctx.accounts.user.to_account_info(),
                    },
                ),
                amount_in,
            )?;
        } else {
            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.user_token_a.to_account_info(),
                        to: ctx.accounts.order_vault.to_account_info(),
                        authority: ctx.accounts.user.to_account_info(),
                    },
                ),
                amount_in,
            )?;
        }
        
        msg!("Limit order placed: {} tokens at price {}", amount_in, price);
        Ok(())
    }
}

// Helper functions for calculations
fn calculate_liquidity_delta(
    sqrt_price_x64: u128,
    tick_lower: i32,
    tick_upper: i32,
    amount_a: u64,
    amount_b: u64,
) -> Result<u128> {
    // Simplified liquidity calculation for concentrated ranges
    // In production, this would use more sophisticated math
    let price_lower = tick_to_sqrt_price(tick_lower)?;
    let price_upper = tick_to_sqrt_price(tick_upper)?;
    
    let liquidity_a = (amount_a as u128)
        .checked_mul(sqrt_price_x64)
        .unwrap()
        .checked_div(price_upper.checked_sub(sqrt_price_x64).unwrap())
        .unwrap();
        
    let liquidity_b = (amount_b as u128)
        .checked_div(sqrt_price_x64.checked_sub(price_lower).unwrap())
        .unwrap();
    
    Ok(std::cmp::min(liquidity_a, liquidity_b))
}

fn calculate_swap_output(
    sqrt_price_x64: u128,
    liquidity: u128,
    amount_in: u64,
    a_to_b: bool,
) -> Result<u64> {
    // Simplified constant product formula
    // In production, this would account for concentrated liquidity ranges
    let k = liquidity.checked_mul(liquidity).unwrap();
    
    if a_to_b {
        let new_a = liquidity.checked_add(amount_in as u128).unwrap();
        let new_b = k.checked_div(new_a).unwrap();
        Ok((liquidity.checked_sub(new_b).unwrap()) as u64)
    } else {
        let new_b = liquidity.checked_add(amount_in as u128).unwrap();
        let new_a = k.checked_div(new_b).unwrap();
        Ok((liquidity.checked_sub(new_a).unwrap()) as u64)
    }
}

fn calculate_new_sqrt_price(
    current_sqrt_price: u128,
    liquidity: u128,
    amount_in: u64,
    a_to_b: bool,
) -> Result<u128> {
    // Simplified price update calculation
    let price_impact = (amount_in as u128).checked_mul(1000000).unwrap().checked_div(liquidity).unwrap();
    
    if a_to_b {
        Ok(current_sqrt_price.checked_sub(price_impact).unwrap())
    } else {
        Ok(current_sqrt_price.checked_add(price_impact).unwrap())
    }
}

fn tick_to_sqrt_price(tick: i32) -> Result<u128> {
    // Simplified tick to price conversion
    // In production, this would use precise mathematical formulas
    let base_price = 1_000_000_u128; // Base price in fixed point
    Ok(base_price.checked_mul((tick as u128).checked_add(1000).unwrap()).unwrap())
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Pool::LEN,
        seeds = [b"pool", token_a_mint.key().as_ref(), token_b_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,
    
    pub token_a_mint: Account<'info, Mint>,
    pub token_b_mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = authority,
        token::mint = token_a_mint,
        token::authority = pool,
        seeds = [b"vault_a", pool.key().as_ref()],
        bump
    )]
    pub token_a_vault: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = authority,
        token::mint = token_b_mint,
        token::authority = pool,
        seeds = [b"vault_b", pool.key().as_ref()],
        bump
    )]
    pub token_b_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct AddLiquidity<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + Position::LEN,
        seeds = [b"position", pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub position: Account<'info, Position>,
    
    #[account(mut)]
    pub token_a_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub token_b_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_token_a: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_token_b: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    
    #[account(mut)]
    pub token_a_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub token_b_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_token_a: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_token_b: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct PlaceLimitOrder<'info> {
    pub pool: Account<'info, Pool>,
    
    #[account(
        init,
        payer = user,
        space = 8 + LimitOrder::LEN,
        seeds = [b"order", pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub order: Account<'info, LimitOrder>,
    
    #[account(
        init,
        payer = user,
        token::mint = token_mint,
        token::authority = order,
        seeds = [b"order_vault", order.key().as_ref()],
        bump
    )]
    pub order_vault: Account<'info, TokenAccount>,
    
    pub token_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub user_token_a: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_token_b: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
pub struct Pool {
    pub token_a_mint: Pubkey,
    pub token_b_mint: Pubkey,
    pub token_a_vault: Pubkey,
    pub token_b_vault: Pubkey,
    pub tick_lower: i32,
    pub tick_upper: i32,
    pub sqrt_price_x64: u128,
    pub liquidity: u128,
    pub fee_rate: u64,
    pub total_fees_a: u64,
    pub total_fees_b: u64,
    pub authority: Pubkey,
    pub bump: u8,
}

impl Pool {
    pub const LEN: usize = 32 + 32 + 32 + 32 + 4 + 4 + 16 + 16 + 8 + 8 + 8 + 32 + 1;
}

#[account]
pub struct Position {
    pub pool: Pubkey,
    pub owner: Pubkey,
    pub liquidity: u128,
    pub tick_lower: i32,
    pub tick_upper: i32,
    pub fee_growth_inside_a: u128,
    pub fee_growth_inside_b: u128,
}

impl Position {
    pub const LEN: usize = 32 + 32 + 16 + 4 + 4 + 16 + 16;
}

#[account]
pub struct LimitOrder {
    pub owner: Pubkey,
    pub pool: Pubkey,
    pub amount_in: u64,
    pub amount_out: u64,
    pub price: u64,
    pub is_bid: bool,
    pub is_filled: bool,
    pub expiry: i64,
    pub created_at: i64,
}

impl LimitOrder {
    pub const LEN: usize = 32 + 32 + 8 + 8 + 8 + 1 + 1 + 8 + 8;
}

#[error_code]
pub enum DexError {
    #[msg("Slippage tolerance exceeded")]
    SlippageExceeded,
    #[msg("Insufficient liquidity")]
    InsufficientLiquidity,
    #[msg("Invalid tick range")]
    InvalidTickRange,
    #[msg("Order expired")]
    OrderExpired,
    #[msg("Math overflow")]
    MathOverflow,
}
