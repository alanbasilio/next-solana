use anchor_lang::prelude::*;

declare_id!("A2NKHo8dGdRmNgFfaxmqLmmDVJyeoxhYRyuC7WouMW47");

#[program]
pub mod basic {
    use super::*;

    pub fn greet(_ctx: Context<Initialize>) -> Result<()> {
        msg!("GM!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
