-- Create the tour_history table
CREATE TABLE IF NOT EXISTS tour_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    poi_name TEXT NOT NULL, -- Store the POI name instead of foreign key
    location TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    transcript TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE tour_history ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to read their own tour history
CREATE POLICY "Users can view their own tour history" ON tour_history
    FOR SELECT USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own tour history
CREATE POLICY "Users can insert their own tour history" ON tour_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update their own tour history
CREATE POLICY "Users can update their own tour history" ON tour_history
    FOR UPDATE USING (auth.uid() = user_id);

-- Create a policy that allows users to delete their own tour history
CREATE POLICY "Users can delete their own tour history" ON tour_history
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tour_history_user_id ON tour_history(user_id);
CREATE INDEX IF NOT EXISTS idx_tour_history_completed_at ON tour_history(completed_at);
CREATE INDEX IF NOT EXISTS idx_tour_history_poi_name ON tour_history(poi_name); 