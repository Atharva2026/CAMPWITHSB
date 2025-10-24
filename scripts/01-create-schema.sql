-- Create registrations table for storing camp registrations
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  clerk_user_id VARCHAR(255) NOT NULL,
  email_id VARCHAR(255) NOT NULL,
  poc_name VARCHAR(255),
  poc_contact VARCHAR(20),
  voice_name VARCHAR(255),
  participant_name VARCHAR(255) NOT NULL,
  participant_type VARCHAR(100),
  gender VARCHAR(50) NOT NULL DEFAULT 'NA',
  whatsapp VARCHAR(20),
  parent_temple VARCHAR(255),
  counselor_name VARCHAR(255),
  camp_name VARCHAR(255) NOT NULL,
  first_meal_date INTEGER,
  first_meal_type VARCHAR(100),
  last_meal_date INTEGER,
  last_meal_type VARCHAR(100),
  dinner_type VARCHAR(100),
  accommodation VARCHAR(100),
  age INTEGER,
  married_since_year INTEGER,
  amount DECIMAL(10, 2) DEFAULT 0,
  entry_cost DECIMAL(10, 2) DEFAULT 0,
  payment_id VARCHAR(255),
  payment_method VARCHAR(50),
  deduction_source VARCHAR(255),
  passcode VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clerk_user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX idx_registrations_clerk_user_id ON registrations(clerk_user_id);
CREATE INDEX idx_registrations_email_id ON registrations(email_id);
CREATE INDEX idx_registrations_camp_name ON registrations(camp_name);
CREATE INDEX idx_registrations_created_at ON registrations(created_at);

-- Create payments table for tracking payment transactions
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  clerk_user_id VARCHAR(255) NOT NULL,
  registration_id INTEGER,
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clerk_user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE SET NULL
);

-- Create index for payments
CREATE INDEX idx_payments_clerk_user_id ON payments(clerk_user_id);
CREATE INDEX idx_payments_razorpay_payment_id ON payments(razorpay_payment_id);
CREATE INDEX idx_payments_created_at ON payments(created_at);
