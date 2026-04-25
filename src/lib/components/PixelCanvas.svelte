<script lang="ts">
    import { writable } from "svelte/store";
    // fetch if passed in, grab 20x20 zero grid if not
    const { existingPixelArt = Array.from({ length: 20 }, () => Array(20).fill(0)) } = $props();
    const colors: string[] = [
        "transparent",
        "pink",
        "orange",
        "yellow",
        "green",
        "blue",
        "purple",
        "black"
    ];
    // svelte-ignore state_referenced_locally
    let pixelArt = $state(structuredClone(existingPixelArt));
    $effect(() => {
        pixelArt = structuredClone(existingPixelArt);
    })
    let currentColorIndex = $state(1);
    let isDrawing = $state(false);

    function paint(rowIndex: number, colIndex: number) {
        pixelArt[rowIndex][colIndex] = currentColorIndex;
    }
</script>
<svelte:window onmouseup={() => (isDrawing = false)} />

<div class="palette">
    {#each colors as color, i}
        <button
            class="color-swatch"
            class:selected={currentColorIndex === i}
            style:background-color={color}
            onclick={(() => currentColorIndex = i)}
            aria-label="select color"
        ></button>
    {/each}
</div>

<div class="canvas">
    {#each pixelArt as row, rowIndex}
        {#each row as pixel, colIndex}
            <button
                class="pixel"
                style:background-color={colors[pixel]}
                onmousedown={() => { isDrawing = true; paint(rowIndex, colIndex); }}
                onmouseenter={() => isDrawing && paint(rowIndex, colIndex)}
                aria-label="paint pixel"
            ></button>
        {/each}
    {/each}
</div>

<style>
    /* palette */
    .palette {
        display: flex;
        gap: 0.1rem;
    }
    .color-swatch {
        width: 1rem;
        height: 1rem;
        padding: 0;
        /* border: 0; */
    }
    .color-swatch.selected {
        border: 3px solid black;
        /* restyle dear god restyle joy */
    }
    /* canvas */
    .canvas {
        display: grid;
        grid-template-columns: repeat(20, 1fr);
        grid-template-rows: repeat(20, 1fr);
    }
    .pixel {
        aspect-ratio: 1;
    }
</style>