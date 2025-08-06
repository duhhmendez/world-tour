# World Tour App

A mobile-first React web application that provides location-based audio tours with Supabase integration. The app simulates the iOS app experience inside Safari on iPhone 14 Pro running iOS 16.2.

## Features

- 📍 **Location-based Tour Discovery**: Automatically detects when you're within range of a tour location
- 🎧 **Audio Narration**: Uses Web Speech API for high-quality audio tours
- 📱 **Mobile-First Design**: Optimized for iPhone 14 Pro (393px × 852px viewport)
- ♿ **Accessibility**: Screen reader friendly with proper ARIA labels
- 🎨 **iOS-like UI**: Follows Apple's Human Interface Guidelines
- 🧪 **Development Mode**: Simulate location for testing
- 🗄️ **Supabase Integration**: Real-time database for tour management
- 📊 **Tour Management**: View all tours from Supabase database

## Tech Stack

- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Web Speech API** for audio narration
- **Geolocation API** for location detection
- **Supabase** for database and real-time features

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Supabase account and project

### 1. Clone and Install

```bash
git clone <repository-url>
cd worldtourwebsite
npm install
```

### 2. Set up Supabase

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your credentials** from your project settings:
   - Go to Settings → API
   - Copy your `Project URL` and `anon public` key

3. **Create environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### 3. Set up the Database

1. **Open your Supabase dashboard**
2. **Go to SQL Editor**
3. **Run the schema** from `supabase-schema.sql`:
   ```sql
   -- Copy and paste the contents of supabase-schema.sql
   ```

This will create:
- `tours` table with proper structure
- Row Level Security (RLS) policies
- Sample tour data
- Indexes for performance

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
worldtourwebsite/
├── src/
│   ├── components/
│   │   ├── WorldTour.jsx      # Main app component
│   │   ├── PastTours.jsx      # Tour history
│   │   ├── Tours.jsx          # Supabase tours
│   │   └── About.jsx          # About page
│   ├── lib/
│   │   └── supabaseClient.js  # Supabase configuration
│   ├── data/
│   │   └── tours.json         # Local tour data
│   ├── App.jsx                # App routing
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── supabase-schema.sql        # Database schema
├── .env.example              # Environment variables template
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Database Schema

### Tours Table

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `title` | TEXT | Tour title |
| `location` | TEXT | Tour location |
| `description` | TEXT | Tour description |
| `audio_url` | TEXT | Audio file URL (optional) |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## Usage

### Real Location Testing

1. Allow location access when prompted
2. Move within range of a tour location
3. Tap "Play Tour" to hear the audio narration
4. Use "Repeat" to hear the tour again

### Development Testing

1. Click "Simulate Location" to test without being physically at a location
2. The app will show nearby tours
3. Test the audio playback functionality

### Supabase Tours

1. Navigate to the "Tours" tab
2. View all tours from your Supabase database
3. Play audio files if available
4. Refresh to load latest data

## Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add Supabase integration"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub account
   - Import your repository

3. **Add Environment Variables**:
   - In your Vercel project settings
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Use the same values from your `.env` file

4. **Deploy**:
   - Vercel will automatically deploy on push
   - Your app will be available at `https://your-project.vercel.app`

### Environment Variables for Production

Make sure to set these in your Vercel project settings:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Adding New Tours

### Via Supabase Dashboard

1. Go to your Supabase dashboard
2. Navigate to Table Editor → tours
3. Click "Insert row"
4. Fill in the tour details
5. Save the record

### Via SQL

```sql
INSERT INTO tours (title, location, description, audio_url) VALUES
(
    'Your Tour Title',
    'Location Name',
    'Tour description here...',
    'https://example.com/audio-file.mp3'
);
```

## Troubleshooting

### Common Issues

1. **Environment Variables Not Working**:
   - Make sure your `.env` file is in the root directory
   - Restart the development server after adding variables
   - Check that variable names start with `VITE_`

2. **Supabase Connection Issues**:
   - Verify your URL and key are correct
   - Check that RLS policies are set up properly
   - Ensure your Supabase project is active

3. **Audio Not Playing**:
   - Check that audio URLs are accessible
   - Verify CORS settings for audio files
   - Test with different audio formats

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [Vite documentation](https://vitejs.dev/guide/)
- Check browser console for error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## License

This project is for demonstration purposes.

## Support

For support, please open an issue on GitHub or contact the development team. 