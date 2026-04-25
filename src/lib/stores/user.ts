import { writable } from 'svelte/store';
import { supabase } from '$lib/utils/supabaseClient';
import type { User } from '@supabase/supabase-js';

export const currentUser = writable<User | null>(null);

supabase.auth.getSession().then(({data}) => {
    currentUser.set(data.session?.user ?? null);
});


supabase.auth.onAuthStateChange((_event, session) => {
    currentUser.set(session?.user ?? null);
});