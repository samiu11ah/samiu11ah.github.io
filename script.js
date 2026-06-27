// Mobile menu toggle + active link sync + smooth back-to-top
document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar a');
    const sections = document.querySelectorAll('section');
    const header = document.querySelector('.header');

    // Toggle mobile menu
    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            menuIcon.classList.toggle('bx-x');
            navbar.classList.toggle('active');
        });
    }

    // Close mobile menu after clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuIcon) menuIcon.classList.remove('bx-x');
            if (navbar) navbar.classList.remove('active');
        });
    });

    // Highlight nav link of the section currently in view
    const onScroll = () => {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(l => l.classList.remove('active'));
                const activeLink = document.querySelector(`.navbar a[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
        if (header) header.classList.toggle('sticky', window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── CONTACT FORM ──
    const contactForm = document.querySelector('.contact form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            const data = {
                name:    contactForm.querySelector('input[placeholder="Full Name"]').value.trim(),
                email:   contactForm.querySelector('input[type="email"]').value.trim(),
                phone:   contactForm.querySelector('input[placeholder="Mobile Number"]').value.trim(),
                subject: contactForm.querySelector('input[placeholder="Subject"]').value.trim(),
                message: contactForm.querySelector('textarea').value.trim(),
            };

            try {
                const res = await fetch('https://email-service.msamiullah295.workers.dev/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                const result = await res.json();

                if (result.success) {
                    btn.textContent = 'Message Sent ✓';
                    btn.style.background = '#00c48c';
                    contactForm.reset();
                } else {
                    btn.textContent = 'Failed — Try Again';
                    btn.style.background = '#e74c3c';
                }
            } catch (err) {
                btn.textContent = 'Failed — Try Again';
                btn.style.background = '#e74c3c';
            } finally {
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }
        });
    }

});