import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to fetch all POIs
export const fetchPOIs = async () => {
  try {
    const { data, error } = await supabase
      .from('pois')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('Error fetching POIs:', error)
      throw error
    }
    
    return data || []
  } catch (error) {
    console.error('Failed to fetch POIs:', error)
    return []
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