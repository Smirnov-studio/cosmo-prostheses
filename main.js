// Меню бургер
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burgerMenu');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenu = document.getElementById('closeMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    // Открытие меню
    burgerMenu.addEventListener('click', function() {
        sideMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Закрытие меню
    function closeSideMenu() {
        sideMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    closeMenu.addEventListener('click', closeSideMenu);
    menuOverlay.addEventListener('click', closeSideMenu);
    
    // Закрытие меню при клике на ссылку
    menuLinks.forEach(link => {
        link.addEventListener('click', closeSideMenu);
    });
    
    // FAQ аккордеон
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const toggleIcon = this.querySelector('.faq-toggle i');
            
            // Закрываем другие открытые ответы
            document.querySelectorAll('.faq-answer').forEach(item => {
                if (item !== answer && item.classList.contains('active')) {
                    item.classList.remove('active');
                    item.previousElementSibling.querySelector('.faq-toggle i').classList.remove('fa-chevron-up');
                    item.previousElementSibling.querySelector('.faq-toggle i').classList.add('fa-chevron-down');
                }
            });
            
            // Открываем/закрываем текущий ответ
            answer.classList.toggle('active');
            
            if (answer.classList.contains('active')) {
                toggleIcon.classList.remove('fa-chevron-down');
                toggleIcon.classList.add('fa-chevron-up');
            } else {
                toggleIcon.classList.remove('fa-chevron-up');
                toggleIcon.classList.add('fa-chevron-down');
            }
        });
    });
    
    // Обработка формы
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Валидация формы
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        if (!name || !phone) {
            showFormMessage('Пожалуйста, заполните обязательные поля', 'error');
            return;
        }
        
        // Отправка формы через Formspree
        const formData = new FormData(contactForm);
        
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showFormMessage('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
                contactForm.reset();
            } else {
                showFormMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.', 'error');
            }
        })
        .catch(error => {
            showFormMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.', 'error');
        });
    });
    
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';
        
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    
    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами, которые должны анимироваться
    document.querySelectorAll('.feature-card, .order-step, .review-card, .faq-item, .variant-card').forEach(el => {
        observer.observe(el);
    });
});