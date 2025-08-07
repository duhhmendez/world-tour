import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing')
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Missing')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:')
  console.error('VITE_SUPABASE_URL:', supabaseUrl)
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to fetch all POIs
export const fetchPOIs = async () => {
  try {
    console.log('Fetching POIs from Supabase...')
    console.log('Supabase client:', supabase)
    
    const { data, error } = await supabase
      .from('pois')
      .select('*')
      .order('POI')
    
    console.log('Supabase response:', { data, error })
    
    if (error) {
      console.error('Supabase error fetching POIs:', error)
      throw error
    }
    
    console.log('POIs fetched successfully:', data)
    console.log('Number of POIs:', data?.length || 0)
    
    return data || []
  } catch (error) {
    console.error('Failed to fetch POIs:', error)
    throw error // Re-throw to show error in UI
  }
}

// Helper function to fetch a single POI by ID
export const fetchPOIById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('pois')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching POI:', error)
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Failed to fetch POI:', error)
    return null
  }
}

// Helper function to fetch all tours
export const fetchTours = async () => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .order('title')
    
    if (error) {
      console.error('Error fetching tours:', error)
      throw error
    }
    
    return data || []
  } catch (error) {
    console.error('Failed to fetch tours:', error)
    return []
  }
}

// Helper function to fetch a single tour by ID
export const fetchTourById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching tour:', error)
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Failed to fetch tour:', error)
    return null
  }
}

// Authentication functions
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Tour History functions
export const saveTourHistory = async (tourData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tour_history')
      .insert({
        user_id: user.id,
        poi_name: tourData.title,
        location: tourData.location,
        duration_seconds: tourData.durationSeconds,
        transcript: tourData.transcript
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving tour history:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to save tour history:', error)
    throw error
  }
}

export const fetchTourHistory = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tour_history')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })

    if (error) {
      console.error('Error fetching tour history:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch tour history:', error)
    return []
  }
} 