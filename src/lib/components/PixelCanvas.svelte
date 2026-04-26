<script lang="ts">
    import { writable } from "svelte/store";
    import { DEFAULT_COLORS } from "$lib/utils/constants";
    // fetch if passed in, grab 20x20 zero grid if not
    let {
        existingPixelArt = Array.from({ length: 20 }, () => Array(20).fill(0)),
        colors = DEFAULT_COLORS,
        onFinished,
    } = $props<{
        existingPixelArt?: number[][];
        colors?: string[];
        onFinished?: (grid: number[][]) => void;
    }>();
    // svelte-ignore state_referenced_locally
    let pixelArt = $state(structuredClone(existingPixelArt));

    let currentColorIndex = $state(1);
    let isDrawing = $state(false);

    function paint(rowIndex: number, colIndex: number) {
        if (pixelArt[rowIndex][colIndex] !== currentColorIndex)
            pixelArt[rowIndex][colIndex] = currentColorIndex;
    }
</script>

<svelte:window onmouseup={() => (isDrawing = false)} />

<div class="flex flex-col">
    <div class="palette">
        {#each colors as color, i}
            <button
                class="color-swatch"
                class:selected={currentColorIndex === i}
                style:background-color={color}
                onclick={() => (currentColorIndex = i)}
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
                    onmousedown={() => {
                        isDrawing = true;
                        paint(rowIndex, colIndex);
                    }}
                    onmouseenter={() => isDrawing && paint(rowIndex, colIndex)}
                    aria-label="paint pixel"
                ></button>
            {/each}
        {/each}
    </div>

    <div class="place-self-center">
        <button
            class="text-2xl font-tommy-bold text-purple-dark p-3 duration-200 hover:p-4 hover:scale-102 m-4 bg-linear-to-t from-purple-bright to-pink-light rounded-xl outline-2 outline-purple-dark"
            style="box-shadow: 0px 4px 0px #576EAC, 0px 6px 4px #7472A0;"
            onclick={() =>
                (pixelArt = Array(20)
                    .fill(0)
                    .map(() => Array(20).fill(0)))}>clear</button
        >
        <button
            class="text-2xl font-tommy-bold text-purple-dark p-3 duration-200 hover:p-4 hover:scale-102 m-4 -ml-2 bg-linear-to-b from-white to-pink-light rounded-xl outline-2 outline-purple-dark"
            style="box-shadow: 0px 4px 0px #576EAC, 0px 6px 4px #7472A0;"
            onclick={() => {
                onFinished?.(pixelArt);
            }}>save</button
        >
    </div>
</div>

<style>
    /* palette */
    .palette {
        display: flex;
        gap: 0.1rem;
        place-self: center;
        margin: 0.5rem;
    }
    .color-swatch {
        width: 2rem;
        height: 2rem;
        padding: 0;
        border: 2px solid #576eac50;
    }
    .color-swatch.selected {
        border: 2px solid #576eac;
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
        border: 1px solid #576eac50;
        /* oh pls restyle */
    }
</style>
