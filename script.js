/* ==========================================
   SNEHAL'S PORTFOLIO — INTERACTION ENGINE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* ==========================================
       1. MOBILE NAVIGATION
    ========================================== */

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {
                navLinks.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });

        });

    }


    /* ==========================================
       2. SCROLL PROGRESS BAR
    ========================================== */

    const progressBar = document.createElement("div");

    progressBar.className = "scroll-progress";

    progressBar.setAttribute("aria-hidden", "true");

    document.body.appendChild(progressBar);

    let scrollScheduled = false;

    function updateScrollProgress() {

        const scrollableHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress = scrollableHeight > 0
            ? (window.scrollY / scrollableHeight) * 100
            : 0;

        progressBar.style.width = `${progress}%`;

        scrollScheduled = false;
    }

    window.addEventListener("scroll", () => {

        if (!scrollScheduled) {

            requestAnimationFrame(updateScrollProgress);

            scrollScheduled = true;
        }

    }, { passive: true });

    updateScrollProgress();


    /* ==========================================
       3. SCROLL REVEAL + STAGGERED ANIMATIONS
    ========================================== */

    const revealSelectors = [
        ".section-heading",
        ".about-photo-card",
        ".about-text",
        ".highlight-card",
        ".skill-card",
        ".experience-card",
        ".project-card",
        ".achievement-card",
        ".contact-card",
        ".education-card"
    ];

    const revealElements = document.querySelectorAll(
        revealSelectors.join(",")
    );

    if (reducedMotion || !("IntersectionObserver" in window)) {

        revealElements.forEach(element => {
            element.classList.add("motion-visible");
        });

    } else {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        const element = entry.target;

                        const siblings = [
                            ...element.parentElement.children
                        ].filter(child =>
                            child.matches(
                                revealSelectors.join(",")
                            )
                        );

                        const index = siblings.indexOf(element);

                        element.style.setProperty(
                            "--reveal-delay",
                            `${Math.max(index, 0) * 90}ms`
                        );

                        element.classList.add("motion-visible");

                        observer.unobserve(element);
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    }


    /* ==========================================
       4. HERO SPOTLIGHT + 3D PROFILE TILT
    ========================================== */

    const hero = document.querySelector(".fx-hero");

    const profileCard = document.querySelector(
        ".fx-profile-card"
    );

    if (hero && !reducedMotion) {

        hero.addEventListener("pointermove", event => {

            if (event.pointerType === "touch") return;

            const rect = hero.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            hero.style.setProperty("--mouse-x", `${x}px`);

            hero.style.setProperty("--mouse-y", `${y}px`);

            if (profileCard && window.innerWidth > 900) {

                const normalizedX =
                    (x / rect.width - 0.5) * 2;

                const normalizedY =
                    (y / rect.height - 0.5) * 2;

                const rotateY = normalizedX * 9;

                const rotateX = normalizedY * -7;

                profileCard.style.transform =
                    `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }

        });

        hero.addEventListener("pointerleave", () => {

            if (profileCard) {
                profileCard.style.transform = "";
            }

        });

    }


    /* ==========================================
       5. TYPING ANIMATION
    ========================================== */

    const typingElement = document.getElementById(
        "typing-text"
    );

    if (typingElement) {

        const words = [
            "web experiences.",
            "creative projects.",
            "software solutions.",
            "electronics projects.",
            "ideas into reality."
        ];

        if (reducedMotion) {

            typingElement.textContent = words[0];

        } else {

            let wordIndex = 0;
            let characterIndex = 0;
            let deleting = false;

            function typeEffect() {

                const currentWord = words[wordIndex];

                if (!deleting) {

                    characterIndex++;

                    typingElement.textContent =
                        currentWord.substring(0, characterIndex);

                    if (characterIndex >= currentWord.length) {

                        deleting = true;

                        setTimeout(typeEffect, 1400);

                        return;
                    }

                } else {

                    characterIndex--;

                    typingElement.textContent =
                        currentWord.substring(0, characterIndex);

                    if (characterIndex <= 0) {

                        deleting = false;

                        wordIndex =
                            (wordIndex + 1) % words.length;
                    }

                }

                setTimeout(
                    typeEffect,
                    deleting ? 35 : 75
                );

            }

            typeEffect();

        }

    }


    /* ==========================================
       6. 3D PROJECT + SKILL CARDS
    ========================================== */

    const interactiveCards = document.querySelectorAll(
        ".project-card, .skill-card, .achievement-card"
    );

    if (!reducedMotion && window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches) {

        interactiveCards.forEach(card => {

            card.addEventListener("pointermove", event => {

                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateY = ((x - centerX) / centerX) * 4;
                const rotateX = ((centerY - y) / centerY) * 4;

                card.style.setProperty(
                    "--card-mouse-x",
                    `${x}px`
                );

                card.style.setProperty(
                    "--card-mouse-y",
                    `${y}px`
                );

                card.style.transform =
                    `perspective(900px) translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            });

            card.addEventListener("pointerleave", () => {

                card.style.transform = "";

            });

        });

    }


    /* ==========================================
       7. MOUSE-FOLLOWING GLOW
    ========================================== */

    if (
        !reducedMotion &&
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        ).matches
    ) {

        const spotlight = document.createElement("div");

        spotlight.className = "site-spotlight";

        spotlight.setAttribute("aria-hidden", "true");

        document.body.appendChild(spotlight);

        let spotlightX = -500;
        let spotlightY = -500;

        document.addEventListener("pointermove", event => {

            spotlightX = event.clientX;
            spotlightY = event.clientY;

            spotlight.style.transform =
                `translate3d(${spotlightX - 180}px, ${spotlightY - 180}px, 0)`;

        }, { passive: true });

    }


    /* ==========================================
       8. ACTIVE NAVIGATION LINK
    ========================================== */

    const navigationLinks = document.querySelectorAll(
        ".nav-links a[href^='#']"
    );

    const pageSections = document.querySelectorAll(
        "main section[id]"
    );

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    const sectionId = entry.target.id;

                    navigationLinks.forEach(link => {

                        const isActive =
                            link.getAttribute("href") ===
                            `#${sectionId}`;

                        link.classList.toggle(
                            "active-section-link",
                            isActive
                        );

                    });

                });

            },
            {
                rootMargin: "-25% 0px -60% 0px"
            }
        );

        pageSections.forEach(section => {
            sectionObserver.observe(section);
        });

    }


    /* ==========================================
       9. ANIMATED COUNTERS
       Only elements with data-count animate.
    ========================================== */

    const counters = document.querySelectorAll(
        "[data-count]"
    );

    if ("IntersectionObserver" in window) {

        const counterObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    const counter = entry.target;

                    const target = Number(
                        counter.dataset.count
                    );

                    if (
                        !Number.isFinite(target) ||
                        target < 0
                    ) {
                        observer.unobserve(counter);
                        return;
                    }

                    if (reducedMotion) {

                        counter.textContent =
                            Math.round(target).toString();

                        observer.unobserve(counter);

                        return;
                    }

                    const duration = 1200;

                    const startTime = performance.now();

                    function animateCounter(now) {

                        const progress = Math.min(
                            (now - startTime) / duration,
                            1
                        );

                        const eased =
                            1 - Math.pow(1 - progress, 3);

                        counter.textContent = Math.round(
                            target * eased
                        ).toString();

                        if (progress < 1) {

                            requestAnimationFrame(
                                animateCounter
                            );

                        } else {

                            observer.unobserve(counter);

                        }

                    }

                    requestAnimationFrame(animateCounter);

                });

            },
            {
                threshold: 0.5
            }
        );

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });

    }


    /* ==========================================
       10. TIMELINE SCROLL PROGRESS
       Activates timeline milestones when visible.
    ========================================== */

    const timelineItems = document.querySelectorAll(
        ".timeline-item, .experience-item"
    );

    if (reducedMotion || !("IntersectionObserver" in window)) {

        timelineItems.forEach(item => {
            item.classList.add("timeline-visible");
        });

    } else {

        const timelineObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "timeline-visible"
                        );

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.2
            }
        );

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });

    }


    console.log("Snehal's portfolio interactions loaded!");

});