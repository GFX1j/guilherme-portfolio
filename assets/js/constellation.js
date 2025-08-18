/**
 * Constellation Animation
 * Cria e anima um fundo de constelação com estrelas conectadas
 */

class Constellation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.lines = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        
        // Configurações
        this.config = {
            starDensity: 8000,
            maxDistance: 130,
            starSize: { min: 0.5, max: 2 },
            opacity: { min: 0.2, max: 0.8 },
            speed: { min: -0.3, max: 0.3 },
            mouseInfluence: 100,
            mouseForce: 0.00005
        };

        this.init();
    }

    init() {
        this.resizeCanvas();
        this.createStars();
        this.bindEvents();
        this.animate();
    }

    resizeCanvas() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    createStars() {
        this.stars = [];
        const numStars = Math.floor((this.width * this.height) / this.config.starDensity);
        
        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * (this.config.starSize.max - this.config.starSize.min) + this.config.starSize.min,
                opacity: Math.random() * (this.config.opacity.max - this.config.opacity.min) + this.config.opacity.min,
                vx: (Math.random() - 0.5) * (this.config.speed.max - this.config.speed.min) + this.config.speed.min,
                vy: (Math.random() - 0.5) * (this.config.speed.max - this.config.speed.min) + this.config.speed.min,
                originalVx: 0,
                originalVy: 0
            });
        }

        // Armazenar velocidades originais
        this.stars.forEach(star => {
            star.originalVx = star.vx;
            star.originalVy = star.vy;
        });
    }

    updateStars() {
        this.stars.forEach(star => {
            // Atualizar posição
            star.x += star.vx;
            star.y += star.vy;

            // Wrap around screen edges
            if (star.x < 0) star.x = this.width;
            if (star.x > this.width) star.x = 0;
            if (star.y < 0) star.y = this.height;
            if (star.y > this.height) star.y = 0;

            // Variação sutil na opacidade
            star.opacity += (Math.random() - 0.5) * 0.02;
            star.opacity = Math.max(this.config.opacity.min, 
                                   Math.min(this.config.opacity.max, star.opacity));

            // Restaurar velocidade original gradualmente
            star.vx += (star.originalVx - star.vx) * 0.01;
            star.vy += (star.originalVy - star.vy) * 0.01;
        });
    }

    createLines() {
        this.lines = [];
        
        for (let i = 0; i < this.stars.length; i++) {
            for (let j = i + 1; j < this.stars.length; j++) {
                const dx = this.stars[i].x - this.stars[j].x;
                const dy = this.stars[i].y - this.stars[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.maxDistance) {
                    this.lines.push({
                        start: this.stars[i],
                        end: this.stars[j],
                        opacity: (this.config.maxDistance - distance) / this.config.maxDistance * 0.5,
                        distance: distance
                    });
                }
            }
        }
    }

    applyMouseInfluence() {
        this.stars.forEach(star => {
            const dx = this.mouse.x - star.x;
            const dy = this.mouse.y - star.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouseInfluence) {
                const force = (this.config.mouseInfluence - distance) / this.config.mouseInfluence;
                star.vx += dx * this.config.mouseForce * force;
                star.vy += dy * this.config.mouseForce * force;
            }
        });
    }

    draw() {
        // Limpar canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Desenhar linhas
        this.lines.forEach(line => {
            this.ctx.beginPath();
            this.ctx.moveTo(line.start.x, line.start.y);
            this.ctx.lineTo(line.end.x, line.end.y);
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${line.opacity})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
        });

        // Desenhar estrelas
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fill();
        });
    }

    animate() {
        this.updateStars();
        this.createLines();
        this.applyMouseInfluence();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    bindEvents() {
        // Resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createStars();
        });

        // Mouse movement
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Touch events for mobile
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
        });

        // Reset mouse position when leaving
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = 0;
            this.mouse.y = 0;
        });
    }

    // Método para pausar/retomar animação (útil para performance)
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }

    // Destruir instância
    destroy() {
        this.pause();
        window.removeEventListener('resize', this.resizeCanvas);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    }
}

// Auto-inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o canvas existe
    const canvas = document.getElementById('constellation');
    if (canvas) {
        window.constellation = new Constellation('constellation');
    }
});

// Exportar para uso modular (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Constellation;
}