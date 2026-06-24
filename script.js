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
});
