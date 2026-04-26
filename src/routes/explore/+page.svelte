<script>
    import Navbar from "$lib/components/Navbar.svelte";
    import ExploreIsland from "$lib/components/ExploreIsland.svelte";
    let { data } = $props();
</script>

<div class="bg-[url('/bg_blue_and_teal.png')] bg-cover w-screen h-screen">
    <Navbar />

    <div class="p-4 pl-8">
        <h1
            class="font-tommy-bold text-5xl text-purple-dark wrap-break-word italic"
        >
            explore
        </h1>
        <!-- island on explore page -->
        <div class="flex flex-row flex-wrap gap-4 justify-center">
            {#if data.usernames.length > 0}
                {#each data.usernames as user}
                    <ExploreIsland username={user.username} />
                {/each}
            {:else}
                <p>No usernames found.</p>
            {/if}
        </div>
    </div>
</div>
