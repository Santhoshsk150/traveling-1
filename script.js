document.addEventListener("DOMContentLoaded", () => {
    // 1. Init AOS
    AOS.init({ duration: 1000, once: true, offset: 50 });

    // 2. Typing Effect (Tanspot Strings in Dark Theme)
    if(document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: ['TRANSPORT', 'PROVIDER', 'SOLUTIONS', 'EXECUTION'],
            typeSpeed: 70,
            backSpeed: 30,
            backDelay: 1500,
            loop: true
        });
    }

    // 3. Header Scroll Effect (Dark bg styling)
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 80) {
            header.classList.remove('py-4', 'bg-darkBg/90');
            header.classList.add('py-2', 'bg-darkBg', 'shadow-lg');
        } else {
            header.classList.remove('py-2', 'bg-darkBg', 'shadow-lg');
            header.classList.add('py-4', 'bg-darkBg/90');
        }
    });

    // 4. Progress Bars Logic (From Tanspot)
    const progressBars = document.querySelectorAll('.progress-fill');
    const handleScroll = () => {
        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if(rect.top < window.innerHeight && rect.bottom >= 0) {
                bar.style.width = bar.getAttribute('data-width');
            }
        });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger once on load

    // 5. GSAP Entrance Details
    gsap.set(".hero-content", { opacity: 0 });
    gsap.to(".hero-content", { opacity: 1, duration: 2, ease: "power2.out" });

    // Subtle orb breathe
    gsap.to(".glow-orb", {
        scale: 1.1, opacity: 0.8,
        duration: 4, repeat: -1, yoyo: true,
        ease: "sine.inOut"
    });

    // 6. Interactive Mouse Movement Parallax (Integrated into Tanspot Hero)
    const heroSection = document.querySelector('.hero-section');
    const orb = document.querySelector('.glow-orb');
    const grid = document.querySelector('.grid-overlay');
    const contentBox = document.querySelector('.hero-content');
    
    // Only apply if they exist (defensively)
    if(heroSection && orb && grid) {
        heroSection.addEventListener('mousemove', (e) => {
            const xPos = (e.clientX / window.innerWidth) * 2 - 1;
            const yPos = (e.clientY / window.innerHeight) * 2 - 1;
            
            gsap.to(orb, { x: xPos * -80, y: yPos * -80, duration: 1.5, ease: "power2.out" });
            gsap.to(grid, { x: xPos * 40, y: yPos * 40, duration: 2, ease: "power2.out" });
            if(contentBox) {
                gsap.to(contentBox, { x: xPos * 15, y: yPos * 15, duration: 1, ease: "power3.out" });
            }
        });

        heroSection.addEventListener('mouseleave', () => {
            gsap.to([orb, grid, contentBox], { x: 0, y: 0, duration: 1.5, ease: "power2.out" });
        });
    }
});
