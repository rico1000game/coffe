/**
 * CONTROLADOR DE EFEITOS VISUAIS E INTERAÇÃO COM A UI (UI EFFECTS CONTROLLER)
 * 
 * Responsabilidade Única (SRP):
 * Gerenciar a interatividade visual da página inicial:
 * 1. Ativação gradual e desativação dos cartões glassmorphic narrativos baseados na porcentagem de scroll.
 * 2. Transições da barra de navegação (Navbar) com o scroll.
 */

export class UIEffectsController {
  /**
   * @param {string} trackSelector Seletor da seção trilho de scroll.
   * @param {string} revealSelector Seletor dos elementos de revelação no scroll.
   */
  constructor(trackSelector, revealSelector = '.scroll-reveal') {
    this.track = document.querySelector(trackSelector);
    this.revealElements = document.querySelectorAll(revealSelector);

    this.init();
  }

  init() {
    // 1. Monitoramento do Scroll para a Navbar
    this.handleScrollEffects();
    window.addEventListener('scroll', () => this.handleScrollEffects(), { passive: true });
    window.addEventListener('resize', () => this.handleScrollEffects(), { passive: true });

    // 2. Configura a revelação elegante de elementos na rolagem usando Intersection Observer
    this.setupScrollReveal();
  }

  handleScrollEffects() {
    if (!this.track) return;

    // Busca a navbar dinamicamente caso ela venha do Web Component
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Efeito da Navbar: Apenas aplica o fundo sólido (.scrolled) quando passar o final do trilho de animação.
    const rect = this.track.getBoundingClientRect();
    
    // Se o fundo da animação chegar próximo à altura da navbar (ex: 100px do topo)
    if (rect.bottom < 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /**
   * Configura o IntersectionObserver para revelar os elementos suavemente ao rolar a página
   */
  setupScrollReveal() {
    if (!this.revealElements.length) return;

    const observerOptions = {
      root: null, // viewport do navegador
      rootMargin: '0px',
      threshold: 0.15 // Revela quando 15% do elemento estiver visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Para de observar uma vez revelado
        }
      });
    }, observerOptions);

    this.revealElements.forEach(element => {
      observer.observe(element);
    });
  }
}
