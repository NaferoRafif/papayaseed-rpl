-- Add user_email column to chats
ALTER TABLE chats ADD COLUMN user_email TEXT;

-- Create function to populate user_email from auth.users
CREATE OR REPLACE FUNCTION populate_chat_user_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_email := (SELECT email FROM auth.users WHERE id = NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER trigger_populate_chat_user_email
  BEFORE INSERT ON chats
  FOR EACH ROW
  EXECUTE FUNCTION populate_chat_user_email();

-- Update existing chats
UPDATE chats c
SET user_email = (SELECT email FROM auth.users WHERE id = c.user_id)
WHERE user_email IS NULL;