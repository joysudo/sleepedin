import { writable } from 'svelte/store';
import { supabase } from '$lib/utils/supabaseClient';
import { browser } from '$app/environment';
import type { User } from '@supabase/supabase-js';

export interface CurrentUserData {
    user: User | null;
    username: string | null;
    loading: boolean;
}

export const currentUserData = writable<CurrentUserData>({ 
    user: null, 
    username: null, 
    loading: true 
});

async function fetchUsername(userId: string): Promise<string | null> {
    console.log("Checking DB for UID:", userId); // DEBUG LOG
    try {
        const { data, error } = await supabase
            .from('users')
            .select('username')
            .eq('id', userId)
            .maybeSingle();

        if (error) {
            console.error("Supabase Query Error:", error);
            return null;
        }

        console.log("DB Result:", data); // DEBUG LOG
        return data?.username ?? null;
    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
}

// Only run auth logic in the browser to avoid Lock API issues
if (browser) {
    supabase.auth.onAuthStateChange(async (event, session) => {
        // Log the event to see what's happening (SIGNED_IN, INITIAL_SESSION, etc)
        console.log("Auth Event:", event);

        if (session?.user) {
            const username = await fetchUsername(session.user.id);
            currentUserData.set({ 
                user: session.user, 
                username, 
                loading: false 
            });
        } else {
            currentUserData.set({ 
                user: null, 
                username: null, 
                loading: false 
            });
        }
    });
}