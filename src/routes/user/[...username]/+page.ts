// server load for bedroom data

import { supabase } from '$lib/utils/supabaseClient';

export async function load({ params }) {
    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('username', params.username)
        .maybeSingle();
  return { user };
}