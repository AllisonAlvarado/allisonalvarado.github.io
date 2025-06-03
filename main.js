document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for nav links with offset for navbar height
    const NAVBAR_OFFSET = 70; // Adjust this value to match your navbar height in px
    document.querySelectorAll('.nav-menu a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').slice(1);
            if (targetId === 'about') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                const rect = target.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const top = rect.top + scrollTop - NAVBAR_OFFSET;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // Smooth scroll for nav links (desktop and mobile)
    function scrollToSectionWithOffset(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                // Get navbar height (if visible)
                let offset = 0;
                const navbar = document.querySelector('.navbar');
                if (navbar && window.getComputedStyle(navbar).display !== 'none') {
                    offset = navbar.offsetHeight;
                }
                const rect = target.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                window.scrollTo({
                    top: rect.top + scrollTop - offset,
                    behavior: 'smooth'
                });
            }
        }
    }

    // Mobile submenu toggle (for accessibility)
    document.querySelectorAll('.has-submenu > a').forEach(parentLink => {
        parentLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 600) {
                e.preventDefault();
                const submenu = this.nextElementSibling;
                if (submenu) {
                    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                }
            }
        });
    });

    // Hide submenus when clicking outside (mobile)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 600) {
            document.querySelectorAll('.submenu').forEach(submenu => {
                if (!submenu.contains(e.target) && !submenu.previousElementSibling.contains(e.target)) {
                    submenu.style.display = 'none';
                }
            });
        }
    });

    // Submenu close on mouse leave
    document.querySelectorAll('.has-submenu').forEach(function(item) {
        const submenu = item.querySelector('.submenu');
        if (!submenu) return;
        item.addEventListener('mouseenter', function() {
            submenu.style.display = 'block';
        });
        item.addEventListener('mouseleave', function() {
            submenu.style.display = 'none';
        });
        // Also close if submenu itself is hovered and then mouse leaves
        submenu.addEventListener('mouseenter', function() {
            submenu.style.display = 'block';
        });
        submenu.addEventListener('mouseleave', function() {
            submenu.style.display = 'none';
        });
    });

    // Carousel logic
    document.querySelectorAll('.carousel').forEach(function(carousel) {
        const images = JSON.parse(carousel.getAttribute('data-images'));
        let current = 0;
        let intervalId = null;

        // Create image element
        const img = document.createElement('img');
        img.src = images[0];
        img.alt = 'Project image';
        carousel.appendChild(img);

        // Create prev/next buttons
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-btn prev';
        prevBtn.innerHTML = '&#8592;';
        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-btn next';
        nextBtn.innerHTML = '&#8594;';
        carousel.appendChild(prevBtn);
        carousel.appendChild(nextBtn);

        // Create indicators
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        images.forEach((_, idx) => {
            const dot = document.createElement('span');
            dot.className = 'carousel-indicator' + (idx === 0 ? ' active' : '');
            dot.addEventListener('click', () => goTo(idx));
            indicators.appendChild(dot);
        });
        carousel.appendChild(indicators);

        function updateCarousel() {
            img.src = images[current];
            indicators.querySelectorAll('.carousel-indicator').forEach((dot, idx) => {
                dot.classList.toggle('active', idx === current);
            });
        }
        function goTo(idx) {
            current = idx;
            updateCarousel();
        }
        function startAutoScroll() {
            if (intervalId) return;
            intervalId = setInterval(() => {
                current = (current + 1) % images.length;
                updateCarousel();
            }, 3000);
        }
        function stopAutoScroll() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }
        function restartAutoScroll() {
            stopAutoScroll();
            startAutoScroll();
        }
        prevBtn.addEventListener('click', function() {
            current = (current - 1 + images.length) % images.length;
            updateCarousel();
            restartAutoScroll();
        });
        nextBtn.addEventListener('click', function() {
            current = (current + 1) % images.length;
            updateCarousel();
            restartAutoScroll();
        });

        // Auto-scroll logic
        function startAutoScroll() {
            if (intervalId) return;
            intervalId = setInterval(() => {
                current = (current + 1) % images.length;
                updateCarousel();
            }, 3000);
        }
        function stopAutoScroll() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }
        // Intersection Observer to detect if carousel is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAutoScroll();
                } else {
                    stopAutoScroll();
                }
            });
        }, { threshold: 0.5 });
        observer.observe(carousel);
    });

    // Software name to icon URL mapping
    const softwareIcons = {
        autocad: "https://images.seeklogo.com/logo-png/48/1/autocad-logo-png_seeklogo-482394.png",
        revit: "https://www.nti-group.com/globalassets/icons/product-icons/autodesk-icons/2023/autodesk-revit-small-social-400.png",
        sketchup: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPRWhwCc5-LHbfvqbWFOhaRoKb_bs031J3LQ&s",
        vray: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEbOL_DaNW6jLgosx_MwICj9A2ZbDT2O8xxQ&s",
        lumion: "https://logovtor.com/wp-content/uploads/2020/08/lumion-france-logo-vector.png",
        enscape: "https://procadsys.b-cdn.net/wp-content/uploads/2021/03/enscape_icon.png",
        rhino: "https://www.rhino3d.com/8/v8-icon-small.png",
        solidworks: "https://img.icons8.com/color/512/solidworks.png",
        keyshot: "https://media.licdn.com/dms/image/v2/D560BAQHX2wUZQARY_g/company-logo_200_200/company-logo_200_200/0/1722442384355/keyshot_logo?e=2147483647&v=beta&t=NHzNstC3c4vTQ_BUOKS0VrWimwDnl9xa57fgYCQX8ac"
    };

    function renderToolIcons(container) {
        const names = container.getAttribute('data-tools');
        if (!names) return;
        container.innerHTML = '';
        names.split(',').map(s => s.trim().toLowerCase()).forEach(name => {
            const url = softwareIcons[name];
            if (url) {
                const img = document.createElement('img');
                img.src = url;
                img.alt = name.charAt(0).toUpperCase() + name.slice(1);
                img.title = img.alt;
                container.appendChild(img);
            }
        });
    }

    // Render tool icons by software name
    document.querySelectorAll('.tools-logos[data-tools]').forEach(renderToolIcons);

    // Burger menu logic
    const burger = document.querySelector('.burger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay, .mobile-overlay');
    const body = document.body;

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        body.style.overflow = 'hidden';
    }
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        body.style.overflow = '';
        // Close all open submenus
        document.querySelectorAll('.mobile-menu .submenu.open').forEach(sm => sm.classList.remove('open'));
    }

    burger.addEventListener('click', openMobileMenu);
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close mobile menu when a menu option is clicked
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu .mobile-nav-menu a, .mobile-menu .submenu-toggle');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });

    // Close mobile menu when mouse leaves the menu (desktop/tablet only)
    mobileMenu.addEventListener('mouseleave', function() {
        if (window.innerWidth <= 900) {
            closeMobileMenu();
        }
    });

    // Mobile submenu toggle
    const submenuToggles = document.querySelectorAll('.mobile-menu .submenu-toggle');
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const submenu = this.parentElement.querySelector('.submenu');
            if (submenu.classList.contains('open')) {
                submenu.classList.remove('open');
            } else {
                // Close other open submenus
                document.querySelectorAll('.mobile-menu .submenu.open').forEach(sm => sm.classList.remove('open'));
                submenu.classList.add('open');
            }
        });
    });

    // Close mobile menu on nav link click (scroll to section)
    document.querySelectorAll('.mobile-menu .nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });

    // Prevent background scroll when mobile menu is open (handled by body.style.overflow)
});