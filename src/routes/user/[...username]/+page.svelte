<script lang="ts">
    const furnitureImageModules = import.meta.glob(
        "/src/lib/assets/furniture/*.png",
        {
            eager: true,
            import: "default",
        },
    );

    let pfpEdit = $state(false);


    const pfpImages = Object.values(furnitureImageModules);
    import { currentUserData } from "$lib/stores/userdata";
    import { get } from "svelte/store";
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
            .eq("target_user_id", userId)
            .limit(24); // Ensure we don't fetch more than 24

        // 1. Create all 24 possible positions
        let positions = [];
        for (let x = 1; x <= 6; x++) {
            for (let y = 1; y <= 4; y++) {
                positions.push({ x, y });
            }
        }

        // 2. Shuffle the positions (Fisher-Yates)
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }

        // 3. Assign positions to existing creatures
        const positionedCreatures = (creatures || []).map((c, index) => ({
            ...c,
            gridX: positions[index].x,
            gridY: positions[index].y,
            offsetX: (Math.random() - 0.5) * 20,
        }));

        pixelCreatures.set(positionedCreatures);
    }

    async function handleSave(grid: number[][]) {
        const user = $currentUser;
        if (!user) return;

        // Note: We don't calculate coordinates here because Supabase
        // doesn't store them. We just send the data.
        await supabase.from("pixel_creatures").insert({
            author_id: user.id,
            target_user_id: data.user.id,
            pixel_art: grid,
            message,
        });

        message = "";
    }


    // Inside your <script> tag
    async function updateBio() {
        const user = $currentUser;
        if (!user) return;

        // We use data.user.bio because it's bound to the textarea
        const { error } = await supabase
            .from("users") // Changed from "profiles" to "users"
            .update({ bio: data.user.bio })
            .eq("id", user.id);

        if (error) {
            console.error('Update failed:', error);
            alert("Failed to save bio.");
        } else {
            alert("Bio updated!");
        }
    }

    async function updatePFP(path: string) {
        const user = $currentUser;
        if (!user) return;

        const { error } = await supabase
            .from("users")
            .update({ avatar_url: path })
            .eq("id", user.id);

        if (!error) {
            // Update local state so the UI reflects the change immediately
            data.user.avatar_url = path; 
        }
    }
    $effect(() => {
        const userId = data.user?.id;
        if (!userId) return;

        loadCreatures(userId);

        const channel = supabase
            .channel(`user-creatures-${userId}`)
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
                    const current = get(pixelCreatures);
                    // $pixelCreatures, not get
                    // 1. Determine which spots are currently taken
                    const occupied = new Set(
                        current.map((c) => `${c.gridX},${c.gridY}`),
                    );

                    // 2. Find all possible spots
                    const allPositions = [];
                    for (let y = 1; y <= 4; y++) {
                        for (let x = 1; x <= 6; x++) {
                            allPositions.push({ x, y });
                        }
                    }

                    const emptyPositions = allPositions.filter(
                        (p) => !occupied.has(`${p.x},${p.y}`),
                    );

                    let finalX, finalY;

                    if (emptyPositions.length > 0) {
                        // Pick an empty spot
                        const spot =
                            emptyPositions[
                                Math.floor(
                                    Math.random() * emptyPositions.length,
                                )
                            ];
                        finalX = spot.x;
                        finalY = spot.y;
                    } else {
                        // Replace a random spot
                        finalX = Math.floor(Math.random() * 6) + 1;
                        finalY = Math.floor(Math.random() * 4) + 1;
                    }

                    const positionedNewCreature: Creature = {
                        ...newCreature,
                        gridX: finalX, // Use the local variable calculated above
                        gridY: finalY, // Use the local variable calculated above
                        offsetX: (Math.random() - 0.5) * 20,
                    };

                    pixelCreatures.update((arr) => {
                        // Remove the old creature at that spot (if any) and add the new one
                        const filtered = arr.filter(
                            (c) => !(c.gridX === finalX && c.gridY === finalY),
                        );
                        return [...filtered, positionedNewCreature];
                    });
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    });
</script>

<div class="bg-[url('/bg_blue_sky.png')] bg-cover">
    <Navbar />
    <div class="flex flex-row media-query">
        <div class="md:w-1/2 p-8">
            <div class="flex items-center gap-4">
                {#if data.user?.avatar_url}
                    <img 
                        src={data.user.avatar_url} 
                        alt="pfp" 
                        class="w-[80px] h-[80px] object-contain"
                    />
                {/if}

                <h1 class="font-tommy-bold text-5xl text-purple-dark italic wrap-break-word w-full">
                    {$page.params.username}'s dreamland
                </h1>
            </div>
            <div class="cloud-container">
                <img
                    src="/images/cloud_platform.png"
                    class="base-image"
                    alt=""
                />
                <div class="grid-overlay">
                    {#each Array(24) as _, i}
                        <div class="cell"></div>
                    {/each}
                    {#each $pixelCreatures.sort((a, b) => (a.gridY ?? 0) - (b.gridY ?? 0)) as creature}
                        <div
                            class="cell creature-cell"
                            style:grid-column={creature.gridX}
                            style:grid-row={creature.gridY}
                            style:z-index={creature.gridY}
                            style="position: relative;"
                        >
                            <div
                                // style:transform="translateX({creature.offsetX}px)"
                                class="w-full flex items-end"
                                style="position: absolute; bottom: 0;"
                            >
                                <CreatureMessage
                                    pixelArt={creature.pixel_art}
                                    message={creature.message}
                                    author={creature.author_id}
                                />
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
            <!-- furniture -->
            <!-- click to open thing -->
             {#if $currentUser && $currentUser.id === data.user.id}
                <button
                    class="flex justify-items-center text-enter p-4 m-2 outline-4 outline-purple-dark bg-linear-to-b from-purple-light to-blue-50 dark-purple-box-shadow rounded-2xl text-wrap font-tommy-bold text-3xl text-purple-dark w-fit hover:scale-105 active:scale-95 duration-200"
                    onclick={() => (pfpEdit = !pfpEdit)}
                >
                    {pfpEdit == true ? "select & refresh to save" : "first time? change pfp!"}
                </button>
                <!-- actual thing -->
                <div
                    class={pfpEdit == false
                        ? "hidden"
                        : "flex flex-row gap-4 p-4 m-2 outline-4 outline-purple-dark bg-linear-to-b from-purple-light to-blue-50 dark-purple-box-shadow rounded-2xl overflow-x-scroll [&>img]:h-[75px]"}
                >
                    {#each pfpImages as src}
                        <button type="button" onclick={() => updatePFP(src)}>
                            <img
                                {src}
                                alt="pfp option"
                                class="hover:scale-105 duration-100 {data.user.avatar_url === src ? 'border-4 border-purple-dark' : ''}"                    
                            />
                        </button>
                    {/each}
                </div>
            {/if}
            </div>
            <div class="right-col md:w-1/2 p-8">
                <div
                    class="p-4 mb-6 mx-6 flex flex-col w-full gap-2 bg-linear-to-b from-pink-light to-purple-light outline-4 outline-purple-dark dark-purple-box-shadow rounded-2xl"
                >
                    <h1 class="font-tommy-bold text-4xl text-purple-dark">
                        about
                    </h1>
                    {#if $currentUser && $currentUser.id === data.user.id}
                        <div class="flex flex-col md:flex-row w-full gap-3">
                            <textarea 
                                bind:value={data.user.bio} 
                                placeholder="Tell us about yourself..."
                                class="w-full p-3 rounded-xl border-2 border-purple-dark font-tommy text-xl resize-none outline-none focus:ring-2 focus:ring-purple-dark/20"
                                rows="4"
                            ></textarea>
                            <button 
                                onclick={updateBio}
                                class="w-fit px-6 py-2 bg-purple-dark text-white font-tommy-bold rounded-full hover:scale-105 active:scale-95 transition-transform"
                            >
                                Save Changes
                            </button>
                        </div>
                    {:else}
                        <p class="font-tommy text-3xl text-purple-dark">
                            {data.user.bio || "this is the default about/bio paragraph. this user hasn't edited it yet! hmm they must be really nonchalant or maybe they just forgot to write it."}
                        </p>
                    {/if}
                </div>
                <div
                    class="flex flex-col w-full mb-6 mx-6 p-4 gap-2 bg-linear-to-b from-teal-light to-blue-bright outline-4 outline-purple-dark dark-purple-box-shadow rounded-2xl"
                >
                    <h1 class="font-tommy-bold text-4xl text-purple-dark">
                        send a bunny!
                    </h1>
                    <div class="gap-24 items-start flex flex-row media-query">
                        <div class="w-[45%] place-self-center">
                            <PixelCanvas onFinished={handleSave} />
                        </div>
                        <!-- text -->
                        <div class="text-bubble">
                            <textarea
                                bind:value={message}
                                placeholder="Leave a message..."
                                class="font-tommy"
                            ></textarea>
                        </div>
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

        /* width: clamp(150px, 25vw, 300px); */
        width: 100%;
        aspect-ratio: 2 / 1;

        border-radius: 30% / 45%;
        background-color: white;
        border: 3px solid var(--color-blue-dull);
    }
    .text-bubble::after {
        content: "";
        position: absolute;
        right: 65%;
        top: 100%;
        width: 10%;
        aspect-ratio: 1;
        background-color: white;
        border-radius: 0 0 50% 50% / 0 0 100% 100%;
        border-left: 3px solid var(--color-blue-dull);
        border-right: 3px solid var(--color-blue-dull);
        border-bottom: 3px solid var(--color-blue-dull);
    }

    .text-bubble textarea {
        width: 80%;
        height: 60%;
        resize: none;
        outline: none;
        color: var(--color-purple-dark);
    }

    .cloud-container {
        position: relative;
        display: inline-block;
        width: 100%;
        margin-top: 10%;
    }

    .cloud-container img {
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
    }

    .base-image {
        display: block;
        width: 100%;
        height: auto;
    }

    .grid-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        width: 80%;
        height: calc(100% * 4 / 7) !important;

        display: grid;
        grid-template-columns: repeat(6, 1fr);
        grid-template-rows: repeat(4, 1fr);
        /* grid-auto-rows: 1fr; */
    }

    .cell {
        position: relative;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        overflow: visible;
        width: 100%;
        height: 100%;
    }

    /* .cell img {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: auto;
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
    } */

    @media (max-width: 768px) {
        .media-query {
            flex-direction: column !important;
        }
    }
</style>

