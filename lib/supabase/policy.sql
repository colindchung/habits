-- Create a policy to allow all users to select data
CREATE POLICY "Allow all users to read" 
ON daily_notes 
FOR SELECT 
USING (true);

CREATE POLICY "Allow admin writes" 
ON daily_notes 
FOR INSERT
  WITH CHECK (
    auth.uid () = '<ID>'
  )
;

CREATE POLICY "Allow admin writes update"
ON daily_notes
FOR UPDATE
  USING (
    auth.uid () = '<ID>'
  )
;