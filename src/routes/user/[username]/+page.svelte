<!-- bedroom page --> 
<script lang="ts">
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
<div class="flex flex-row">
    <div class="md:w-2/3">
        <h1>{$page.params.username}'s dreamland</h1> 
        {#each $pixelCreatures as creature}
            <CreatureMessage
                pixelArt={creature.pixel_art}
                message={creature.message}
                author={creature.author_id}
            />
        {/each}
    </div> 
    <div class="right-col md:w-1/3">
        <div>
            <h1>bio</h1> 
            <p>about blah blah blah</p>
        </div> 
        <div class="flex flex-row">
            <PixelCanvas onFinished={handleSave} /> 
            <div class="text-bubble">
                <textarea bind:value={message} placeholder="Leave a message..."
                ></textarea>
            </div>
        </div>
    </div>
</div> 
<style>
    .text-bubble {
        position: relative; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        text-align: center; 
        font-size: clamp(0.75rem, 1.5vw, 1rem); 
        line-height: 1; 
        width: auto; 
        max-width: 100%; 
        padding: 5%; 
        border-radius: 30% / 45%; 
        background-color: white; 
        border: 3px solid black; 
        overflow: visible;
    } 
    .text-bubble::after {
        content: ""; 
        position: absolute; 
        right: 50%; 
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
