<script lang="ts">
    let { pixelArt, message, author } = $props();
    import { DEFAULT_COLORS } from '$lib/utils/constants';
    let isActive = $state(false);
    const croppedArt = $derived.by(() => {
        if (!pixelArt || pixelArt.length === 0) return [];
        
        // Find the last row that contains any non-zero pixel
        const lastContentRowIndex = pixelArt.map((row: number[]) => 
            row.some(pixel => pixel !== 0)
        ).lastIndexOf(true);

        // Slice from start to the last row with content (+1 to include that row)
        return lastContentRowIndex === -1 ? [] : pixelArt.slice(0, lastContentRowIndex + 1);
    });
    const randomDelay = (Math.random() * -5).toFixed(2) + 's';
    const randomDuration = (1 + Math.random() * 2).toFixed(2) + 's';
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="creature"
    class:active={isActive} 
    onclick={() => isActive = !isActive}
    style:--sway-delay={randomDelay}
    style:--sway-duration={randomDuration}
>
    <img src="/images/shadow.png" alt="" class="shadow"/>
    <div class="text">
        <p>{message}</p>
    </div>
    <div class="canvas">
        {#each croppedArt as row, rowIndex}
            {#each row as pixel, colIndex}
                <div class="pixel" style:background-color={DEFAULT_COLORS[pixel]}></div>
            {/each}
        {/each}
    </div>
</div>

<style>
    .creature {
        width: 100%;
        position: relative;
    }
    .canvas {
        display: grid;
        grid-template-columns: repeat(20, 1fr);   
        width: 100%;
        height: auto;
        transform-origin: bottom center;
        animation: sway var(--sway-duration, 4s) ease-in-out var(--sway-delay, 0s) infinite alternate;
    }

    @keyframes sway {
        0% {
                transform: rotate(-2deg);
            }
        100% {
            transform: rotate(2deg);
        }
    }

    .pixel {
        aspect-ratio: 1;
    }

    .text {
        width: 200%;
        transform: translateX(-25%);
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        pointer-events: none; 
        line-height: 1;
        overflow-wrap: break-word;
        word-break: break-all;
        hyphens: auto;
        font-size: clamp(0.5rem, 0.5rem + 0.2vw, 1rem);
        background-color: white;
        padding: 1px 4px;
        border-radius: 3px;
        color: var(--color-purple-dark);
        border: 2px solid var(--color-purple-dark);
    }

    .creature:hover .text, 
    .creature.active .text {
        opacity: 1;
        pointer-events: auto;
    }

    .shadow {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: auto;
        pointer-events: none;
        z-index: -1;
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
        box-shadow: none !important;
    }
</style>