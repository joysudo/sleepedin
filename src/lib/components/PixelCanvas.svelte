<script lang="ts">
    import { writable } from "svelte/store";
    // fetch if passed in, grab 20x20 zero grid if not
    const { existingPixelArt = Array.from({ length: 20 }, () => Array(20).fill(0)) } = $props();
    const colors: string[] = [
        "pink",
        "orange",
        "yellow",
        "green",
        "blue",
        "purple",
        "black",
        "transparent"
    ];

    // svelte-ignore state_referenced_locally
    let pixelArt = $state(structuredClone(existingPixelArt));
    $effect(() => {
        pixelArt = structuredClone(existingPixelArt);
    })
    let currentColorIndex = $state(1);
</script>

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


<style>
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
    }
</style>