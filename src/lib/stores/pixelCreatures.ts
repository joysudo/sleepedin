import { writable } from 'svelte/store';

export interface Creature {
    pixel_art: number[][];
    message: string;
    author_id: string;
}

export const pixelCreatures = writable<Creature[]>([]);