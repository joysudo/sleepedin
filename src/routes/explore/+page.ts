import { supabase } from '$lib/utils/supabaseClient';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const { data, error } = await supabase
        .from('users')
        .select('username');

    if (error) {
        console.error('Error:', error);
        return { usernames: [] };
    }

    // Return the data so the +page.svelte can use it
    return {
        usernames: data ?? []
    };
};