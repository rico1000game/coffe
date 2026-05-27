/**
 * MOTOR DE SCRUBBING DE VÍDEO BASEADO EM ROLAGEM (CANVAS IMAGE SEQUENCE ENGINE)
 * 
 * Responsabilidade Única (SRP): 
 * Mapear e sincronizar a porcentagem de rolagem de uma seção trilho (scroll track)
 * para uma sequência de imagens renderizadas em um <canvas>, utilizando interpolação 
 * linear (LERP) para garantir uma transição de frames 100% lisa, livre de lags de decodificador de vídeo.
 */

export class ScrollVideoController {
  /**
   * @param {string} canvasSelector Seletor para o elemento <canvas>.
   * @param {string} trackSelector Seletor para a seção de rolagem que serve de trilho.
   * @param {number} lerpFactor Fator de suavização (0.01 a 0.1). Menor = mais suave/lento.
   */
  constructor(canvasSelector, trackSelector, lerpFactor = 0.08) {
    this.canvas = document.querySelector(canvasSelector);
    this.track = document.querySelector(trackSelector);
    this.lerpFactor = lerpFactor;

    if (!this.canvas || !this.track) {
      console.warn("Elemento canvas ou trilho de scroll não encontrado.");
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    
    // Configurações da Sequência de Imagens
    this.frameCount = 192; // Total de frames extraídos
    this.images = [];
    this.imagesLoaded = 0;
    
    this.currentFrame = 1;
    this.targetFrame = 1;
    this.renderedFrame = 0; // Armazena o último frame desenhado para evitar redraws desnecessários

    this.animationFrameId = null;
    this.isInitialized = false;

    this.init();
  }

  init() {
    // Configura o tamanho inicial do canvas baseado na tela
    this.resizeCanvas();
    
    // Pré-carrega as imagens. A lógica principal começará assim que a primeira imagem estiver pronta.
    this.preloadImages();
  }

  resizeCanvas() {
    // Opcionalmente, podemos definir a resolução do canvas (ex: 1280x720) para manter a qualidade consistente
    // Aqui usaremos 1280x720 que foi a proporção da extração
    this.canvas.width = 1280;
    this.canvas.height = 720;
  }

  preloadImages() {
    for (let i = 1; i <= this.frameCount; i++) {
      const img = new Image();
      // O path segue o padrão gerado pelo script: public/frames/frame_0001.jpg
      const paddedIndex = i.toString().padStart(4, '0');
      img.src = `/frames/frame_${paddedIndex}.jpg`;
      
      this.images[i] = img;

      img.onload = () => {
        this.imagesLoaded++;
        
        // Se a primeira imagem carregar, desenhamos ela imediatamente e iniciamos o controlador
        if (i === 1) {
          this.drawFrame(1);
          this.setupController();
        }
      };
    }
  }

  setupController() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Sincroniza o valor inicial
    this.updateTargetFrame();
    this.currentFrame = this.targetFrame;
    this.drawFrame(Math.round(this.currentFrame));

    // Adiciona escuta de rolagem de forma otimizada
    window.addEventListener('scroll', () => this.updateTargetFrame(), { passive: true });
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.updateTargetFrame();
      this.drawFrame(Math.round(this.currentFrame)); // Redesenha em caso de resize
    }, { passive: true });

    // Inicia o loop de interpolação
    this.startInterpolationLoop();
  }

  /**
   * Calcula o progresso de rolagem e define qual o frame ideal (targetFrame)
   */
  updateTargetFrame() {
    const rect = this.track.getBoundingClientRect();
    const trackTop = rect.top + window.scrollY;
    const trackHeight = rect.height - window.innerHeight;

    if (trackHeight <= 0) return;

    // Calcula o quanto o usuário rolou dentro do trilho
    const relativeScroll = window.scrollY - trackTop;
    
    // Converte para fração de 0.0 a 1.0 (clamped)
    let scrollFraction = relativeScroll / trackHeight;
    scrollFraction = Math.max(0, Math.min(1, scrollFraction));

    // Define o frame alvo correspondente (entre 1 e frameCount)
    this.targetFrame = 1 + scrollFraction * (this.frameCount - 1);
  }

  /**
   * Desenha um frame específico no canvas
   * @param {number} frameIndex Índice do frame
   */
  drawFrame(frameIndex) {
    if (frameIndex < 1) frameIndex = 1;
    if (frameIndex > this.frameCount) frameIndex = this.frameCount;

    const img = this.images[frameIndex];
    // Desenha apenas se a imagem já foi carregada pelo navegador
    if (img && img.complete && img.naturalWidth !== 0) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Simula o object-fit: cover desenhando a imagem de forma a preencher o canvas
      const canvasRatio = this.canvas.width / this.canvas.height;
      const imgRatio = img.width / img.height;
      
      let renderWidth, renderHeight, xOffset, yOffset;

      if (canvasRatio > imgRatio) {
        renderWidth = this.canvas.width;
        renderHeight = this.canvas.width / imgRatio;
        xOffset = 0;
        yOffset = (this.canvas.height - renderHeight) / 2;
      } else {
        renderWidth = this.canvas.height * imgRatio;
        renderHeight = this.canvas.height;
        xOffset = (this.canvas.width - renderWidth) / 2;
        yOffset = 0;
      }

      this.ctx.drawImage(img, xOffset, yOffset, renderWidth, renderHeight);
      this.renderedFrame = frameIndex;
    }
  }

  /**
   * Loop de animação que roda a cada frame do navegador (requestAnimationFrame)
   * interpolando suavemente do frame atual para o frame alvo
   */
  startInterpolationLoop() {
    const loop = () => {
      const diff = this.targetFrame - this.currentFrame;

      // Se a diferença for significativa, atualiza o currentFrame usando LERP
      if (Math.abs(diff) > 0.01) {
        this.currentFrame += diff * this.lerpFactor;
        
        // Arredonda para encontrar o índice do frame da imagem
        const roundedFrame = Math.round(this.currentFrame);
        
        // Só chama a rotina de desenho se o frame realmente mudou
        if (roundedFrame !== this.renderedFrame) {
          this.drawFrame(roundedFrame);
        }
      }

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  /**
   * Método de limpeza para evitar vazamento de memória se o componente for destruído
   */
  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('scroll', () => this.updateTargetFrame());
    window.removeEventListener('resize', () => this.updateTargetFrame());
  }
}
