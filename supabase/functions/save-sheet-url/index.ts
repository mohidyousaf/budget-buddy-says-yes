
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { p_id, p_url } = await req.json()

    // Create a Supabase client with the auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Check if the record exists
    const { data: existingData } = await supabaseClient
      .from('user_settings')
      .select('id')
      .eq('id', p_id)
      .single()

    let result
    
    if (existingData) {
      // Update existing record
      result = await supabaseClient
        .from('user_settings')
        .update({ sheet_url: p_url })
        .eq('id', p_id)
    } else {
      // Insert new record
      result = await supabaseClient
        .from('user_settings')
        .insert([{ id: p_id, sheet_url: p_url }])
    }

    if (result.error) {
      throw result.error
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error saving sheet URL:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
