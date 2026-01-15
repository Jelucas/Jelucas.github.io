/** AUDIO_MANAGER.JS - Gerenciamento de Sons */

const audiosPreloaded = {
    'erro': new Audio('som/som.mp3') // O seu som de erro "som.mp3"
};

// Pré-carrega sons de 1 a 10 dentro da pasta som/
for (let i = 1; i <= 10; i++) {
    audiosPreloaded[i.toString()] = new Audio(`som/${i}.mp3`);
    audiosPreloaded[i.toString()].preload = 'auto';
}
audiosPreloaded['erro'].preload = 'auto';

/**
 * Toca um som aleatório de 1 a 10 para sucesso
 */
function playSuccessSound() {
    const numeroAleatorio = Math.floor(Math.random() * 10) + 1;
    const som = audiosPreloaded[numeroAleatorio.toString()];
    
    if (som) {
        som.currentTime = 0; // Reinicia o som caso clique rápido
        som.play().catch(e => console.log("Erro ao tocar som de sucesso:", e));
    }
}

/**
 * Toca o som de erro (som.mp3)
 */
function playErrorSound() {
    const somErro = audiosPreloaded['erro'];
    if (somErro) {
        somErro.currentTime = 0;
        somErro.play().catch(e => console.log("Erro ao tocar som de erro:", e));
    }
}