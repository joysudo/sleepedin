<script lang="ts">
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/utils/supabaseClient';

    let email = $state('');
    let password = $state('');
    // let username = $state('');

    async function login() {
        console.log('login function initialized');
        const { data: data1, error: error1 } = await supabase.auth.signInWithPassword({ email, password });
        if (error1) {
            console.error('login failed because ', error1.message);
            return;
        }
        // const username = data.user.user_metadata.username;
        const { data: data2, error: error2 } = await supabase 
            .from('users')
            .select('username')
            .eq('id', data1.user.id)
            .maybeSingle();
        const username = data2?.username;
        console.log('username: ', username);
        if (username) {
            goto(`/user/${username}`);
        }
    }
</script>

<input bind:value={email} placeholder="Email" />
<input bind:value={password} type="password" placeholder="Password" />
<button onclick={login}>Login</button>