-- 9. Delete User RPC
-- Run this in your Supabase SQL Editor to allow users to completely delete their accounts
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete from public.users (which cascades to tasks, habits, etc. if set up)
    DELETE FROM public.users WHERE id = auth.uid();
    
    -- Delete the user completely from auth.users so they no longer exist
    DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
