/**
 * PONTO DE ENTRADA CENTRAL (BOOTSTRAP)
 * 
 * Responsabilidade Única (SRP):
 * Inicializar e orquestrar de forma limpa e isolada os diferentes subsistemas
 * da aplicação após o carregamento completo do DOM.
 */

import { ScrollVideoController } from './scroll-video.js';
import { UIEffectsController } from './ui-effects.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializa o motor de vídeo Scroll-driven cinemático com LERP de 0.07 para suavidade perfeita
  const videoController = new ScrollVideoController(
    '#scroll-canvas', 
    '#scroll-track', 
    0.07
  );

  // 2. Inicializa o gerenciador de efeitos visuais, navbar, menu mobile e revelação suave de elementos
  const uiController = new UIEffectsController(
    '#scroll-track', 
    '.scroll-reveal'
  );

  // Armazena as instâncias globalmente para depuração opcional, mantendo o escopo encapsulado
  window.__AppInstance = {
    videoController,
    uiController
  };

  console.log("☕ Serra & Grão - Landing Page inicializada com sucesso!");
});
