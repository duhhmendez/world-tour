-- Create the tours table
CREATE TABLE IF NOT EXISTS tours (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    audio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all users to read tours
CREATE POLICY "Allow public read access to tours" ON tours
    FOR SELECT USING (true);

-- Create a policy that allows authenticated users to insert tours
CREATE POLICY "Allow authenticated users to insert tours" ON tours
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create a policy that allows authenticated users to update their own tours
CREATE POLICY "Allow authenticated users to update tours" ON tours
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a policy that allows authenticated users to delete their own tours
CREATE POLICY "Allow authenticated users to delete tours" ON tours
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create an index on the title for faster searches
CREATE INDEX IF NOT EXISTS idx_tours_title ON tours(title);

-- Create an index on the location for faster searches
CREATE INDEX IF NOT EXISTS idx_tours_location ON tours(location);

-- Insert sample data (optional)
INSERT INTO tours (title, location, description, audio_url) VALUES
(
    'Empire State Building Tour',
    'New York, NY',
    'Standing 1,454 feet tall, the Empire State Building is an Art Deco masterpiece and one of New York''s most iconic landmarks. Completed in 1931, this skyscraper was once the world''s tallest building for nearly 40 years.',
    'https://example.com/audio/empire-state-building.mp3'
),
(
    'Central Park Discovery',
    'New York, NY',
    'A vast urban oasis covering 843 acres, Central Park offers lakes, walking trails, and cultural landmarks in the heart of Manhattan. This green sanctuary was designed by Frederick Law Olmsted and Calvert Vaux in the 1850s.',
    'https://example.com/audio/central-park.mp3'
),
(
    'Times Square Experience',
    'New York, NY',
    'The bustling heart of Manhattan, Times Square is known for its bright lights, entertainment, and as the crossroads of the world. This iconic intersection is famous for its bright neon signs, Broadway theaters, and the annual New Year''s Eve ball drop.',
    'https://example.com/audio/times-square.mp3'
),
(
    'Brooklyn Bridge Walk',
    'New York, NY',
    'An iconic suspension bridge spanning the East River, connecting Manhattan and Brooklyn. The Brooklyn Bridge, completed in 1883, was the first steel-wire suspension bridge ever constructed.',
    'https://example.com/audio/brooklyn-bridge.mp3'
),
(
    'Statue of Liberty Tour',
    'New York, NY',
    'A symbol of freedom and democracy, standing proudly in New York Harbor. The Statue of Liberty, a gift from France to the United States, has welcomed immigrants and visitors to New York Harbor since 1886.',
    'https://example.com/audio/statue-of-liberty.mp3'
); 