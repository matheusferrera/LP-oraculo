document.addEventListener("DOMContentLoaded", () => {
  // ========== Configuração do WhatsApp ==========
  const WHATSAPP_NUMBER = "5561991214065";
  const WHATSAPP_MESSAGE = "Olá! Gostaria de agendar minha consultoria gratuita.";

  // Função centralizada para abrir WhatsApp
  function openWhatsApp() {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, "_blank");
  }

  // Cache de elementos do DOM
  const elements = {
    header: document.querySelector(".header"),
    rotator: document.querySelector(".logo-rotate"),
    heroBtn: document.querySelector(".hero__cta"),
    conversionBtn: document.getElementById("conversionBtn"),
    fecharNegocioBtn: document.getElementById("fecharNegocioBtn"),
    whatsappBtn: document.getElementById("whatsappCta"),
    messages: document.querySelectorAll(".message-container"),
  };

  // ========== Header Scroll Effect ==========
  (function initHeaderScroll() {
    const { header } = elements;
    if (!header) return;

    let ticking = false;

    function updateHeader() {
      const scrollY = window.scrollY;

      // Mostrar header quando rolar mais de 100px
      if (scrollY > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }

    // Event listener para scroll
    window.addEventListener("scroll", onScroll, { passive: true });

    // Verificar posição inicial
    updateHeader();
  })();

  // ========== Mobile Menu Toggle ==========
  (function initMobileMenu() {
    const navToggle = document.querySelector(".nav-toggle");
    const headerNav = document.querySelector(".header__nav");

    if (!navToggle || !headerNav) return;

    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      headerNav.classList.toggle("active");
    });

    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("active");
        headerNav.classList.remove("active");
      });
    });

    // Fechar menu ao clicar fora
    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !headerNav.contains(e.target)) {
        navToggle.classList.remove("active");
        headerNav.classList.remove("active");
      }
    });
  })();

  // ========== Swiper Carousel de Serviços ==========
  (function initServicesSwiper() {
    // Verificar se o Swiper está disponível
    if (typeof Swiper === "undefined") {
      console.error("Swiper não está carregado");
      return;
    }

    const servicesSwiper = new Swiper(".servicesSwiper", {
      // Configurações básicas
      slidesPerView: 1,
      spaceBetween: 24,
      centeredSlides: false,
      grabCursor: true,

      // Breakpoints responsivos
      breakpoints: {
        // Mobile pequeno
        480: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        // Mobile grande / Tablet pequeno
        640: {
          slidesPerView: 1,
          spaceBetween: 24,
        },
        // Tablet
        900: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        // Desktop
        1200: {
          slidesPerView: 3,
          spaceBetween: 32,
        },
      },

      // Paginação
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: false,
        renderBullet: function (index, className) {
          return '<span class="' + className + '"></span>';
        },
      },

      // Navegação
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },

      // Suporte a teclado
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },

      // Suporte a mousewheel (opcional)
      mousewheel: {
        forceToAxis: true,
        sensitivity: 0.5,
      },

      // Efeitos e transições suaves
      speed: 600,
      effect: "slide",

      // Otimizações para performance
      watchSlidesProgress: true,
      watchSlidesVisibility: true,

      // Lazy loading (se necessário)
      preloadImages: false,
      lazy: {
        loadPrevNext: true,
      },

      // Resistência ao deslizar além dos limites
      resistance: true,
      resistanceRatio: 0.85,

      // Loop desabilitado para melhor controle
      loop: false,

      // Acessibilidade
      a11y: {
        prevSlideMessage: "Slide anterior",
        nextSlideMessage: "Próximo slide",
        firstSlideMessage: "Este é o primeiro slide",
        lastSlideMessage: "Este é o último slide",
      },

      // Callback quando o swiper é inicializado
      on: {
        init: function () {
          console.log("Swiper inicializado com sucesso!");
        },
        slideChange: function () {
          // Adicionar animação suave aos cards ao mudar
          const activeSlide = this.slides[this.activeIndex];
          if (activeSlide) {
            activeSlide.classList.add("swiper-slide-active-custom");
          }
        },
      },
    });

    // Adicionar suporte a gestos de toque melhorados para mobile
    if ("ontouchstart" in window) {
      const swiperEl = document.querySelector(".servicesSwiper");
      if (swiperEl) {
        // Prevenir scroll vertical enquanto desliza horizontalmente
        let touchStartY = 0;
        let touchStartX = 0;

        swiperEl.addEventListener(
          "touchstart",
          (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
          },
          { passive: true }
        );

        swiperEl.addEventListener(
          "touchmove",
          (e) => {
            const touchMoveY = e.touches[0].clientY;
            const touchMoveX = e.touches[0].clientX;
            const diffY = Math.abs(touchMoveY - touchStartY);
            const diffX = Math.abs(touchMoveX - touchStartX);

            // Se o movimento horizontal é maior que o vertical, prevenir scroll
            if (diffX > diffY) {
              e.stopPropagation();
            }
          },
          { passive: false }
        );
      }
    }
  })();

  // ========== Efeito de Magnetismo para Botões ==========
  (function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll(".hero__cta, .conversion-cta-button");

    magneticButtons.forEach((button) => {
      let isHovering = false;
      let rafId;

      button.addEventListener("mouseenter", () => {
        isHovering = true;
      });

      button.addEventListener("mouseleave", () => {
        isHovering = false;
        if (rafId) cancelAnimationFrame(rafId);
        button.style.transform = "";
      });

      button.addEventListener("mousemove", (e) => {
        if (!isHovering) return;

        if (rafId) cancelAnimationFrame(rafId);

        rafId = requestAnimationFrame(() => {
          const rect = button.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = e.clientX - centerX;
          const deltaY = e.clientY - centerY;
          const moveX = deltaX * 0.15;
          const moveY = deltaY * 0.15;

          button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
        });
      });
    });
  })();

  // ========== Botão Hero CTA - Abrir WhatsApp ==========
  (function initHeroCTA() {
    const { heroBtn } = elements;
    if (!heroBtn) return;

    heroBtn.addEventListener("click", function (event) {
      event.preventDefault();
      openWhatsApp();
    });

    heroBtn.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.click();
      }
    });

    heroBtn.setAttribute("role", "button");
    heroBtn.setAttribute("aria-label", "Agendar consultoria gratuita via WhatsApp");
  })();

  // ========== Efeito de Partículas no Botão Hero ==========
  (function initHeroParticles() {
    const { heroBtn: heroButton } = elements;
    if (!heroButton) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let isHovering = false;
    let particleInterval;

    function createFloatingDot() {
      if (!isHovering) return;

      const dot = document.createElement("div");
      dot.style.cssText = `
        position: absolute;
        width: 3px;
        height: 3px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        pointer-events: none;
        left: ${Math.random() * 100}%;
        bottom: 0;
        animation: floatUp 2s linear forwards;
        z-index: -1;
      `;

      heroButton.style.position = "relative";
      heroButton.appendChild(dot);

      setTimeout(() => {
        if (dot.parentNode) {
          dot.parentNode.removeChild(dot);
        }
      }, 2000);
    }

    heroButton.addEventListener("mouseenter", () => {
      isHovering = true;
      particleInterval = setInterval(createFloatingDot, 200);
    });

    heroButton.addEventListener("mouseleave", () => {
      isHovering = false;
      if (particleInterval) clearInterval(particleInterval);
    });
  })();

  // ========== Botão de Conversão ==========
  (function initConversionButton() {
    const { conversionBtn } = elements;
    if (!conversionBtn) return;

    // Adicionar efeito de ripple ao clicar
    function createRipple(event) {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
        z-index: 0;
      `;

      button.appendChild(ripple);

      // Remover o ripple após a animação
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    }

    // Event listener para o clique
    conversionBtn.addEventListener("click", function (event) {
      event.preventDefault();

      // Criar efeito ripple
      createRipple(event);

      // Abrir WhatsApp após o efeito
      setTimeout(() => {
        openWhatsApp();
      }, 300);
    });

    // Adicionar efeito de hover melhorado
    conversionBtn.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px) scale(1.02)";
    });

    conversionBtn.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });

    // Suporte para navegação por teclado
    conversionBtn.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.click();
      }
    });

    // Adicionar atributos de acessibilidade
    conversionBtn.setAttribute("role", "button");
    conversionBtn.setAttribute("aria-label", "Solicitar consultoria gratuita");
  })();

  // ========== Botão de Fechar Negócio ==========
  (function initFecharNegocioButton() {
    const { fecharNegocioBtn } = elements;
    if (!fecharNegocioBtn) return;

    // Adicionar efeito de ripple ao clicar
    function createRipple(event) {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.8s ease-out;
        pointer-events: none;
        z-index: 0;
      `;

      button.appendChild(ripple);

      // Remover o ripple após a animação
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 800);
    }

    // Event listener para o clique
    fecharNegocioBtn.addEventListener("click", function (event) {
      event.preventDefault();

      // Criar efeito ripple
      createRipple(event);

      // Abrir WhatsApp após o efeito
      setTimeout(() => {
        openWhatsApp();
      }, 400);
    });

    // Adicionar efeito de hover simples
    fecharNegocioBtn.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px) scale(1.01)";
    });

    fecharNegocioBtn.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });

    // Suporte para navegação por teclado
    fecharNegocioBtn.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.click();
      }
    });

    // Adicionar atributos de acessibilidade
    fecharNegocioBtn.setAttribute("role", "button");
    fecharNegocioBtn.setAttribute("aria-label", "Agendar consultoria gratuita para fechar mais negócios");
  })();

  // ========== Botão do WhatsApp ==========
  (function initWhatsAppButton() {
    const { whatsappBtn } = elements;
    if (!whatsappBtn) return;

    // Adicionar efeito de ripple ao clicar
    function createRipple(event) {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
        z-index: 0;
      `;

      button.appendChild(ripple);

      // Remover o ripple após a animação
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    }

    // Event listener para o clique
    whatsappBtn.addEventListener("click", function (event) {
      event.preventDefault();

      // Criar efeito ripple
      createRipple(event);

      // Abrir WhatsApp após o efeito
      setTimeout(() => {
        openWhatsApp();
      }, 300);
    });

    // Suporte para navegação por teclado
    whatsappBtn.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.click();
      }
    });

    // Adicionar atributos de acessibilidade
    whatsappBtn.setAttribute("role", "button");
    whatsappBtn.setAttribute("aria-label", "Iniciar conversa no WhatsApp para consultoria gratuita");
  })();

  // ========== Animação dos Balões de WhatsApp ao Entrar na Viewport ==========
  (function initWhatsAppMessagesAnimation() {
    const { messages } = elements;
    if (!messages.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      messages.forEach((message) => {
        message.style.opacity = "1";
        message.style.transform = "translateY(0)";
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.9,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    messages.forEach((message) => {
      observer.observe(message);
    });
  })();

  // ========== Marquee de Oráculos - Loop Infinito ==========
  (function initOraculosMarquee() {
    const track = document.getElementById("oraculosTrack");
    if (!track) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Pegar todos os itens originais
    const items = Array.from(track.querySelectorAll(".oraculo__item"));

    // Duplicar os itens 3 vezes para garantir um loop suave
    for (let i = 0; i < 3; i++) {
      items.forEach((item) => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
      });
    }

    // Calcular a largura total do conteúdo original
    let totalWidth = 0;
    items.forEach((item) => {
      totalWidth += item.offsetWidth;
    });

    // Adicionar o gap entre os itens
    const gap = parseFloat(getComputedStyle(track).gap) || 80;
    totalWidth += gap * (items.length - 1);

    // Calcular a duração da animação baseada na largura
    // Quanto maior o conteúdo, mais tempo para manter a velocidade consistente
    const duration = Math.max(30, totalWidth / 50); // pixels por segundo ajustável

    // Aplicar a animação CSS personalizada
    track.style.animation = `marqueeScroll ${duration}s linear infinite`;

    // Criar a keyframe dinamicamente
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes marqueeScroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-${totalWidth + gap}px);
        }
      }
    `;
    document.head.appendChild(styleSheet);

    // Pausar animação ao passar o mouse (opcional)
    track.addEventListener("mouseenter", () => {
      track.style.animationPlayState = "paused";
    });

    track.addEventListener("mouseleave", () => {
      track.style.animationPlayState = "running";
    });
  })();

  // ========== Função para Fazer a Roda Girar Continuamente ==========
  (function initWheelSpin() {
    const rotator = elements.rotator;
    if (!rotator) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let rotation = 0;
    let rotationSpeed = 0.5; // Velocidade base de rotação
    const baseSpeed = 0.5;
    const maxSpeed = 8; // Velocidade máxima
    const speedDecay = 0.98; // Taxa de desaceleração (volta ao normal)

    // Função para girar a roda continuamente
    function spinWheel() {
      rotation += rotationSpeed;
      rotator.style.transform = `rotate(${rotation}deg)`;

      // Desacelerar gradualmente de volta à velocidade base
      if (rotationSpeed > baseSpeed) {
        rotationSpeed *= speedDecay;
        if (rotationSpeed < baseSpeed) {
          rotationSpeed = baseSpeed;
        }
      }

      requestAnimationFrame(spinWheel);
    }

    // Event listener para scroll do mouse
    let scrollTimeout;
    window.addEventListener(
      "wheel",
      (e) => {
        // Aumentar a velocidade baseado na intensidade do scroll
        const scrollIntensity = Math.abs(e.deltaY) / 100;
        rotationSpeed = Math.min(rotationSpeed + scrollIntensity * 2, maxSpeed);

        // Limpar timeout anterior
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        // Resetar para velocidade base após 2 segundos sem scroll
        scrollTimeout = setTimeout(() => {
          rotationSpeed = baseSpeed;
        }, 2000);
      },
      { passive: true }
    );

    // Iniciar a rotação automaticamente
    spinWheel();
  })();
});
