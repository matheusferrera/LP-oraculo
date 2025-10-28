document.addEventListener("DOMContentLoaded", () => {
  // Header Navigation
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".header__nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const header = document.querySelector(".header");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
  }

  if (navLinks && nav) {
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (nav.classList.contains("active")) {
          nav.classList.remove("active");
          navToggle.classList.remove("active");
        }
      });
    });
  }

  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Rotação da roda do oráculo - lenta contínua + aceleração no scroll
  (function () {
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const rotator = document.querySelector(".logo-rotate");
    if (!rotator) return;

    let ticking = false;
    let startTime = Date.now();
    const scrollFactor = 0.3; // graus por pixel de scroll
    const baseSpeed = 0.012; // graus por millisegundo (rotação lenta base)

    function updateRotation() {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      // Rotação base lenta (contínua)
      const baseAngle = (elapsed * baseSpeed) % 360;

      // Rotação adicional baseada no scroll
      const scrollAngle = window.scrollY * scrollFactor;

      // Combina ambas as rotações
      const totalAngle = baseAngle + scrollAngle;

      rotator.style.transform = `rotate(${totalAngle}deg)`;
      rotator.style.animation = "none"; // Remove a animação CSS para usar JS

      ticking = false;
    }

    // Atualização contínua para manter a rotação base
    function animate() {
      updateRotation();
      requestAnimationFrame(animate);
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateRotation);
        }
      },
      { passive: true }
    );

    // Inicia a animação contínua
    animate();
  })();

  // ========== Carousel de Serviços ==========
  (function initServicesCarousel() {
    const carousel = document.getElementById("servicesCarousel");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const indicatorsContainer = document.getElementById("carouselIndicators");

    if (!carousel || !prevBtn || !nextBtn || !indicatorsContainer) return;

    const cards = carousel.querySelectorAll(".feature__card");
    const totalCards = cards.length;

    let currentIndex = 0;
    let cardsPerView = 3; // Default para desktop
    let maxIndex = Math.max(0, totalCards - cardsPerView);

    // Função para calcular quantos cards mostrar baseado na largura da tela
    function updateCardsPerView() {
      const width = window.innerWidth;
      if (width <= 900) {
        cardsPerView = 1; // Mobile: 1 card
      } else if (width <= 1200) {
        cardsPerView = 2; // Tablet: 2 cards
      } else {
        cardsPerView = 3; // Desktop: 3 cards
      }
      maxIndex = Math.max(0, totalCards - cardsPerView);

      // Ajustar currentIndex se necessário
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }

      // Calcular e definir flex-basis dinamicamente para cada card
      const gapValue = parseFloat(getComputedStyle(carousel).gap) || 24; // fallback para 24px
      const containerWidth = carousel.offsetWidth;
      const cardWidth = (containerWidth - (cardsPerView - 1) * gapValue) / cardsPerView;
      cards.forEach((card) => {
        card.style.flexBasis = cardWidth + "px";
      });
    }

    // Função para criar indicadores
    function createIndicators() {
      indicatorsContainer.innerHTML = "";
      const totalSlides = maxIndex + 1;

      for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement("button");
        indicator.className = "carousel-indicator";
        indicator.setAttribute("aria-label", `Ir para slide ${i + 1}`);
        indicator.addEventListener("click", () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
      }
    }

    // Função para atualizar a posição do carousel
    function updateCarousel() {
      const gapValue = parseFloat(getComputedStyle(carousel).gap) || 24;
      const containerWidth = carousel.offsetWidth;
      const cardWidth = (containerWidth - (cardsPerView - 1) * gapValue) / cardsPerView;
      const translateX = -(currentIndex * (cardWidth + gapValue));

      carousel.style.transform = `translateX(${translateX}px)`;

      // Atualizar indicadores
      const indicators = indicatorsContainer.querySelectorAll(".carousel-indicator");
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentIndex);
      });

      // Atualizar estado dos botões
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === maxIndex;
    }

    // Função para ir para um slide específico
    function goToSlide(index) {
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      updateCarousel();
    }

    // Função para ir para o próximo slide
    function nextSlide() {
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    }

    // Função para ir para o slide anterior
    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    }

    // Event listeners
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    // Suporte a teclado
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSlide();
      }
    });

    // Suporte a touch/swipe (básico)
    let startX = 0;
    let isDragging = false;

    carousel.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;
        e.preventDefault();
      },
      { passive: false }
    );

    carousel.addEventListener(
      "touchend",
      (e) => {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        const threshold = 50; // Mínimo de pixels para considerar um swipe

        if (Math.abs(diff) > threshold) {
          if (diff > 0) {
            nextSlide(); // Swipe left = próximo
          } else {
            prevSlide(); // Swipe right = anterior
          }
        }
      },
      { passive: true }
    );

    // Redimensionamento da janela
    function handleResize() {
      updateCardsPerView();
      createIndicators();
      updateCarousel();
    }

    window.addEventListener("resize", handleResize);

    // Auto-play opcional (comentado por padrão)
    /*
    let autoplayInterval;
    function startAutoplay() {
      autoplayInterval = setInterval(() => {
        if (currentIndex === maxIndex) {
          goToSlide(0); // Volta para o início
        } else {
          nextSlide();
        }
      }, 5000); // 5 segundos
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    // Pausar autoplay ao interagir
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    // Iniciar autoplay
    startAutoplay();
    */

    // Inicialização
    updateCardsPerView();
    createIndicators();
    updateCarousel();

    // Tornar o carousel focável para navegação por teclado
    carousel.setAttribute("tabindex", "0");
  })();

  // ========== Efeito de Magnetismo para Botões ==========
  (function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll(".hero__cta, .conversion-cta-button");

    magneticButtons.forEach((button) => {
      let isHovering = false;

      button.addEventListener("mouseenter", () => {
        isHovering = true;
      });

      button.addEventListener("mouseleave", () => {
        isHovering = false;
        // Resetar posição quando sair do hover
        button.style.transform = "";
      });

      button.addEventListener("mousemove", (e) => {
        if (!isHovering) return;

        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calcular distância do centro
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;

        // Reduzir o efeito para ser mais sutil
        const moveX = deltaX * 0.15;
        const moveY = deltaY * 0.15;

        // Aplicar transformação magnética
        button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
      });
    });
  })();

  // ========== Efeito de Partículas no Botão Hero ==========
  (function initHeroParticles() {
    const heroButton = document.querySelector(".hero__cta");
    if (!heroButton) return;

    // Verificar se motion reduzida está habilitada
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let isHovering = false;

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

      // Adicionar keyframes se não existir
      if (!document.querySelector("#float-keyframes")) {
        const style = document.createElement("style");
        style.id = "float-keyframes";
        style.textContent = `
          @keyframes floatUp {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0.7;
            }
            100% {
              transform: translateY(-60px) scale(0);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }

      heroButton.style.position = "relative";
      heroButton.appendChild(dot);

      // Remover após animação
      setTimeout(() => {
        if (dot.parentNode) {
          dot.parentNode.removeChild(dot);
        }
      }, 2000);
    }

    heroButton.addEventListener("mouseenter", () => {
      isHovering = true;
      // Criar partículas em intervalos
      const particleInterval = setInterval(() => {
        if (!isHovering) {
          clearInterval(particleInterval);
          return;
        }
        createFloatingDot();
      }, 200);
    });

    heroButton.addEventListener("mouseleave", () => {
      isHovering = false;
    });
  })();

  // ========== Botão de Conversão ==========
  (function initConversionButton() {
    const conversionBtn = document.getElementById("conversionBtn");

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

      // Adicionar keyframes para a animação do ripple se não existir
      if (!document.querySelector("#ripple-keyframes")) {
        const style = document.createElement("style");
        style.id = "ripple-keyframes";
        style.textContent = `
          @keyframes ripple-animation {
            to {
              transform: scale(2);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }

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

      // Simular ação de conversão (aqui você pode adicionar sua lógica)
      console.log("Botão de conversão clicado!");

      // Exemplo de ação: scroll suave para o topo ou abrir modal
      // Você pode substituir por sua lógica específica
      setTimeout(() => {
        // Exemplo: mostrar alerta de sucesso
        showConversionSuccess();
      }, 300);
    });

    // Função para mostrar feedback de sucesso
    function showConversionSuccess() {
      // Criar elemento de feedback temporário
      const feedback = document.createElement("div");
      feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
        z-index: 10000;
        font-weight: 600;
        font-size: 0.9rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
      `;
      feedback.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>✓</span>
          <span>Solicitação enviada! Entraremos em contato em breve.</span>
        </div>
      `;

      document.body.appendChild(feedback);

      // Animar entrada
      setTimeout(() => {
        feedback.style.transform = "translateX(0)";
      }, 100);

      // Remover após 4 segundos
      setTimeout(() => {
        feedback.style.transform = "translateX(100%)";
        setTimeout(() => {
          if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
          }
        }, 300);
      }, 4000);
    }

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
    const fecharNegocioBtn = document.getElementById("fecharNegocioBtn");

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

      // Simular ação de conversão
      console.log("Botão de fechar negócio clicado!");

      // Feedback de sucesso
      setTimeout(() => {
        showFecharNegocioSuccess();
      }, 400);
    });

    // Função para mostrar feedback de sucesso
    function showFecharNegocioSuccess() {
      const feedback = document.createElement("div");
      feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
        z-index: 10000;
        font-weight: 600;
        font-size: 0.9rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
      `;
      feedback.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>🔥</span>
          <span>Excelente! Sua jornada para o sucesso começa agora!</span>
        </div>
      `;

      document.body.appendChild(feedback);

      // Animar entrada
      setTimeout(() => {
        feedback.style.transform = "translateX(0)";
      }, 100);

      // Remover após 5 segundos
      setTimeout(() => {
        feedback.style.transform = "translateX(100%)";
        setTimeout(() => {
          if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
          }
        }, 300);
      }, 5000);
    }

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
    const whatsappBtn = document.getElementById("whatsappCta");

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

      // Simular ação de conversão do WhatsApp
      console.log("Botão do WhatsApp clicado!");

      // Feedback de sucesso específico do WhatsApp
      setTimeout(() => {
        showWhatsAppSuccess();
      }, 300);
    });

    // Função para mostrar feedback de sucesso do WhatsApp
    function showWhatsAppSuccess() {
      const feedback = document.createElement("div");
      feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #25d366, #128c7e);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(37, 211, 102, 0.3);
        z-index: 10000;
        font-weight: 600;
        font-size: 0.9rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
      `;
      feedback.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>💬</span>
          <span>Redirecionando para o WhatsApp...</span>
        </div>
      `;

      document.body.appendChild(feedback);

      // Animar entrada
      setTimeout(() => {
        feedback.style.transform = "translateX(0)";
      }, 100);

      // Simular redirecionamento para WhatsApp
      setTimeout(() => {
        // Aqui você pode adicionar o link real do WhatsApp
        // window.open('https://wa.me/5511999999999?text=Olá! Gostaria de agendar uma consultoria gratuita.', '_blank');

        // Remover feedback
        feedback.style.transform = "translateX(100%)";
        setTimeout(() => {
          if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
          }
        }, 300);
      }, 2000);
    }

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

  // ========== Acelerar Marquee dos Oráculos no Scroll ==========
  (function initScrollAcceleratedMarquee() {
    const marqueeTrack = document.querySelector(".oraculos__track");
    if (!marqueeTrack) return;

    // Verificar se motion reduzida está habilitada
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let currentPosition = 0;
    let lastTime = Date.now();

    // Configurações
    const baseSpeed = 30; // pixels por segundo (velocidade base)
    const scrollMultiplier = 3; // multiplicador para scroll
    const maxScrollEffect = 100; // máximo efeito do scroll

    // Desabilitar animação CSS original
    marqueeTrack.style.animation = "none";

    function animate() {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 1000; // converter para segundos
      lastTime = now;

      // Calcular velocidade atual (base + efeito do scroll)
      const scrollEffect = Math.min(scrollVelocity * scrollMultiplier, maxScrollEffect);
      const currentSpeed = baseSpeed + scrollEffect;

      // Mover marquee
      currentPosition -= currentSpeed * deltaTime;

      // Reset para loop infinito - usar largura fixa aproximada
      if (currentPosition <= -4000) {
        // valor aproximado para resetar
        currentPosition = 0;
      }

      // Aplicar transformação
      marqueeTrack.style.transform = `translateX(${currentPosition}px)`;

      // Diminuir velocidade do scroll gradualmente
      scrollVelocity *= 0.95;
      if (scrollVelocity < 0.1) scrollVelocity = 0;

      requestAnimationFrame(animate);
    }

    function onScroll() {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);

      // Acumular velocidade do scroll
      scrollVelocity = Math.min(scrollVelocity + scrollDelta, maxScrollEffect);

      lastScrollY = currentScrollY;
    }

    // Event listener para scroll
    window.addEventListener("scroll", onScroll, { passive: true });

    // Iniciar animação
    animate();
  })();

  // ========== Animação dos Balões de WhatsApp ao Entrar na Viewport ==========
  (function initWhatsAppMessagesAnimation() {
    const messages = document.querySelectorAll(".message-container");
    if (!messages.length) return;

    // Verificar se motion reduzida está habilitada
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // Se motion reduzida está habilitada, mostrar todas as mensagens imediatamente
      messages.forEach((message) => {
        message.style.opacity = "1";
        message.style.transform = "translateY(0)";
      });
      return;
    }

    // Configurar Intersection Observer
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.7, // Ativar quando 70% do elemento estiver visível
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Adicionar classe para ativar a animação
          entry.target.classList.add("animate-in");
          // Parar de observar após a animação ser ativada
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observar cada mensagem
    messages.forEach((message) => {
      observer.observe(message);
    });
  })();
});
