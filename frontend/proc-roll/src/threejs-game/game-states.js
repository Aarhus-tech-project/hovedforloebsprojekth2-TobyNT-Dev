import { ref } from 'vue';
export let currentLevel = ref(1);
export const gameState = ref(3);

export function levelCompleted() {
    gameState.value = 2;

    currentLevel.value++;
}

export function playerDied() {
    gameState.value = 0;
}