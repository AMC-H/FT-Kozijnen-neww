/*
  # Create Quote Status Change Trigger

  1. New Functions
    - `call_send_quote_email()` - Trigger function that calls the Edge Function
  
  2. New Triggers
    - `quote_status_change_trigger` - Fires after UPDATE on quotes table
  
  3. Functionality
    - Only activates when status changes from 'concept' to 'ingediend'
    - Calls send-full-quote-email Edge Function with complete quote data
    - Fetches user details from auth.users table
    - Includes error handling to prevent transaction failures
*/

-- Create the trigger function
CREATE OR REPLACE FUNCTION call_send_quote_email()
RETURNS TRIGGER AS $$
DECLARE
  user_data RECORD;
  customer_details JSONB;
  payload JSONB;
  response TEXT;
BEGIN
  -- Only proceed if status changed from 'concept' to 'ingediend'
  IF OLD.status = 'concept' AND NEW.status = 'ingediend' THEN
    
    -- Get user details from auth.users
    SELECT 
      email,
      raw_user_meta_data->>'first_name' as first_name,
      raw_user_meta_data->>'last_name' as last_name,
      raw_user_meta_data->>'company' as company,
      raw_user_meta_data->>'phone' as phone
    INTO user_data
    FROM auth.users 
    WHERE id = NEW.user_id;
    
    -- Build customer_details object
    customer_details := jsonb_build_object(
      'naam', COALESCE(user_data.first_name || ' ' || user_data.last_name, user_data.email),
      'email', user_data.email,
      'bedrijf', COALESCE(user_data.company, ''),
      'telefoon', COALESCE(user_data.phone, ''),
      'adres', '',
      'postcode', '',
      'woonplaats', ''
    );
    
    -- Build the complete payload
    payload := jsonb_build_object(
      'customer_details', customer_details,
      'items', NEW.items,
      'quote_id', NEW.id,
      'created_at', NEW.created_at,
      'updated_at', NEW.updated_at
    );
    
    -- Call the Edge Function
    BEGIN
      SELECT content INTO response
      FROM http((
        'POST',
        current_setting('app.settings.supabase_url', true) || '/functions/v1/send-full-quote-email',
        ARRAY[
          http_header('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)),
          http_header('Content-Type', 'application/json')
        ],
        'application/json',
        payload::text
      ));
      
      -- Log successful email send (optional)
      RAISE NOTICE 'Email sent successfully for quote %', NEW.id;
      
    EXCEPTION WHEN OTHERS THEN
      -- Log error but don't fail the transaction
      RAISE WARNING 'Failed to send email for quote %: %', NEW.id, SQLERRM;
    END;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS quote_status_change_trigger ON quotes;
CREATE TRIGGER quote_status_change_trigger
  AFTER UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION call_send_quote_email();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION call_send_quote_email() TO authenticated;
GRANT EXECUTE ON FUNCTION call_send_quote_email() TO service_role;