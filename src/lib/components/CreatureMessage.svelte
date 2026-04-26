<script lang="ts">
    let { pixelArt, message, author } = $props();
    import { DEFAULT_COLORS } from '$lib/utils/constants';
</script>

<div class="creature">
    <div class="canvas">
        {#each pixelArt as row, rowIndex}
            {#each row as pixel, colIndex}
                <div class="pixel" style:background-color={DEFAULT_COLORS[pixel]}></div>
            {/each}
        {/each}
    </div>
    <p>{message}</p>
    <p>by {author}</p>
</div>

<style>
    .canvas {
        display: grid;
        grid-template-columns: repeat(20, 1fr);        
    }
    .pixel {
        width: 0.5rem; /* placeholder */
        aspect-ratio: 1;
    }
</style>