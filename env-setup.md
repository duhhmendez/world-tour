# Environment Variables Setup

To fix the "No POIs available" issue, you need to create a `.env` file in the root directory with your Supabase credentials.

## Required Environment Variables

Create a file called `.env` in the root directory with the following content:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How to Get These Values

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "Project URL" and paste it as `VITE_SUPABASE_URL`
4. Copy the "anon public" key and paste it as `VITE_SUPABASE_ANON_KEY`

## Example

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

After creating the `.env` file, restart your development server for the changes to take effect. 