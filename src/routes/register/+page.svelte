<script lang="ts">
import { goto } from '$app/navigation';
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
    if (username) {
        goto(`/user/${username}`);
    }

}
</script>

<div
    style="background-image: url('bg_teal.png'); background-size: cover;"
    class="hover:scale-101 duration-300"
>
    <a
        href="/"
        class="font-tommy-bold text-3xl p-5 absolute text-purple-dark hover:underline decoration-wavy"
        >← back</a
    >
    <div
        class="w-screen h-screen flex flex-col justify-center items-center gap-4 bg-cover"
    >
        <h1 class="font-tommy-bold text-6xl text-purple-dark">sign up</h1>
        <h3 class="font-tommy text-3xl text-purple-dark">bunny time</h3>
        <hr class="border-0.5 w-[10%] border-purple-dark" />
        <!-- inputs -->
        <div class="flex flex-col gap-6 m-4 w-[25%]">
            <input
                type="text"
                placeholder="make a cute username"
                class="bg-white font-tommy text-purple-dark p-4 hover:p-5 duration-200 rounded-xl outline-4 outline-purple-dark"
                style="box-shadow: 0px 8px 0px #576EAC, 0px 10px 8px #7472A0;"
                bind:value={username}
            />
            <input
                type="text"
                placeholder="enter your email"
                class="bg-white font-tommy text-purple-dark p-4 hover:p-5 duration-200 rounded-xl outline-4 outline-purple-dark"
                style="box-shadow: 0px 8px 0px #576EAC, 0px 10px 8px #7472A0;"
                bind:value={email}
            />
            <input
                type="text"
                placeholder="make a strong password"
                class="bg-white text-purple-dark font-tommy p-4 hover:p-5 duration-200 rounded-xl outline-4 outline-purple-dark"
                style="box-shadow: 0px 8px 0px #576EAC, 0px 10px 8px #7472A0;"
                bind:value={password}
            />
        </div>

        <!-- submit -->
        <submit
            class="m-2 bg-linear-to-b from-pink-light to-purple-bright p-2 hover:p-2.5 hover:[&>div]:p-2.5 active:p-2 active:[&>div]:p-4 duration-200 rounded-xl outline-4 outline-purple-dark flex items-center"
            style="box-shadow: 0px 12px 0px #576EAC, 0px 15px 8px #7472A0;"
        >
            <button
                class="duration-300 bg-linear-to-b from-purple-bright to-pink-light drop-shadow-md drop-shadow-purple-dark/60 p-2 text-2xl rounded-lg font-tommy-bold text-purple-dark"
                onclick={register}
            >
                GO!
            </button>
        </submit>
    </div>
</div>

