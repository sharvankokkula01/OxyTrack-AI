CREATE TABLE newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert_newsletter" ON newsletter_subscriptions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "insert_newsletter_anon" ON newsletter_subscriptions FOR INSERT TO anon WITH CHECK (true);