-- Admin emails table (insert your admin email(s) after migration)
CREATE TABLE admins (
  email text PRIMARY KEY
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_admins_self" ON admins FOR SELECT
  TO authenticated USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Allow admins to view all orders
CREATE POLICY "admin_select_orders" ON orders FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- Allow admins to update order status
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- Allow admins to update product stock
CREATE POLICY "admin_update_products" ON products FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- Withdrawals table
CREATE TABLE withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount_cents integer NOT NULL CHECK (amount_cents > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  bank_name text NOT NULL,
  account_number text NOT NULL,
  account_name text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_withdrawals_admin" ON withdrawals FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );
CREATE POLICY "insert_withdrawals_admin" ON withdrawals FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );
CREATE POLICY "update_withdrawals_admin" ON withdrawals FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );
CREATE POLICY "delete_withdrawals_admin" ON withdrawals FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );
