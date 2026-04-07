// Animate the "Emails Sent Today" counter on scroll
(function () {
    'use strict';

    // --- Counter Animation ---
    const counterEl = document.querySelector('[data-target]');
    let counterDone = false;

    function animateCounter(el, target, duration) {
        const start = 0;
        const startTime = performance.now();

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * eased);
            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                // After reaching the target, start the slow trickle
                startTrickle(el, target);
            }
        }

        requestAnimationFrame(tick);
    }

    // Slowly increment the counter to make it feel "live"
    function startTrickle(el, startValue) {
        let current = startValue;
        function trickle() {
            const delay = 2000 + Math.random() * 6000; // 2 to 8 seconds
            setTimeout(function () {
                current += Math.floor(Math.random() * 3) + 1;
                el.textContent = current.toLocaleString();
                trickle();
            }, delay);
        }
        trickle();
    }

    // Trigger counter when hero stats scroll into view
    if (counterEl) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !counterDone) {
                    counterDone = true;
                    var target = parseInt(counterEl.getAttribute('data-target'), 10);
                    animateCounter(counterEl, target, 2000);
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        observer.observe(counterEl);
    }

    // --- Smooth scroll for nav links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var navHeight = document.querySelector('.nav').offsetHeight;
                var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // --- Mobile menu toggle ---
    var menuBtn = document.querySelector('.mobile-menu-btn');
    var navLinks = document.querySelector('.nav-links');
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function () {
            var isOpen = navLinks.style.display === 'flex';
            navLinks.style.display = isOpen ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '72px';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'white';
            navLinks.style.padding = isOpen ? '0' : '16px 24px';
            navLinks.style.gap = '16px';
            navLinks.style.borderBottom = isOpen ? 'none' : '1px solid #e2e8f0';
            navLinks.style.boxShadow = isOpen ? 'none' : '0 4px 12px rgba(0,0,0,0.1)';
        });
    }

    // --- Randomize status badges occasionally ---
    var statusLabels = {
        warning: [
            'Intermittent', 'Questionable', 'Vibes Only', 'Aspirational',
            'Mostly Okay', 'Cautiously Optimistic', 'Best Effort'
        ],
        critical: [
            'Lol', 'Good Luck', 'Thoughts & Prayers', 'TBD',
            'On Break', 'Ask Again Later', '404'
        ],
        ok: [
            'Operational', 'Overzealous', 'Surprisingly Fine',
            'Working (For Now)', 'Nominally Alive', 'Exceeding Expectations'
        ]
    };

    function randomizeStatuses() {
        document.querySelectorAll('.status-badge').forEach(function (badge) {
            var type;
            if (badge.classList.contains('status-warning')) type = 'warning';
            else if (badge.classList.contains('status-critical')) type = 'critical';
            else if (badge.classList.contains('status-ok')) type = 'ok';
            if (type) {
                var options = statusLabels[type];
                badge.textContent = options[Math.floor(Math.random() * options.length)];
            }
        });
    }

    // Shuffle statuses every 8 to 15 seconds
    (function scheduleRandomize() {
        var delay = 8000 + Math.random() * 7000;
        setTimeout(function () {
            randomizeStatuses();
            scheduleRandomize();
        }, delay);
    })();

    // --- Animate elements on scroll ---
    var animateEls = document.querySelectorAll(
        '.feature-card, .step, .price-card, .testimonial-card, .faq-item, .tos-item'
    );

    var fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animateEls.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fadeObserver.observe(el);
    });

})();
