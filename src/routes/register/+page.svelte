<script lang="ts">
import { supabase } from '$lib/utils/supabaseClient';

let email = $state('');
let password = $state('');
let username = $state('');

async function register() {
    // calls supabase auth, doesn't yet add to supabse
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        console.error(error);
        return;
    }

    // actually adds to supabase
    if (data.user) {
        const { error: insertError } = await supabase
                .from('users')
                .insert({
                    id: data.user.id,
                    username
                }
            );

        if (insertError) {
            console.error(insertError);
        }
    }
}
</script>

<input bind:value={username} placeholder="Username" />
<input bind:value={email} placeholder="Email" />
<input bind:value={password} type="password" placeholder="Password" />

<button onclick={register}>Register</button>