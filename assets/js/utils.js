/**
 * Utilities
 * Funções utilitárias para o portfólio
 */

const Utils = {
    /**
     * Debounce function - limita a frequência de execução de uma função
     * @param {Function} func - Função a ser executada
     * @param {number} wait - Tempo de espera em ms
     * @param {boolean} immediate - Se deve executar imediatamente
     * @returns {Function}
     */
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    },

    /**
     * Throttle function - limita execuções a um intervalo específico
     * @param {Function} func - Função a ser executada
     * @param {number} limit - Limite de tempo em ms
     * @returns {Function}
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Detectar se é dispositivo móvel
     * @returns {boolean}
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Detectar se é dispositivo touch
     * @returns {boolean}
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * Obter viewport dimensions
     * @returns {Object} {width, height}
     */
    getViewport() {
        return {
            width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        };
    },

    /**
     * Calcular distância entre dois pontos
     * @param {number} x1 
     * @param {number} y1 
     * @param {number} x2 
     * @param {number} y2 
     * @returns {number}
     */
    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },

    /**
     * Gerar número aleatório entre min e max
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Mapear valor de uma faixa para outra
     * @param {number} value 
     * @param {number} inMin 
     * @param {number} inMax 
     * @param {number} outMin 
     * @param {number} outMax 
     * @returns {number}
     */
    map(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },

    /**
     * Clamp - limitar valor entre min e max
     * @param {number} value 
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Interpolação linear
     * @param {number} start 
     * @param {number} end 
     * @param {number} factor 
     * @returns {number}
     */
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },

    /**
     * Animação suave para scroll
     * @param {Element} element 
     * @param {number} to 
     * @param {number} duration 
     */
    smoothScrollTo(element, to, duration = 1000) {
        const start = element.scrollTop;
        const change = to - start;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-in-out)
            const easing = progress < 0.5 
                ? 2 * progress * progress 
                : -1 + (4 - 2 * progress) * progress;

            element.scrollTop = start + change * easing;

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    },

    /**
     * Carregar imagem de forma assíncrona
     * @param {string} src 
     * @returns {Promise}
     */
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },

    /**
     * Carregar múltiplas imagens
     * @param {Array} sources 
     * @returns {Promise}
     */
    loadImages(sources) {
        return Promise.all(sources.map(src => this.loadImage(src)));
    },

    /**
     * Formatador de texto - capitalizar primeira letra
     * @param {string} str 
     * @returns {string}
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Formatar data
     * @param {Date} date 
     * @param {string} locale 
     * @returns {string}
     */
    formatDate(date, locale = 'pt-BR') {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },

    /**
     * Copiar texto para clipboard
     * @param {string} text 
     * @returns {Promise}
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback para navegadores mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                textArea.remove();
                return true;
            } catch (err) {
                textArea.remove();
                return false;
            }
        }
    },

    /**
     * Detectar suporte para WebP
     * @returns {Promise<boolean>}
     */
    supportsWebP() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    },

    /**
     * Detectar modo escuro do sistema
     * @returns {boolean}
     */
    prefersDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    },

    /**
     * Detectar se prefere menos movimento
     * @returns {boolean}
     */
    prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    /**
     * Obter informações do navegador
     * @returns {Object}
     */
    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        
        if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';
        else if (ua.includes('Opera')) browser = 'Opera';

        return {
            name: browser,
            userAgent: ua,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        };
    },

    /**
     * Storage helper - Local Storage com fallback
     */
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('LocalStorage não disponível:', e);
                return false;
            }
        },

        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('Erro ao ler LocalStorage:', e);
                return defaultValue;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn('Erro ao remover do LocalStorage:', e);
                return false;
            }
        },

        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.warn('Erro ao limpar LocalStorage:', e);
                return false;
            }
        }
    },

    /**
     * URL helpers
     */
    url: {
        getParams() {
            return new URLSearchParams(window.location.search);
        },

        getParam(name) {
            return this.getParams().get(name);
        },

        setParam(name, value) {
            const url = new URL(window.location);
            url.searchParams.set(name, value);
            window.history.pushState({}, '', url);
        },

        removeParam(name) {
            const url = new URL(window.location);
            url.searchParams.delete(name);
            window.history.pushState({}, '', url);
        }
    },

    /**
     * DOM helpers
     */
    dom: {
        create(tag, attributes = {}, content = '') {
            const element = document.createElement(tag);
            
            Object.keys(attributes).forEach(key => {
                if (key === 'className') {
                    element.className = attributes[key];
                } else if (key === 'innerHTML') {
                    element.innerHTML = attributes[key];
                } else {
                    element.setAttribute(key, attributes[key]);
                }
            });

            if (content) {
                element.textContent = content;
            }

            return element;
        },

        query(selector, context = document) {
            return context.querySelector(selector);
        },

        queryAll(selector, context = document) {
            return Array.from(context.querySelectorAll(selector));
        },

        addClass(element, className) {
            if (element && className) {
                element.classList.add(className);
            }
        },

        removeClass(element, className) {
            if (element && className) {
                element.classList.remove(className);
            }
        },

        toggleClass(element, className) {
            if (element && className) {
                element.classList.toggle(className);
            }
        },

        hasClass(element, className) {
            return element && element.classList.contains(className);
        }
    },

    /**
     * Validadores
     */
    validate: {
        email(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },

        url(url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },

        phone(phone) {
            const regex = /^[\+]?[1-9][\d]{0,15}$/;
            return regex.test(phone.replace(/\s/g, ''));
        }
    },

    /**
     * Performance helpers
     */
    performance: {
        measure(name, fn) {
            const start = performance.now();
            const result = fn();
            const end = performance.now();
            console.log(`${name}: ${end - start}ms`);
            return result;
        },

        async measureAsync(name, fn) {
            const start = performance.now();
            const result = await fn();
            const end = performance.now();
            console.log(`${name}: ${end - start}ms`);
            return result;
        }
    }
};

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
} else if (typeof window !== 'undefined') {
    window.Utils = Utils;
}