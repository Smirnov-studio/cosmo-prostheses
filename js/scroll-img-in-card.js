document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.card-gallery');
    if (!gallery) return;
    
    const track = gallery.querySelector('.gallery-track');
    const slides = gallery.querySelectorAll('.gallery-slide');
    const prevBtn = gallery.querySelector('.gallery-btn-prev');
    const nextBtn = gallery.querySelector('.gallery-btn-next');
    const dotsContainer = gallery.querySelector('.gallery-dots');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let isTransitioning = false;
    
    // Создаем индикаторы
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'gallery-dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Перейти к изображению ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.gallery-dot');
    
    // Функция переключения слайда
    function goToSlide(index) {
        if (isTransitioning || index === currentIndex) return;
        isTransitioning = true;
        
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Обновляем активную точку
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
    
    // Следующий слайд
    function nextSlide() {
        const nextIndex = (currentIndex + 1) % totalSlides;
        goToSlide(nextIndex);
    }
    
    // Предыдущий слайд
    function prevSlide() {
        const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        goToSlide(prevIndex);
    }
    
    // Обработчики кнопок
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Свайп для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;
    
    gallery.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    gallery.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Клавиатурная навигация
    document.addEventListener('keydown', (e) => {
        if (gallery.contains(document.activeElement) || e.target.closest('.variant-card')) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            }
        }
    });
});