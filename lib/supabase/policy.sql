-- Create a policy to allow all users to select data
CREATE POLICY "Allow all users to read" 
ON daily_notes 
FOR SELECT 
USING (true);