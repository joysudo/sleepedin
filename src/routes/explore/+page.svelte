<script>
    import Navbar from "$lib/components/Navbar.svelte";
    import ExploreIsland from "$lib/components/ExploreIsland.svelte";
</script>

<div class="bg-[url('/bg_landing.png')] bg-cover w-screen h-screen">
    <Navbar />
    <div class="p-4 pl-8">
        <h1
            class="font-tommy-bold text-5xl text-purple-dark wrap-break-word italic"
        >
            explore
        </h1>
        <!-- island on explore page -->
        <div class="flex flex-row flex-wrap gap-4 justify-center">
            <!-- run some script to add these later -->
            <ExploreIsland />
            <ExploreIsland />
            <ExploreIsland /> <ExploreIsland /><ExploreIsland /><ExploreIsland /><ExploreIsland /><ExploreIsland /><ExploreIsland /><ExploreIsland /><ExploreIsland /><ExploreIsland /><ExploreIsland /><ExploreIsland /><ExploreIsland />
        </div>
    </div>
</div>
