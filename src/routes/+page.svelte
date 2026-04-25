<script lang="ts">
    import PixelCanvas from '$lib/components/PixelCanvas.svelte';
</script>

<a href="/landing">link to landing (will remove later)</a>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<!-- replace onFinished with actual project syncing to supabase -->
<PixelCanvas onFinished={(grid) => console.log("grid data:", $state.snapshot(grid))}/>