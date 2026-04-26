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

<div style="background-image: url('bg_pink.png'); background-size: cover;" class="hover:scale-101 duration-300">
    <a href="/" class="font-tommy-bold text-3xl p-5 absolute text-purple-dark hover:underline decoration-wavy">← back</a>
    <div
        class="w-screen h-screen flex flex-col justify-center items-center gap-4 bg-cover"
    >
        <h1 class="font-tommy-bold text-6xl text-purple-dark">log in</h1>
        <h3 class="font-tommy text-3xl text-purple-dark">welcome back!</h3>
        <hr class="border-0.5 w-[10%] border-purple-dark" />
        <input
            type="text"
            placeholder="cattatime@hackclub.com"
            class="bg-white m-4 font-tommy text-purple-dark p-4 hover:p-5 duration-200 rounded-xl w-[25%] outline-4 outline-purple-dark"
            style="box-shadow: 0px 8px 0px #576EAC, 0px 10px 8px #7472A0;"
            bind:value={email}
        />
        <input
            type="text"
            placeholder="mycoolpassword123"
            class="bg-white text-purple-dark font-tommy p-4 hover:p-5 duration-200 rounded-xl w-[25%] outline-4 outline-purple-dark"
            style="box-shadow: 0px 8px 0px #576EAC, 0px 10px 8px #7472A0;"
            bind:value={password}
        />
    <!-- submit -->
            <submit
                class="m-2 bg-linear-to-b from-teal-light to-blue-bright p-2 hover:p-2.5 hover:[&>div]:p-2.5 active:p-2 active:[&>div]:p-4 duration-200 rounded-xl outline-4 outline-purple-dark flex items-center"
                style="box-shadow: 0px 12px 0px #576EAC, 0px 15px 8px #7472A0;"
            >
                <button
                    class="duration-300 bg-linear-to-b from-blue-bright to-teal-light drop-shadow-md drop-shadow-purple-dark/60 p-2 text-2xl rounded-lg font-tommy-bold text-purple-dark"
                    onclick={login}
                    >GO!</button>
            </submit>
    </div>
</div>
