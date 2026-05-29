class n extends HTMLElement{connectedCallback(){this.render(),this.setActiveLink(),this.bindEvents()}render(){this.innerHTML=`
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
    `}setActiveLink(){const a=window.location.pathname;this.querySelectorAll(".nav-link").forEach(e=>{e.classList.remove("active");const t=e.getAttribute("data-path");(a===t||a.endsWith("/")&&t==="/"||a.includes(t)&&t!=="/")&&e.classList.add("active")})}bindEvents(){const a=this.querySelector("#nav-toggle"),s=this.querySelector("#nav-menu");a&&s&&a.addEventListener("click",()=>{s.classList.toggle("active")})}}customElements.define("global-navbar",n);
