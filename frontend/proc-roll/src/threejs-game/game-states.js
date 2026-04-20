import { ref } from 'vue';

export const currentLevel = ref(0);
export const gameState = ref(1);

export function levelCompleted() {
    gameState.value = 2;
}

export function playerDied() {
    gameState.value = 0;
}

export function startNextLevel() {
    
}