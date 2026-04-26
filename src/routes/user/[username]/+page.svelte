<!-- bedroom page -->
<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import PixelCanvas from "$lib/components/PixelCanvas.svelte";
    import CreatureMessage from "$lib/components/CreatureMessage.svelte";
    import { supabase } from "$lib/utils/supabaseClient";
    import { currentUser } from "$lib/stores/user";
    import { pixelCreatures } from "$lib/stores/pixelCreatures";
    import { page } from "$app/stores";
    import type { PageUser } from "$lib/utils/constants";
    import type { PageData } from "./$types";
    import type { Creature } from "$lib/stores/pixelCreatures";
    let { data }: { data: PageData & { user: PageUser } } = $props();
    let message = $state("");
    async function loadCreatures(userId: string) {
        const { data: creatures } = await supabase
            .from("pixel_creatures")
            .select("pixel_art, message, author_id")
            .eq("target_user_id", userId);
        pixelCreatures.set(creatures || []);
    }
    async function handleSave(grid: number[][]) {
        const user = $currentUser;
        if (!user) return;
        await supabase.from("pixel_creatures").insert({
            author_id: user.id,
            target_user_id: data.user.id,
            pixel_art: grid,
            message,
        });
        message = "";
    }
    $effect(() => {
        const userId = data.user?.id;
        loadCreatures(userId);
        const channel = supabase
            .channel("creatures")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "pixel_creatures",
                    filter: `target_user_id=eq.${userId}`,
                },
                (payload) => {
                    const newCreature = payload.new as Creature;
                    pixelCreatures.update((arr) => [...arr, newCreature]);
                },
            )
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    });
</script>

<Navbar />
<div class="flex flex-row">
    <div class="md:w-1/2 p-8">
        <h1 class="font-tommy-bold text-5xl text-purple-dark">
            {$page.params.username}'s dreamland
        </h1>
        {#each $pixelCreatures as creature}
            <CreatureMessage
                pixelArt={creature.pixel_art}
                message={creature.message}
                author={creature.author_id}
            />
        {/each}
    </div>
    <div class="right-col md:w-1/2 p-8">
        <div class="p-4 flex flex-col gap-2">
            <h1 class="font-tommy-bold text-4xl text-purple-dark">about</h1>
            <p class="font-tommy text-3xl text-purple-dark">
                yap yap yap yap.. yap yap yap... joysudo cattatime hurray! i
                llike bunnies and rabbits and sleeping in zzzzz i like svelte
                and i dont like tailwind css it makes the html look ugly
            </p>
        </div>
        <div class="flex flex-col p-4 gap-2">
            <h1 class="font-tommy-bold text-4xl text-purple-dark">
                send a bunny!
            </h1>
            <div class="gap-6 items-start flex flex-row">
                <div class="w-[45%] place-self-center">
                    <PixelCanvas onFinished={handleSave} />
                </div>
                <div class="text-bubble">
                    <textarea
                        bind:value={message}
                        placeholder="Leave a message..."
                    ></textarea>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .text-bubble {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        width: clamp(150px, 25vw, 300px);
        aspect-ratio: 2 / 1;

        padding: 1rem;
        border-radius: 30% / 45%;
        background-color: white;
        border: 3px solid black;
    }
    .text-bubble::after {
        content: "";
        position: absolute;
        right: 65%;
        top: 100%;
        width: 10%;
        height: 20%;
        background-color: white;
        border-radius: 0 0 50% 50% / 0 0 100% 100%;
        border-left: 3px solid black;
        border-right: 3px solid black;
        border-bottom: 3px solid black;
    }
</style>
