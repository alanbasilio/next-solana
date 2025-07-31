-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_volume DECIMAL(20, 8) DEFAULT 0,
    total_fees_paid DECIMAL(20, 8) DEFAULT 0,
    referral_code TEXT UNIQUE NOT NULL,
    referred_by TEXT REFERENCES users(wallet_address),
    is_active BOOLEAN DEFAULT true
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tx_hash TEXT UNIQUE NOT NULL,
    from_token TEXT NOT NULL,
    to_token TEXT NOT NULL,
    from_amount DECIMAL(20, 8) NOT NULL,
    to_amount DECIMAL(20, 8) NOT NULL,
    fee_amount DECIMAL(20, 8) NOT NULL,
    fee_token TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    jupiter_quote_id TEXT,
    price_impact DECIMAL(10, 4),
    slippage DECIMAL(5, 2),
    network_fee DECIMAL(20, 8),
    route_plan JSONB
);

-- Create fees table
CREATE TABLE IF NOT EXISTS fees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    amount DECIMAL(20, 8) NOT NULL,
    token TEXT NOT NULL,
    fee_type TEXT CHECK (fee_type IN ('platform', 'referral', 'network')) DEFAULT 'platform',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referral_rewards table
CREATE TABLE IF NOT EXISTS referral_rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    reward_amount DECIMAL(20, 8) NOT NULL,
    reward_token TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE
);

-- Create token_prices table for caching
CREATE TABLE IF NOT EXISTS token_prices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    token_symbol TEXT NOT NULL,
    token_address TEXT NOT NULL,
    price_usd DECIMAL(20, 8) NOT NULL,
    price_change_24h DECIMAL(10, 4),
    market_cap DECIMAL(20, 2),
    volume_24h DECIMAL(20, 2),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(token_symbol, token_address)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_tx_hash ON transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_fees_transaction_id ON fees(transaction_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referrer_id ON referral_rewards(referrer_id);
CREATE INDEX IF NOT EXISTS idx_token_prices_symbol ON token_prices(token_symbol);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate referral rewards
CREATE OR REPLACE FUNCTION calculate_referral_reward()
RETURNS TRIGGER AS $$
BEGIN
    -- If this is a new transaction and the user was referred by someone
    IF NEW.user_id IS NOT NULL AND NEW.fee_amount > 0 THEN
        INSERT INTO referral_rewards (
            referrer_id,
            referred_id,
            transaction_id,
            reward_amount,
            reward_token,
            status
        )
        SELECT 
            u.id,
            NEW.user_id,
            NEW.id,
            NEW.fee_amount * 0.1, -- 10% of platform fee goes to referrer
            NEW.fee_token,
            'pending'
        FROM users u
        WHERE u.wallet_address = (
            SELECT referred_by 
            FROM users 
            WHERE id = NEW.user_id
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for referral rewards
CREATE TRIGGER trigger_referral_reward AFTER INSERT ON transactions
    FOR EACH ROW EXECUTE FUNCTION calculate_referral_reward();

-- Create function to update user metrics
CREATE OR REPLACE FUNCTION update_user_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user's total volume and fees when transaction is confirmed
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        UPDATE users 
        SET 
            total_volume = total_volume + NEW.from_amount,
            total_fees_paid = total_fees_paid + NEW.fee_amount
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating user metrics
CREATE TRIGGER trigger_update_user_metrics AFTER UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_user_metrics();

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_prices ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = wallet_address);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = wallet_address);

-- Users can insert their own data
CREATE POLICY "Users can insert own data" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = wallet_address);

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (user_id IN (
        SELECT id FROM users WHERE wallet_address = auth.uid()::text
    ));

-- Users can insert their own transactions
CREATE POLICY "Users can insert own transactions" ON transactions
    FOR INSERT WITH CHECK (user_id IN (
        SELECT id FROM users WHERE wallet_address = auth.uid()::text
    ));

-- Users can view their own fees
CREATE POLICY "Users can view own fees" ON fees
    FOR SELECT USING (transaction_id IN (
        SELECT id FROM transactions WHERE user_id IN (
            SELECT id FROM users WHERE wallet_address = auth.uid()::text
        )
    ));

-- Analytics can be inserted by anyone (for tracking)
CREATE POLICY "Anyone can insert analytics" ON analytics
    FOR INSERT WITH CHECK (true);

-- Analytics can be read by admins (you can add admin check here)
CREATE POLICY "Admins can view analytics" ON analytics
    FOR SELECT USING (true);

-- Token prices are public
CREATE POLICY "Token prices are public" ON token_prices
    FOR SELECT USING (true);

-- Anyone can insert token prices (for updates)
CREATE POLICY "Anyone can insert token prices" ON token_prices
    FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated; 