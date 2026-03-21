/**
 * Form Handler для обратной связи
 * Включает валидацию, маску телефона, защиту от спама и отправку на email
 */

class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        
        this.phoneInput = document.getElementById('phone');
        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.formMessage = document.getElementById('formMessage');
        
        this.init();
    }
    
    init() {
        // Добавляем защиту от спама (honeypot)
        this.addHoneypot();
        
        // Инициализируем маску телефона
        this.initPhoneMask();
        
        // Добавляем валидацию на лету
        this.initLiveValidation();
        
        // Обработчик отправки формы
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    // 1. Защита от спама через honeypot (невидимое поле)
    addHoneypot() {
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'honeypot';
        honeypot.style.display = 'none';
        honeypot.style.position = 'absolute';
        honeypot.style.left = '-9999px';
        honeypot.setAttribute('aria-hidden', 'true');
        honeypot.autocomplete = 'off';
        honeypot.tabIndex = -1;
        this.form.appendChild(honeypot);
    }
    
    // 2. Маска для телефона
    initPhoneMask() {
        if (this.phoneInput && typeof IMask !== 'undefined') {
            IMask(this.phoneInput, {
                mask: '+{7} (000) 000-00-00',
                lazy: false,
                placeholderChar: '_',
                definitions: {
                    '0': /[0-9]/
                }
            });
        }
    }
    
    // 3. Валидация отдельных полей
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.id;
        let isValid = true;
        let errorMessage = '';
        
        // Удаляем старые подсказки
        this.removeValidationHint(field);
        
        // Проверка обязательных полей
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Это поле обязательно для заполнения';
        }
        
        // Валидация по типу поля
        if (value) {
            switch (fieldName) {
                case 'name':
                    // Имя: только буквы, пробелы и дефисы
                    const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s-]{2,}$/;
                    if (!nameRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Введите корректное имя (минимум 2 буквы)';
                    }
                    break;
                    
                case 'phone':
                    // Телефон: проверяем что введено 10 цифр (без учета +7)
                    const phoneDigits = value.replace(/\D/g, '');
                    if (phoneDigits.length < 11) { // +7 и 10 цифр
                        isValid = false;
                        errorMessage = 'Введите полный номер телефона';
                    }
                    break;
                    
                case 'email':
                    // Email: стандартная валидация
                    if (value) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value)) {
                            isValid = false;
                            errorMessage = 'Введите корректный email адрес';
                        }
                    }
                    break;
                    
                case 'message':
                    // Сообщение: не менее 10 символов, если заполнено
                    if (value && value.length < 10) {
                        isValid = false;
                        errorMessage = 'Сообщение должно содержать минимум 10 символов';
                    }
                    break;
            }
        }
        
        // Визуальное отображение валидации
        if (!isValid) {
            field.classList.add('error');
            field.classList.remove('valid');
            this.showValidationHint(field, errorMessage);
        } else {
            field.classList.remove('error');
            if (value) {
                field.classList.add('valid');
            } else {
                field.classList.remove('valid');
            }
        }
        
        return isValid;
    }
    
    // Показать подсказку валидации
    showValidationHint(field, message) {
        const hint = document.createElement('div');
        hint.className = 'validation-hint show';
        hint.textContent = message;
        field.parentNode.appendChild(hint);
    }
    
    // Удалить подсказку валидации
    removeValidationHint(field) {
        const parent = field.parentNode;
        const hint = parent.querySelector('.validation-hint');
        if (hint) {
            hint.remove();
        }
    }
    
    // Валидация всей формы
    validateForm() {
        const fields = ['name', 'phone', 'email', 'message'].map(id => 
            document.getElementById(id)
        ).filter(field => field !== null);
        
        let isFormValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    }
    
    // Живая валидация при вводе
    initLiveValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }
    
    // Блокировка кнопки отправки
    setButtonLoading(isLoading) {
        if (!this.submitBtn) return;
        
        if (isLoading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }
    
    // Показать сообщение пользователю
    showMessage(type, text) {
        if (!this.formMessage) return;
        
        this.formMessage.className = `form-message ${type} show`;
        this.formMessage.textContent = text;
        
        // Автоматически скрыть сообщение через 5 секунд для успеха
        if (type === 'success') {
            setTimeout(() => {
                this.formMessage.classList.remove('show');
            }, 5000);
        }
        
        // Скролл к сообщению
        this.formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Очистить сообщения
    clearMessages() {
        if (!this.formMessage) return;
        this.formMessage.className = 'form-message';
        this.formMessage.textContent = '';
    }
    
    // Основной обработчик отправки
    async handleSubmit(e) {
        e.preventDefault();
        
        // Очищаем старые сообщения
        this.clearMessages();
        
        // Проверка honeypot (защита от спама)
        const honeypot = this.form.querySelector('input[name="honeypot"]');
        if (honeypot && honeypot.value) {
            console.log('Spam bot detected');
            this.showMessage('error', 'Обнаружен спам-бот. Если вы человек, попробуйте еще раз.');
            return;
        }
        
        // Валидация формы
        if (!this.validateForm()) {
            this.showMessage('error', 'Пожалуйста, исправьте ошибки в форме');
            return;
        }
        
        // Блокируем кнопку
        this.setButtonLoading(true);
        
        // Собираем данные
        const formData = new FormData(this.form);
        
        // Добавляем метку времени для защиты от повторной отправки
        formData.append('timestamp', Date.now());
        
        // Добавляем информацию о странице
        formData.append('page_url', window.location.href);
        formData.append('page_title', document.title);
        
        try {
            // Отправка на Formspree
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Успешная отправка
                this.showMessage('success', '✅ Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в течение 24 часов.');
                
                // Очищаем форму
                this.form.reset();
                
                // Сбрасываем классы валидации
                const inputs = this.form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.classList.remove('valid', 'error');
                });
                
                // Отправляем данные в аналитику (если есть)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'contact',
                        'event_label': 'application_form'
                    });
                }
                
                // Яндекс.Метрика (если есть)
                if (typeof ym !== 'undefined') {
                    ym('reachGoal', 'form_sent');
                }
                
            } else {
                // Обработка ошибок Formspree
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка при отправке');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('error', '❌ Произошла ошибка при отправке. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.');
        } finally {
            // Разблокируем кнопку
            this.setButtonLoading(false);
        }
    }
}

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем подключение IMask
    if (typeof IMask === 'undefined') {
        console.warn('IMask library not loaded. Phone mask will not work.');
    }
    
    // Запускаем обработчик формы
    new FormHandler('contactForm');
});

// Дополнительная защита: отключаем отправку по Enter для некоторых полей
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName === 'TEXTAREA') {
        // Enter в textarea не отправляет форму
        return;
    } else if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault(); // Предотвращаем отправку по Enter в инпутах
    }
});