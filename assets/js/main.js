/**
 * Main JavaScript File
 * Gerencia funcionalidades gerais do portfólio
 */

class Portfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMobileMenu();
        this.setupScrollEffects();
        this.setupActiveNavigation();
        this.setupScrollIndicator(); // Adicionar esta linha
        this.setupPageTransitions();
        this.setupPerformanceOptimizations();
        this.handleInitialLoad();
    }

    /**
     * Configurar event listeners principais
     */
    setupEventListeners() {
        // Page load
        window.addEventListener('load', () => {
            this.handlePageLoad();
        });

        // Resize
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));

        // Scroll
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
        }, 16));

        // Visibility change (para pausar animações quando a aba não está ativa)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    /**
     * Configurar menu mobile
     */
    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('.nav');
        
        if (mobileMenuBtn && nav) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Fechar menu ao clicar em um link
            const navLinks = nav.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });

            // Fechar menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.header')) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    /**
     * Toggle do menu mobile
     */
    toggleMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('.nav');
        
        if (mobileMenuBtn && nav) {
            mobileMenuBtn.classList.toggle('active');
            nav.classList.toggle('active');
            
            // Prevenir scroll do body quando menu está aberto
            if (nav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }

    /**
     * Fechar menu mobile
     */
    closeMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('.nav');
        
        if (mobileMenuBtn && nav) {
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Configurar efeitos de scroll
     */
    setupScrollEffects() {
        // Scroll reveal elements
        this.observeScrollElements();
        
        // Parallax effect for profile image
        this.setupParallax();
    }

    /**
     * Observer para elementos que aparecem no scroll
     */
    observeScrollElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        // Observar elementos com classe scroll-reveal
        const scrollElements = document.querySelectorAll('.scroll-reveal');
        scrollElements.forEach(el => observer.observe(el));
    }

    /**
     * Efeito parallax sutil na imagem de perfil
     */
    setupParallax() {
        const profileImage = document.querySelector('.profile-image');
        
        if (profileImage) {
            window.addEventListener('scroll', Utils.throttle(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                profileImage.style.transform = `translateY(${rate}px)`;
            }, 16));
        }
    }

    /**
     * Configurar transições de página
     */
    setupPageTransitions() {
        // Fade in inicial
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        // Links internos com transição suave
        this.setupSmoothTransitions();
    }

    /**
     * Transições suaves para links internos
     */
    setupSmoothTransitions() {
        const internalLinks = document.querySelectorAll('a[href^="./"], a[href^="/"]');
        
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                // Fade out
                document.body.style.opacity = '0';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        });
    }

    /**
     * Otimizações de performance
     */
    setupPerformanceOptimizations() {
        // Lazy loading para imagens
        this.setupLazyLoading();
        
        // Preload de recursos importantes
        this.preloadResources();
    }

    /**
     * Lazy loading para imagens
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.setAttribute('src', src);
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    /**
     * Preload de recursos importantes
     */
    preloadResources() {
        // Preload de imagens críticas
        const criticalImages = [
            './assets/images/profile.jpg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    /**
     * Manipular carregamento inicial da página
     */
    handleInitialLoad() {
        // Detectar se é primeira visita
        const isFirstVisit = !sessionStorage.getItem('visited');
        
        if (isFirstVisit) {
            sessionStorage.setItem('visited', 'true');
            // Animações especiais para primeira visita
            document.body.classList.add('first-visit');
        }
    }

    /**
     * Manipular carregamento completo da página
     */
    handlePageLoad() {
        // Fade in da página
        document.body.style.opacity = '1';
        
        // Remover loading state se existir
        document.body.classList.remove('loading');
        
        // Trigger de eventos customizados
        this.dispatchCustomEvent('portfolioLoaded');
    }

    /**
     * Manipular redimensionamento da janela
     */
    handleResize() {
        // Atualizar variáveis CSS se necessário
        this.updateCSSVariables();
        
        // Fechar menu mobile se estiver aberto
        if (window.innerWidth > 767) {
            this.closeMobileMenu();
        }
    }

    /**
     * Manipular scroll da página
     */
    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        // Adicionar classe ao header baseado no scroll
        const header = document.querySelector('.header');
        if (header) {
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    /**
     * Manipular mudança de visibilidade da aba
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Pausar animações quando a aba não está ativa
            if (window.constellation) {
                window.constellation.pause();
            }
        } else {
            // Retomar animações
            if (window.constellation) {
                window.constellation.resume();
            }
        }
    }

    /**
     * Atualizar variáveis CSS dinamicamente
     */
    updateCSSVariables() {
        const root = document.documentElement;
        const vh = window.innerHeight * 0.01;
        root.style.setProperty('--vh', `${vh}px`);
    }

    /**
     * Disparar evento customizado
     */
    dispatchCustomEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    /**
     * Método para adicionar partículas decorativas
     */
    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        document.body.appendChild(particle);
        
        // Remover após animação
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 3000);
    }
    /**
     * Configurar navegação ativa baseada no scroll
     */
    setupActiveNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id], main[id]');
        
        // Adicionar ID ao main se não existir
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'home';
        }
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-20% 0px -70% 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    
                    // Remover classe active de todos os links
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Adicionar classe active ao link correspondente
                    const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);
        
        // Observar todas as seções
        sections.forEach(section => {
            observer.observe(section);
        });
        
        // Observar o main também se tiver ID
        if (main && main.id) {
            observer.observe(main);
        }
    }
    /**
     * Configurar indicador de scroll
     */
    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        const aboutSection = document.querySelector('#about');
        
        if (scrollIndicator && aboutSection) {
            // Clique na seta para rolar para a seção sobre
            scrollIndicator.addEventListener('click', () => {
                aboutSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
            
            // Esconder a seta quando não estiver na seção home
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.target.id === 'home') {
                        if (entry.isIntersecting) {
                            scrollIndicator.classList.remove('hidden');
                        } else {
                            scrollIndicator.classList.add('hidden');
                        }
                    }
                });
            }, {
                threshold: 0.5
            });
            
            const homeSection = document.querySelector('#home');
            if (homeSection) {
                observer.observe(homeSection);
            }
        }
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new Portfolio();
});

// Manipular erros globais
window.addEventListener('error', (e) => {
    console.error('Erro capturado:', e.error);
    // Aqui você pode adicionar tracking de erros se necessário
});

// Service Worker registration (opcional, para PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('SW registrado com sucesso:', registration);
            })
            .catch(error => {
                console.log('Falha ao registrar SW:', error);
            });
    });
    // Desabilita botão direito
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Desabilita teclas de desenvolvedor
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.shiftKey && e.key === 'J') || 
        (e.ctrlKey && e.key === 'U')) { 
        e.preventDefault(); 
    } 
});
    
}



