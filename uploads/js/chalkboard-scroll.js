// Fixed Chalkboard with Chalk Dust Effects
class FixedChalkboard {
    constructor() {
        this.init();
    }

    init() {
        // Add scroll listener for subtle effects
        const contentArea = document.querySelector('.chalkboard-content');
        if (contentArea) {
            contentArea.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        }
        
        // Add chalk dust particles
        this.createChalkDust();
        
        // Add eraser marks occasionally
        this.addEraserMarks();
    }

    handleScroll() {
        const contentArea = document.querySelector('.chalkboard-content');
        if (!contentArea) return;
        
        const scrollPercent = contentArea.scrollTop / (contentArea.scrollHeight - contentArea.clientHeight);
        
        // Subtle parallax effect on any background elements
        const elements = document.querySelectorAll('.uk-container, .uk-section');
        elements.forEach((element, index) => {
            const offset = scrollPercent * 10 * (index % 2 === 0 ? 1 : -1);
            element.style.transform = `translateX(${offset}px)`;
        });
    }

    createChalkDust() {
        // Add subtle chalk dust animation
        const chalkboardFrame = document.querySelector('.chalkboard-frame');
        if (!chalkboardFrame) return;
        
        for (let i = 0; i < 8; i++) {
            const dust = document.createElement('div');
            dust.className = 'chalk-dust-particle';
            dust.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(248, 248, 240, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: chalkDustFloat ${Math.random() * 10 + 15}s infinite linear;
                pointer-events: none;
                z-index: 50;
            `;
            chalkboardFrame.appendChild(dust);
        }
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes chalkDustFloat {
                0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-20px) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    addEraserMarks() {
        // Occasionally add eraser smudge marks to the chalkboard
        const contentArea = document.querySelector('.chalkboard-content');
        if (!contentArea) return;
        
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every interval
                const smudge = document.createElement('div');
                smudge.className = 'eraser-smudge';
                smudge.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 30 + 20}px;
                    height: ${Math.random() * 15 + 10}px;
                    background: radial-gradient(ellipse, rgba(248, 248, 240, 0.1) 0%, transparent 70%);
                    border-radius: 50%;
                    left: ${Math.random() * 80 + 10}%;
                    top: ${Math.random() * 80 + 10}%;
                    pointer-events: none;
                    z-index: 1;
                    animation: fadeInOut 3s ease-in-out forwards;
                `;
                contentArea.appendChild(smudge);
                
                // Remove after animation
                setTimeout(() => {
                    if (smudge.parentNode) {
                        smudge.parentNode.removeChild(smudge);
                    }
                }, 3000);
            }
        }, 5000);
        
        // Add fade animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Simple parallax for brick wall
class BrickWallParallax {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    }

    handleScroll() {
        const scrollY = window.pageYOffset;
        const speed = 0.2;
        
        // Very subtle movement of brick background
        document.body.style.backgroundPosition = `0 ${scrollY * speed}px, 0 ${scrollY * speed * 0.3}px`;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure styles are loaded
    setTimeout(() => {
        new FixedChalkboard();
        new BrickWallParallax();
    }, 100);
});