import { writable } from 'svelte/store';

export interface Creature {
    pixel_art: number[][];
    message: string;
    author_id: string;
    gridX?: number;
    gridY?: number;
    offsetX?: number;
}

export const pixelCreatures = writable<Creature[]>([]);