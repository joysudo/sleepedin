<script lang="ts">
    import PixelCanvas from '$lib/components/PixelCanvas.svelte';
</script>

<h1>Welcome</h1>
<a href="/login">Login</a>
<a href="/register">Register</a>

<PixelCanvas onFinished={(grid) => console.log("grid data:", $state.snapshot(grid))}/>