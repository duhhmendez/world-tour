import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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