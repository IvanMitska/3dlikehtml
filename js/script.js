// 3DLike Website JavaScript
// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initCalculator();
        initFAQ();
    initScrollAnimations();
    initMobileMenu();
    initAboutAnimations();
    initFacilitySlider();
});

// Навигация
function initNavigation() {
    // Плавная прокрутка к разделам
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Подсветка активного раздела при прокрутке
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Удаляем активный класс у всех ссылок
                document.querySelectorAll('.nav-menu a').forEach(link => {
                    link.classList.remove('active');
                });

                // Добавляем активный класс соответствующей ссылке
                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });
}

// Калькулятор стоимости
function initCalculator() {
    const shapeButtons = document.querySelectorAll('.shape-btn');
    const sizeSelect = document.getElementById('sticker-size');
    const quantityInput = document.getElementById('quantity');
    const deliverySelect = document.getElementById('delivery-type');
    const priceTotal = document.querySelector('.price-total');
    const pricePerUnit = document.querySelector('.price-per-unit');

    // Цены базовые (за штуку)
    const basePrices = {
        20: 12,  // маленький
        30: 15,  // средний
        40: 18,  // большой
        50: 22   // очень большой
    };

    // Коэффициенты для форм
    const shapeMultipliers = {
        circle: 1.0,
        square: 1.1,
        rounded: 1.05,
        star: 1.3,
        custom: 1.5
    };

    // Скидки за объем
    const volumeDiscounts = {
        100: 1.0,
        200: 0.95,
        500: 0.9,
        1000: 0.85,
        2000: 0.8
    };

    let selectedShape = 'circle';

    // Обработка выбора формы
    shapeButtons.forEach(button => {
        button.addEventListener('click', function() {
            shapeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedShape = this.dataset.shape;
            calculatePrice();
        });
    });

    // Обработка изменения параметров
    if (sizeSelect) sizeSelect.addEventListener('change', calculatePrice);
    if (quantityInput) quantityInput.addEventListener('input', calculatePrice);
    if (deliverySelect) deliverySelect.addEventListener('change', calculatePrice);

    function calculatePrice() {
        if (!sizeSelect || !quantityInput) return;

        const size = parseInt(sizeSelect.value);
        const quantity = parseInt(quantityInput.value);
        const basePrice = basePrices[size];
        const shapeMultiplier = shapeMultipliers[selectedShape];
        
        // Находим подходящую скидку за объем
        let volumeDiscount = 1.0;
        const discountThresholds = Object.keys(volumeDiscounts).map(Number).sort((a, b) => b - a);
        
        for (let threshold of discountThresholds) {
            if (quantity >= threshold) {
                volumeDiscount = volumeDiscounts[threshold];
                break;
            }
        }

        const pricePerPiece = Math.round(basePrice * shapeMultiplier * volumeDiscount);
        const totalPrice = pricePerPiece * quantity;

        if (priceTotal) {
            priceTotal.textContent = `${totalPrice.toLocaleString()} ₽`;
        }
        
        if (pricePerUnit) {
            pricePerUnit.textContent = `${pricePerPiece} рублей за штуку.`;
        }
    }

    // Инициализация калькулятора
    calculatePrice();
}

// FAQ аккордеон
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Закрываем все остальные
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherToggle = otherItem.querySelector('.faq-toggle');
                    if (otherToggle) otherToggle.textContent = '+';
                }
            });
            
            // Переключаем текущий
            if (isActive) {
                item.classList.remove('active');
                if (toggle) toggle.textContent = '+';
            } else {
                item.classList.add('active');
                if (toggle) toggle.textContent = '−';
            }
        });
    });
}

// Анимации при прокрутке
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами для анимации (убрали .stat-item)
    const elementsToAnimate = document.querySelectorAll('.product-card, .case-card, .process-step, .portfolio-item');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Мобильное меню
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }
}

// Утилиты
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Обработка форм
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Здесь можно добавить отправку формы
            console.log('Форма отправлена');
        });
    });
}

// Добавляем базовые анимации через CSS
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
  document.head.appendChild(style);

// Анимации для About секции при скролле
function initAboutAnimations() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                if (target.classList.contains('stickers-image')) {
                    // Анимация изображения
                    setTimeout(() => {
                        target.classList.add('animate');
                    }, 200);
                } else if (target.classList.contains('problem-stats')) {
                    // Анимация статистики волной
                    const statBlocks = target.querySelectorAll('.stat-block');
                    statBlocks.forEach((block, index) => {
                        setTimeout(() => {
                            block.classList.add('animate');
                        }, 500 + (index * 200));
                    });
                }
            }
        });
    }, observerOptions);

    // Наблюдение за изображением
    const stickersImage = document.querySelector('.stickers-image');
    if (stickersImage) {
        observer.observe(stickersImage);
    }

    // Наблюдение за статистикой
    const problemStats = document.querySelector('.problem-stats');
    if (problemStats) {
        observer.observe(problemStats);
    }
}

function initFacilitySlider() {
    const row = document.querySelector('.facility-slider-row');
    const cards = document.querySelectorAll('.facility-card');
    const bar = document.querySelector('.facility-pagination-bar');
    const dotLeft = document.querySelector('.facility-pagination-dot.left');
    const dotRight = document.querySelector('.facility-pagination-dot.right');
    const wrapper = document.querySelector('.facility-slider-wrapper');
    let current = 0;
    const visible = 3;
    const total = cards.length;

    function updateSlider() {
        const offset = -(current * (cards[0].offsetWidth + 30));
        row.style.transform = `translateX(${offset}px)`;
        // Pagination: порядок классов
        if (bar) {
            if (current === 2) {
                bar.classList.add('right');
            } else {
                bar.classList.remove('right');
            }
        }
    }

    // Наведение на карточку "Маркетплейс решение" или правее
    if (wrapper && cards[2]) {
        wrapper.addEventListener('mousemove', (e) => {
            const rect = cards[2].getBoundingClientRect();
            if (e.clientX > rect.left) {
                current = 2;
                wrapper.classList.add('right-hover');
                updateSlider();
            } else {
                current = 0;
                wrapper.classList.remove('right-hover');
                updateSlider();
            }
        });
        wrapper.addEventListener('mouseleave', () => {
            current = 0;
            wrapper.classList.remove('right-hover');
            updateSlider();
        });
    }

    // Pagination по клику (опционально)
    [dotLeft, dotRight].forEach((dot, i) => {
        if (dot) {
            dot.addEventListener('click', () => {
                current = i * 2;
                updateSlider();
            });
        }
    });

    // Инициализация
    updateSlider();
}