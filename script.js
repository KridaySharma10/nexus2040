/* ========================================
   NEXUS 2040 - Interactive JavaScript
   Prominent Particle System + Tech Effects
   ======================================== */

$(document).ready(function() {
    
    // ========================================
    // PROMINENT PARTICLE CANVAS
    // High-density, interactive particles
    // ========================================
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 200 };
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    $(window).resize(function() {
        resizeCanvas();
        initParticles();
    });
    
    // Track mouse position
    $(document).mousemove(function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    $(document).mouseleave(function() {
        mouse.x = null;
        mouse.y = null;
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseX = this.x;
            this.baseY = this.y;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 1;
            this.speedY = (Math.random() - 0.5) * 1;
            this.density = (Math.random() * 30) + 1;
            
            // Cyan, purple, green, or orange particles
            const colors = ['#00ffff', '#8a2be2', '#00ff88', '#ff8800', '#00ffff'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.9 + 0.1;
        }
        
        update() {
            // Mouse interaction - particles move away from cursor
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    let forceX = (dx / distance) * 4;
                    let forceY = (dy / distance) * 4;
                    this.x -= forceX;
                    this.y -= forceY;
                }
            }
            
            // Normal movement
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }
    }
    
    function initParticles() {
        particles = [];
        // Higher particle density for prominent effect
        const particleCount = Math.floor((canvas.width * canvas.height) / 4000);
        for (let i = 0; i < Math.min(particleCount, 400); i++) {
            particles.push(new Particle());
        }
    }
    
    function connectParticles() {
        const maxDistance = 150;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    
                    // Gradient line between particles
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    gradient.addColorStop(0, particles[i].color);
                    gradient.addColorStop(1, particles[j].color);
                    
                    ctx.strokeStyle = gradient;
                    ctx.globalAlpha = opacity;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
        
        // Connect particles near mouse with glowing effect
        if (mouse.x !== null && mouse.y !== null) {
            for (let i = 0; i < particles.length; i++) {
                const dx = mouse.x - particles[i].x;
                const dy = mouse.y - particles[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const opacity = (1 - distance / mouse.radius) * 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = '#00ffff';
                    ctx.globalAlpha = opacity;
                    ctx.lineWidth = 1.5;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#00ffff';
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                    ctx.globalAlpha = 1;
                }
            }
            
            // Draw mouse glow
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#00ffff';
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#00ffff';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();
    
    // ========================================
    // MOBILE MENU
    // ========================================
    $('.mobile-menu-btn').click(function() {
        $(this).toggleClass('active');
        $('.mobile-menu').toggleClass('active');
        
        if ($(this).hasClass('active')) {
            $(this).find('span').eq(0).css('transform', 'rotate(45deg) translate(5px, 5px)');
            $(this).find('span').eq(1).css('opacity', '0');
            $(this).find('span').eq(2).css('transform', 'rotate(-45deg) translate(5px, -5px)');
        } else {
            $(this).find('span').css('transform', 'none').css('opacity', '1');
        }
    });
    
    $('.mobile-link').click(function() {
        $('.mobile-menu-btn').removeClass('active').find('span').css('transform', 'none').css('opacity', '1');
        $('.mobile-menu').removeClass('active');
    });
    
    // ========================================
    // SMOOTH SCROLL
    // ========================================
    $('a[href^="#"]').click(function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 1000, 'easeInOutCubic');
        }
    });
    
    $.easing.easeInOutCubic = function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    };
    
    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    function animateOnScroll() {
        $('.analytics-card, .system-card, .team-card').each(function(index) {
            const elem = $(this);
            const elemTop = elem.offset().top;
            const viewportBottom = $(window).scrollTop() + $(window).height();
            
            if (elemTop < viewportBottom - 100 && !elem.hasClass('animated')) {
                setTimeout(function() {
                    elem.addClass('animated');
                    elem.css({
                        'opacity': '1',
                        'transform': 'translateY(0)'
                    });
                }, index * 100);
            }
        });
    }
    
    // Initial styles for animation
    $('.analytics-card, .system-card, .team-card').css({
        'opacity': '0',
        'transform': 'translateY(50px)',
        'transition': 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
    });
    
    animateOnScroll();
    $(window).scroll(animateOnScroll);
    
    // ========================================
    // COUNTER ANIMATION
    // ========================================
    function animateCounters() {
        $('.analytics-value').each(function() {
            const $this = $(this);
            const target = parseFloat($this.attr('data-target'));
            
            if (!$this.hasClass('counted') && isInViewport(this)) {
                $this.addClass('counted');
                
                const duration = 2500;
                const startTime = Date.now();
                
                function updateCounter() {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Ease out cubic
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    const current = target * easeProgress;
                    
                    $this.text(Math.floor(current).toLocaleString());
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        $this.text(target.toLocaleString());
                    }
                }
                
                updateCounter();
            }
        });
    }
    
    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top <= window.innerHeight && rect.bottom >= 0;
    }
    
    animateCounters();
    $(window).scroll(animateCounters);
    
    // ========================================
    // SYSTEM CARD TILT EFFECT
    // ========================================
    $('.system-card, .team-card').each(function() {
        const $card = $(this);
        
        $card.on('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;
            
            $(this).css({
                'transform': `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`,
                'transition': 'none'
            });
            
            // Move glow with mouse
            $(this).find('.card-glow').css({
                'top': (y - rect.height) + 'px',
                'left': (x - rect.width) + 'px'
            });
        });
        
        $card.on('mouseleave', function() {
            $(this).css({
                'transform': 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)',
                'transition': 'all 0.4s ease'
            });
        });
    });
    
    // ========================================
    // TERMINAL TYPING EFFECT
    // ========================================
    function typeTerminal() {
        const $terminal = $('.cta-terminal');
        if ($terminal.length && !$terminal.hasClass('typed')) {
            $terminal.addClass('typed');
            
            const lines = $('.terminal-line');
            lines.css('opacity', '0');
            
            lines.each(function(index) {
                const $line = $(this);
                setTimeout(function() {
                    $line.css({
                        'opacity': '1',
                        'animation': 'fadeInUp 0.4s ease forwards'
                    });
                }, index * 500);
            });
        }
    }
    
    // Run when terminal is in view
    $(window).scroll(function() {
        const $terminal = $('.cta-terminal');
        if ($terminal.length && isInViewport($terminal[0])) {
            typeTerminal();
        }
    });
    
    // ========================================
    // GLITCH TEXT EFFECT
    // ========================================
    function glitchText() {
        const glitchElements = $('.gradient-text');
        
        setInterval(function() {
            glitchElements.each(function() {
                if (Math.random() > 0.97) {
                    $(this).css({
                        'text-shadow': '2px 0 var(--cyan), -2px 0 var(--purple)',
                        'transform': 'translate(' + (Math.random() * 4 - 2) + 'px, 0)'
                    });
                    
                    setTimeout(() => {
                        $(this).css({
                            'text-shadow': 'none',
                            'transform': 'translate(0, 0)'
                        });
                    }, 100);
                }
            });
        }, 100);
    }
    
    glitchText();
    
    // ========================================
    // SCROLL INDICATOR HIDE ON SCROLL
    // ========================================
    $(window).scroll(function() {
        if ($(this).scrollTop() > 200) {
            $('.scroll-indicator').fadeOut();
        } else {
            $('.scroll-indicator').fadeIn();
        }
    });
    
    // ========================================
    // NAV BACKGROUND ON SCROLL
    // ========================================
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.nav').css({
                'background': 'rgba(2, 4, 8, 0.95)',
                'backdrop-filter': 'blur(20px)'
            });
        } else {
            $('.nav').css({
                'background': 'linear-gradient(180deg, rgba(2, 4, 8, 0.95) 0%, transparent 100%)',
                'backdrop-filter': 'none'
            });
        }
    });
    
    // ========================================
    // RANDOM GLOWING DOTS
    // ========================================
    function createGlowingDots() {
        setInterval(function() {
            const $dot = $('<div class="glow-dot"></div>');
            const colors = ['var(--cyan)', 'var(--purple)', 'var(--green)', 'var(--orange)'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            $dot.css({
                'position': 'fixed',
                'width': Math.random() * 5 + 2 + 'px',
                'height': Math.random() * 5 + 2 + 'px',
                'background': color,
                'border-radius': '50%',
                'left': Math.random() * 100 + '%',
                'top': Math.random() * 100 + '%',
                'pointer-events': 'none',
                'z-index': '0',
                'box-shadow': '0 0 15px ' + color,
                'animation': 'glowFade 4s ease-out forwards'
            });
            
            $('body').append($dot);
            
            setTimeout(function() {
                $dot.remove();
            }, 4000);
        }, 300);
    }
    
    // Add the animation styles
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            @keyframes glowFade {
                0% { opacity: 0; transform: scale(0); }
                20% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(0.5) translateY(-80px); }
            }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `)
        .appendTo('head');
    
    createGlowingDots();
    
    // ========================================
    // INITIALIZE ON LOAD
    // ========================================
    $(window).on('load', function() {
        animateOnScroll();
        animateCounters();
    });

});
