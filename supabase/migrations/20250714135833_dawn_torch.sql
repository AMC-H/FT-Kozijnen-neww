/*
  # Create Quote Status Change Trigger

  1. New Functions
    - `notify_quote_submission()` - Trigger function that calls the Edge Function when quote status changes
  
  2. New Triggers
    - `quote_status_change_trigger` - Executes after UPDATE on quotes table
    - Only activates when status changes from 'concept' to 'ingediend'
    - Calls send-full-quote-email Edge Function with complete quote data
  
  3. Security
    - Function uses SECURITY DEFINER to ensure proper permissions
    - Includes error handling for Edge Function calls
*/

-- Create the trigger function
CREATE OR REPLACE FUNCTION notify_quote_submission()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  quote_data jsonb;
  user_data jsonb;
  function_response text;
BEGIN
  -- Only proceed if status changed from 'concept' to 'ingediend'
  IF OLD.status = 'concept' AND NEW.status = 'ingediend' THEN
    
    -- Get user details from auth.users
    SELECT to_jsonb(u.*) INTO user_data
    FROM auth.users u
    WHERE u.id = NEW.user_id;
    
    -- Prepare the complete quote data
    quote_data := jsonb_build_object(
      'customer_details', jsonb_build_object(
        'naam', COALESCE(user_data->>'raw_user_meta_data'->>'first_name', '') || ' ' || COALESCE(user_data->>'raw_user_meta_data'->>'last_name', ''),
        'email', user_data->>'email',
        'adres', COALESCE(user_data->>'raw_user_meta_data'->>'address', 'Niet opgegeven'),
        'postcode', COALESCE(user_data->>'raw_user_meta_data'->>'postal_code', 'Niet opgegeven'),
        'woonplaats', COALESCE(user_data->>'raw_user_meta_data'->>'city', 'Niet opgegeven'),
        'telefoonnummer', COALESCE(user_data->>'raw_user_meta_data'->>'phone', 'Niet opgegeven')
      ),
      'items', NEW.items,
      'quote_id', NEW.id,
      'created_at', NEW.created_at,
      'updated_at', NEW.updated_at
    );
    
    -- Call the Edge Function
    BEGIN
      SELECT content INTO function_response
      FROM http((
        'POST',
        current_setting('app.settings.supabase_url', true) || '/functions/v1/send-full-quote-email',
        ARRAY[
          http_header('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)),
          http_header('Content-Type', 'application/json')
        ],
        'application/json',
        quote_data::text
      ));
      
      -- Log successful email send (optional)
      RAISE NOTICE 'Quote submission email sent successfully for quote ID: %', NEW.id;
      
    EXCEPTION WHEN OTHERS THEN
      -- Log error but don't fail the transaction
      RAISE WARNING 'Failed to send quote submission email for quote ID: %. Error: %', NEW.id, SQLERRM;
    END;
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS quote_status_change_trigger ON quotes;

CREATE TRIGGER quote_status_change_trigger
  AFTER UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION notify_quote_submission();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION notify_quote_submission() TO authenticated;
GRANT EXECUTE ON FUNCTION notify_quote_submission() TO service_role;

-- Create settings for Supabase URL and service role key (these should be set via Supabase dashboard)
-- These are placeholders - actual values should be configured in Supabase dashboard under Settings > API
DO $$
BEGIN
  -- Only create settings if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_settings WHERE name = 'app.settings.supabase_url'
  ) THEN
    -- This will need to be set manually in Supabase dashboard
    RAISE NOTICE 'Please set app.settings.supabase_url in Supabase dashboard Settings > Database > Custom Settings';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_settings WHERE name = 'app.settings.service_role_key'  
  ) THEN
    -- This will need to be set manually in Supabase dashboard
    RAISE NOTICE 'Please set app.settings.service_role_key in Supabase dashboard Settings > Database > Custom Settings';
  END IF;
END $$;