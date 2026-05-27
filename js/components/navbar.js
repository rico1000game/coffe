class GlobalNavbar extends HTMLElement {

  connectedCallback() {
    this.render();
    this.setActiveLink();
    this.bindEvents();
  }

  render() {
    this.innerHTML = `
      <header class="navbar" id="navbar">
        <a href="/" class="logo">
          <i class="fa-solid fa-mug-hot"></i>
          <span>Serra & Grão</span>
        </a>
        
        <nav class="nav-menu" id="nav-menu">
          <a class="nav-link" href="/" data-path="/">Início</a>
          <a class="nav-link" href="/menu/menu.html" data-path="/menu/menu.html">Cardápio</a>
          <a class="nav-link" href="/sobre/sobre.html" data-path="/sobre/sobre.html">Sobre Nós</a>
          <a class="nav-link" href="/galeria/galeria.html" data-path="/galeria/galeria.html">Galeria</a>
          <a class="nav-link" href="/contato/contato.html" data-path="/contato/contato.html">Contato</a>
        </nav>
        
        <div class="nav-toggle" id="nav-toggle" aria-label="Abrir menu">
          <i class="fa-solid fa-bars"></i>
        </div>
      </header>
    `;
  }

  setActiveLink() {
    const currentPath = window.location.pathname;
    const links = this.querySelectorAll('.nav-link');
    
    links.forEach(link => {

      link.classList.remove('active');
      
      const path = link.getAttribute('data-path');
      
      if (currentPath === path || (currentPath.endsWith('/') && path === '/')) {
        link.classList.add('active');

      } else if (currentPath.includes(path) && path !== '/') {
        link.classList.add('active');
      }

    });
  }

  bindEvents() {
    const navToggle = this.querySelector('#nav-toggle');
    const navMenu = this.querySelector('#nav-menu');

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
      });
    }
  }
}

customElements.define('global-navbar', GlobalNavbar);