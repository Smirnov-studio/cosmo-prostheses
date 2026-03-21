const scrollToTopBtn = document.getElementById('scrollToTopBtn');

// Показываем/скрываем кнопку при скролле
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

// Плавная прокрутка наверх при клике
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});