// Меню бургер + FAQ + форма + плавная прокрутка + reveal
document.addEventListener('DOMContentLoaded', function() {
    document.documentElement.classList.add('js');

    const burgerMenu = document.getElementById('burgerMenu');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenu = document.getElementById('closeMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuLinks = document.querySelectorAll('.menu-link');

    // Открытие меню
    burgerMenu && burgerMenu.addEventListener('click', function() {
        sideMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Закрытие меню
    function closeSideMenu() {
        sideMenu && sideMenu.classList.remove('active');
        menuOverlay && menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeMenu && closeMenu.addEventListener('click', closeSideMenu);
    menuOverlay && menuOverlay.addEventListener('click', closeSideMenu);

    // Закрытие меню при клике на ссылку
    menuLinks.forEach(link => link.addEventListener('click', closeSideMenu));

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSideMenu();
    });

    // ===== FAQ аккордеон =====
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const toggleIcon = this.querySelector('.faq-toggle i');

            // Закрываем другие открытые ответы
            document.querySelectorAll('.faq-answer').forEach(item => {
                if (item !== answer && item.classList.contains('active')) {
                    item.classList.remove('active');
                    const icon = item.previousElementSibling?.querySelector('.faq-toggle i');
                    icon && icon.classList.remove('fa-chevron-up');
                    icon && icon.classList.add('fa-chevron-down');
                }
            });

            // Открываем/закрываем текущий ответ
            answer && answer.classList.toggle('active');

            if (answer && answer.classList.contains('active')) {
                toggleIcon && toggleIcon.classList.remove('fa-chevron-down');
                toggleIcon && toggleIcon.classList.add('fa-chevron-up');
            } else {
                toggleIcon && toggleIcon.classList.remove('fa-chevron-up');
                toggleIcon && toggleIcon.classList.add('fa-chevron-down');
            }
        });
    });

    // ===== Обработка формы =====
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    function showFormMessage(message, type) {
        if (!formMessage) return;
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';

        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    contactForm && contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();

        if (!name || !phone) {
            showFormMessage('Пожалуйста, заполните обязательные поля', 'error');
            return;
        }

        const formData = new FormData(contactForm);

        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                showFormMessage('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
                contactForm.reset();
            } else {
                showFormMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.', 'error');
            }
        })
        .catch(() => {
            showFormMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.', 'error');
        });
    });

    // ===== Плавная прокрутка к якорям (учёт высоты шапки) =====
    const header = document.querySelector('.header');

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();
            const headerOffset = header ? header.getBoundingClientRect().height : 0;
            const extra = 16;
            const y = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset - extra;

            window.scrollTo({ top: y, behavior: 'smooth' });
        });
    });

    // ===== Reveal при скролле =====
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -10% 0px' };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('animated');
                obs.unobserve(entry.target);
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card, .order-step, .review-card, .faq-item, .variant-card')
            .forEach(el => observer.observe(el));
    } else {
        document.querySelectorAll('.feature-card, .order-step, .review-card, .faq-item, .variant-card')
            .forEach(el => el.classList.add('animated'));
    }
});
