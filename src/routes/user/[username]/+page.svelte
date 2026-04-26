<!-- bedroom page -->

<script lang="ts">
    import PixelCanvas from '$lib/components/PixelCanvas.svelte';
    import CreatureMessage from '$lib/components/CreatureMessage.svelte';
    import { supabase } from '$lib/utils/supabaseClient';
    import { currentUser } from '$lib/stores/user';
    import { pixelCreatures } from '$lib/stores/pixelCreatures';
    import { page } from '$app/stores';
    import type { PageUser } from '$lib/utils/constants';
    import type { PageData } from './$types';
    import type { Creature } from '$lib/stores/pixelCreatures';

    let { data }: { data: PageData & { user: PageUser } } = $props();    
    let message = $state('');

    async function loadCreatures(userId: string) {
        const { data: creatures } = await supabase
            .from('pixel_creatures')
            .select('pixel_art, message, author_id')
            .eq('target_user_id', userId);
        pixelCreatures.set(creatures || []);
    }

    async function handleSave(grid: number[][]) {
        const user = $currentUser;
        if (!user) return;
        await supabase.from('pixel_creatures').insert({
            author_id: user.id, 
            target_user_id: data.user.id,
            pixel_art: grid,
            message
        });
        message = '';
    }

    $effect(() => {
        const userId = data.user?.id;
        loadCreatures(userId);
        const channel = supabase
            .channel('creatures')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public', 
                    table: 'pixel_creatures',
                    filter: `target_user_id=eq.${userId}`
                }, 
                (payload) => {
                    const newCreature = payload.new as Creature;
                    pixelCreatures.update(arr => [...arr, newCreature]);            }
            ).subscribe();
        return () => {
            supabase.removeChannel(channel);
        }
    })
</script>

<h1>{$page.params.username}'s dreamland</h1>
<textarea bind:value={message} placeholder="Leave a message..."></textarea>
<PixelCanvas onFinished={handleSave} />
{#each $pixelCreatures as creature}
    <CreatureMessage pixelArt={creature.pixel_art} message={creature.message} author={creature.author_id}/>
{/each}