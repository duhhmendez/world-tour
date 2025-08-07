-- Create the pois table
CREATE TABLE IF NOT EXISTS pois (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL, -- Format: "latitude,longitude" (e.g., "40.7484,-73.9857")
    script TEXT NOT NULL, -- Audio script/description
    radius INTEGER DEFAULT 50, -- Detection radius in meters
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE pois ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all users to read pois
CREATE POLICY "Allow public read access to pois" ON pois
    FOR SELECT USING (true);

-- Create a policy that allows authenticated users to insert pois
CREATE POLICY "Allow authenticated users to insert pois" ON pois
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create a policy that allows authenticated users to update pois
CREATE POLICY "Allow authenticated users to update pois" ON pois
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a policy that allows authenticated users to delete pois
CREATE POLICY "Allow authenticated users to delete pois" ON pois
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create an index on the name for faster searches
CREATE INDEX IF NOT EXISTS idx_pois_name ON pois(name);

-- Create an index on the location for faster searches
CREATE INDEX IF NOT EXISTS idx_pois_location ON pois(location);

-- Insert sample POI data
INSERT INTO pois (name, location, script, radius) VALUES
(
    'Empire State Building',
    '40.7484,-73.9857',
    'Standing 1,454 feet tall, the Empire State Building is an Art Deco masterpiece and one of New York''s most iconic landmarks. Completed in 1931, this skyscraper was once the world''s tallest building for nearly 40 years. The building features 102 floors and offers spectacular views of the city from its observation deck.',
    50
),
(
    'Central Park',
    '40.7829,-73.9654',
    'A vast urban oasis covering 843 acres, Central Park offers lakes, walking trails, and cultural landmarks in the heart of Manhattan. This green sanctuary was designed by Frederick Law Olmsted and Calvert Vaux in the 1850s. The park features numerous attractions including Bethesda Fountain, the Central Park Zoo, and the Great Lawn.',
    100
),
(
    'Times Square',
    '40.7580,-73.9855',
    'The bustling heart of Manhattan, Times Square is known for its bright lights, entertainment, and as the crossroads of the world. This iconic intersection is famous for its bright neon signs, Broadway theaters, and the annual New Year''s Eve ball drop. It''s one of the most visited tourist attractions in the world.',
    75
),
(
    'Brooklyn Bridge',
    '40.7061,-73.9969',
    'An iconic suspension bridge spanning the East River, connecting Manhattan and Brooklyn. The Brooklyn Bridge, completed in 1883, was the first steel-wire suspension bridge ever constructed. The bridge features a distinctive Gothic-style architecture and offers stunning views of the Manhattan skyline.',
    60
),
(
    'Statue of Liberty',
    '40.6892,-74.0445',
    'A symbol of freedom and democracy, standing proudly in New York Harbor. The Statue of Liberty, a gift from France to the United States, has welcomed immigrants and visitors to New York Harbor since 1886. The statue stands 305 feet tall and represents Libertas, the Roman goddess of freedom.',
    80
),
(
    'Rockefeller Center',
    '40.7587,-73.9787',
    'A complex of 19 commercial buildings covering 22 acres between 48th and 51st Streets in Midtown Manhattan. Rockefeller Center is famous for its Art Deco architecture, the annual Christmas tree lighting, and the Top of the Rock observation deck offering spectacular city views.',
    70
),
(
    'High Line',
    '40.7484,-74.0047',
    'A 1.45-mile-long elevated linear park built on a former freight rail line. The High Line features beautiful gardens, art installations, and unique perspectives of the city. It runs from Gansevoort Street in the Meatpacking District to West 34th Street.',
    50
),
(
    'One World Trade Center',
    '40.7127,-74.0134',
    'The tallest building in the Western Hemisphere, standing 1,776 feet tall. One World Trade Center, also known as the Freedom Tower, was built on the site of the original World Trade Center. The building features the One World Observatory on the 100th, 101st, and 102nd floors.',
    90
); 