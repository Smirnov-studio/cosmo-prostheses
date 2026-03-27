// Скрипт управления куки-согласием для Яндекс.Метрики и Google Analytics (с адаптивом)

(function() {
    // Конфигурация
    const CONFIG = {
        CONSENT_KEY: 'cookie_consent',
        YANDEX_METRIKA_ID: 'XXXXXX', // Замените на ваш ID Яндекс.Метрики
        GOOGLE_ANALYTICS_ID: 'GA_MEASUREMENT_ID', // Замените на ваш ID Google Analytics
        BANNER_MESSAGE: 'Мы используем файлы cookie (куки-файлы) для улучшения работы сайта, анализа трафика и персонализации контента. Продолжая использовать сайт, вы соглашаетесь с нашей',
        PRIVACY_POLICY_URL: 'privacy-policy.html',
        EXPIRY_DAYS: 365
    };

    // Флаг, чтобы не загружать аналитику дважды
    let analyticsLoaded = false;

    // Функция загрузки Яндекс.Метрики
    function loadYandexMetrika() {
        if (typeof ym !== 'undefined') return;
        
        (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            k=e.createElement(t),a=e.getElementsByTagName(t)[0];
            k.async=1;k.src=r;a.parentNode.insertBefore(k,a);
        })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        
        ym(CONFIG.YANDEX_METRIKA_ID, "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true
        });
        
        console.log('Яндекс.Метрика загружена');
    }

    // Функция загрузки Google Analytics
    function loadGoogleAnalytics() {
        if (typeof gtag !== 'undefined') return;
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        
        var script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GOOGLE_ANALYTICS_ID}`;
        document.head.appendChild(script);
        
        gtag('config', CONFIG.GOOGLE_ANALYTICS_ID);
        
        console.log('Google Analytics загружена');
    }

    // Функция загрузки всей аналитики
    function loadAnalytics() {
        if (analyticsLoaded) return;
        analyticsLoaded = true;
        
        loadYandexMetrika();
        loadGoogleAnalytics();
    }

    // Функция сохранения согласия
    function saveConsent(status) {
        localStorage.setItem(CONFIG.CONSENT_KEY, status);
        
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + CONFIG.EXPIRY_DAYS);
        document.cookie = `${CONFIG.CONSENT_KEY}=${status}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
    }

    // Функция получения сохраненного согласия
    function getStoredConsent() {
        return localStorage.getItem(CONFIG.CONSENT_KEY);
    }

    // Функция создания HTML баннера
    function createBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <p class="cookie-banner-message">
                    ${CONFIG.BANNER_MESSAGE}
                    <a href="${CONFIG.PRIVACY_POLICY_URL}" class="cookie-banner-link" target="_blank">политикой конфиденциальности</a>
                </p>
                <div class="cookie-banner-buttons">
                    <button id="cookie-accept" class="cookie-btn cookie-btn-accept">Принять</button>
                    <button id="cookie-reject" class="cookie-btn cookie-btn-reject">Отказаться</button>
                </div>
            </div>
        `;
        
        // Добавляем стили (ваши оригинальные + адаптив в конце)
        const styles = document.createElement('style');
        styles.textContent = `
            #cookie-consent-banner {
                position: fixed;
                bottom: 10px;
                left: auto;
                right: 10px;
                background: var(--light-color);
                color: var(--text-color);
                padding: 15px 20px;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
                animation: slideUp 0.3s ease-out;
            }
            
            .cookie-banner-content {
                max-width: 480px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 15px;
            }
            
            .cookie-banner-message {
                margin: 0;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .cookie-banner-link {
                color: var(--secondary-color);
                text-decoration: underline;
                margin-left: 5px;
            }
            
            .cookie-banner-link:hover {
                opacity: 0.9;
            }
            
            .cookie-banner-buttons {
                display: flex;
                gap: 10px;
                flex-shrink: 0;
            }
            
            .cookie-btn {
                padding: 8px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: opacity 0.2s;
            }
            
            .cookie-btn:hover {
                opacity: 0.9;
            }
            
            .cookie-btn-accept {
                background: var(--secondary-color);
                color: white;
            }

            .cookie-btn-reject {
                background: transparent;
                border: 1px solid rgba(0,0,0,0.2);
            }
            
            .cookie-btn-reject:hover {
                background: rgba(0,0,0,0.05);
                opacity: 1;
            }
            
            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                }
                to {
                    transform: translateY(0);
                }
            }
            
            /* ========== АДАПТИВНЫЕ СТИЛИ ========== */
            
            /* Планшеты (768px - 1024px) */
            @media (min-width: 768px) and (max-width: 1024px) {
                #cookie-consent-banner {
                    bottom: 15px;
                    right: 15px;
                    padding: 12px 18px;
                }
                
                .cookie-banner-content {
                    max-width: 420px;
                    gap: 12px;
                }
                
                .cookie-banner-message {
                    font-size: 13px;
                }
                
                .cookie-btn {
                    padding: 6px 16px;
                    font-size: 13px;
                }
            }
            
            /* Мобильные устройства (до 768px) */
            @media (max-width: 767px) {
                #cookie-consent-banner {
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 12px 16px;
                    border-radius: 0;
                    animation: slideUp 0.3s ease-out;
                }
                
                .cookie-banner-content {
                    max-width: 100%;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .cookie-banner-message {
                    font-size: 12px;
                    text-align: center;
                    width: 100%;
                }
                
                .cookie-banner-buttons {
                    width: 100%;
                    justify-content: center;
                }
                
                .cookie-btn {
                    padding: 10px 24px;
                    font-size: 14px;
                    flex: 0 1 auto;
                    min-width: 120px;
                }
            }
            
            /* Очень маленькие телефоны (до 480px) */
            @media (max-width: 480px) {
                #cookie-consent-banner {
                    padding: 10px 14px;
                }
                
                .cookie-banner-message {
                    font-size: 11px;
                }
                
                .cookie-btn {
                    padding: 8px 20px;
                    font-size: 13px;
                    min-width: 100px;
                }
            }
            
            /* Landscape ориентация на мобильных */
            @media (max-width: 767px) and (orientation: landscape) {
                #cookie-consent-banner {
                    padding: 8px 16px;
                }
                
                .cookie-banner-content {
                    flex-direction: row;
                    gap: 15px;
                }
                
                .cookie-banner-message {
                    text-align: left;
                    font-size: 11px;
                }
                
                .cookie-banner-buttons {
                    width: auto;
                }
                
                .cookie-btn {
                    padding: 6px 16px;
                    min-width: auto;
                }
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(banner);
        
        // Добавляем обработчики
        document.getElementById('cookie-accept').addEventListener('click', () => {
            saveConsent('accepted');
            removeBanner();
            loadAnalytics();
            window.dispatchEvent(new CustomEvent('cookieConsentAccepted'));
        });

        document.getElementById('cookie-reject').addEventListener('click', () => {
            saveConsent('rejected');
            removeBanner();
            window.dispatchEvent(new CustomEvent('cookieConsentRejected'));
            console.log('Пользователь отказался от cookies');
        });
    }
    
    function removeBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) banner.remove();
    }

    // Инициализация
    function init() {
        const consent = getStoredConsent();
        
        if (consent === 'accepted') {
            loadAnalytics();
        } else if (consent === 'rejected') {
            console.log('Пользователь отказался от cookies');
        } else {
            createBanner();
        }
    }
    
    // Ждем загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();