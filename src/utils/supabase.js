import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_KEY

export const supabase = (url && key) ? createClient(url, key) : null

export async function savePatient(data) {
  if (!supabase) return null
  const { error } = await supabase.from('patients').insert([data])
  if (error) console.error(error)
}