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

    // ── POPUP ──
    const popupStyles = `
        #contact-popup {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(6px);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.35s ease;
        }
        #contact-popup.show {
            opacity: 1;
            pointer-events: all;
        }
        #contact-popup .popup-box {
            background: #112e42;
            border: 0.2rem solid #00abf0;
            border-radius: 1rem;
            padding: 4rem 4rem 3rem;
            max-width: 44rem;
            width: 90%;
            text-align: center;
            position: relative;
            transform: translateY(24px) scale(0.97);
            transition: transform 0.35s cubic-bezier(0.34,1.2,0.64,1);
            box-shadow: 0 0 40px rgba(0, 171, 240, 0.15);
        }
        #contact-popup.show .popup-box {
            transform: translateY(0) scale(1);
        }
        #contact-popup .popup-icon {
            font-size: 5rem;
            margin-bottom: 1.5rem;
            display: block;
        }
        #contact-popup .popup-title {
            font-size: 2.2rem;
            font-weight: 600;
            color: #00abf0;
            margin-bottom: 1rem;
            font-family: 'Poppins', sans-serif;
        }
        #contact-popup .popup-msg {
            font-size: 1.5rem;
            color: #ededed;
            line-height: 1.7;
            margin-bottom: 2.5rem;
            font-family: 'Poppins', sans-serif;
        }
        #contact-popup .popup-close {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            padding: 1rem 3rem;
            background: #00abf0;
            border: 0.2rem solid #00abf0;
            border-radius: 0.8rem;
            font-size: 1.5rem;
            font-weight: 600;
            color: #000;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transition: background 0.3s, color 0.3s;
            letter-spacing: 0.05rem;
        }
        #contact-popup .popup-close:hover {
            background: transparent;
            color: #00abf0;
        }
        #contact-popup.error .popup-box {
            border-color: #e74c3c;
            box-shadow: 0 0 40px rgba(231, 76, 60, 0.15);
        }
        #contact-popup.error .popup-title { color: #e74c3c; }
        #contact-popup.error .popup-close {
            background: #e74c3c;
            border-color: #e74c3c;
        }
        #contact-popup.error .popup-close:hover {
            background: transparent;
            color: #e74c3c;
        }
    `;

    const styleTag = document.createElement('style');
    styleTag.textContent = popupStyles;
    document.head.appendChild(styleTag);

    const popupHTML = `
        <div id="contact-popup">
            <div class="popup-box">
                <span class="popup-icon">✉️</span>
                <div class="popup-title">Message Delivered!</div>
                <p class="popup-msg">Thanks for reaching out. I've received your message and will get back to you shortly.</p>
                <button class="popup-close">Got it</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    const popup = document.getElementById('contact-popup');
    const popupClose = popup.querySelector('.popup-close');
    const popupTitle = popup.querySelector('.popup-title');
    const popupMsg = popup.querySelector('.popup-msg');
    const popupIcon = popup.querySelector('.popup-icon');

    function showPopup(success) {
        if (success) {
            popup.classList.remove('error');
            popupIcon.textContent = '✉️';
            popupTitle.textContent = 'Message Delivered!';
            popupMsg.textContent = "Thanks for reaching out. I've received your message and will get back to you shortly.";
        } else {
            popup.classList.add('error');
            popupIcon.textContent = '⚠️';
            popupTitle.textContent = 'Something went wrong';
            popupMsg.textContent = 'Your message could not be sent. Please try again or reach out directly via WhatsApp or email.';
        }
        popup.classList.add('show');
    }

    function hidePopup() {
        popup.classList.remove('show');
    }

    popupClose.addEventListener('click', hidePopup);
    popup.addEventListener('click', (e) => {
        if (e.target === popup) hidePopup();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hidePopup();
    });

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
                    showPopup(true);
                } else {
                    btn.textContent = 'Failed — Try Again';
                    btn.style.background = '#e74c3c';
                    showPopup(false);
                }
            } catch (err) {
                btn.textContent = 'Failed — Try Again';
                btn.style.background = '#e74c3c';
                showPopup(false);
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