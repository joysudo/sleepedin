import { writable } from 'svelte/store';
import { supabase } from '$lib/utils/supabaseClient';

export const currentUsername = writable<string | null>(null);

async function fetchUsername(userId: string) {
    const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('id', userId)
        .maybeSingle();

    if (!error && data) {
        currentUsername.set(data.username);
    }
}

// 1. Check current session immediately on load
const init = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        await fetchUsername(session.user.id);
    }
};

init();

// 2. Then listen for changes
supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
        await fetchUsername(session.user.id);
    } else {
        currentUsername.set(null);
    }
});