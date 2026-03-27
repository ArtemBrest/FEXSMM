// ** FADE IN FUNCTION **
function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
        let val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};

function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= .1) < 0.1) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};

function isEmptyObject(obj) {
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

function parseTimer(value) {
    if (!value) return 0;

    // 1. Если это чисто число (timestamp или секунды)
    if (!isNaN(value)) {
        value = Number(value);

        // если похоже на timestamp (больше 10 цифр)
        if (value > 1e10) {
            return Math.max(0, Math.floor((value - Date.now()) / 1000));
        }

        // если секунды
        return value;
    }

    // 2. Если формат HH:MM:SS или MM:SS
    if (value.includes(":")) {
        const parts = value.split(":").map(Number);

        if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }

        if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        }
    }

    // 3. Если это дата (ISO или строка)
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
        return Math.max(0, Math.floor((date.getTime() - Date.now()) / 1000));
    }

    return 0;
}

function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");

    return `${h}:${m}:${s}`;
}

window.addEventListener("load", function () {
    const body = document.querySelector("body");
    const headerAccounts = document.querySelectorAll(".header-account");
    const headerNotifications = document.querySelectorAll(".header-notifications");
    const headerBtns = document.querySelectorAll(".header__btn");
    const headerBtnClose = document.querySelector(".header-mob__close");
    const headerMob = document.querySelector(".header-mob");
    const headerTitle = headerMob?.querySelector(".header-mob__title");

    function openMenu({ modifier, title }) {
        const isOpen = headerMob.classList.contains("header-mob--active");

        if (!isOpen) {
            headerMob.style.display = "flex";
            headerMob.classList.add("header-mob--active");
            body.classList.add("body--no-scroll");
        }

        headerMob.classList.forEach(cls => {
            if (cls.startsWith("header-mob--menu-")) {
                headerMob.classList.remove(cls);
            }
        });

        if (modifier) {
            headerMob.classList.add(modifier);
        }

        if (headerTitle && title) {
            headerTitle.textContent = title;
        }
    }

    if (window.innerWidth <= 1024 && headerMob && headerBtnClose) {
        headerBtns.forEach(btn => {
            btn.addEventListener("click", function (e) {
                e.preventDefault();

                openMenu({
                    modifier: btn.dataset.modifier || "header-mob--menu-default",
                    title: btn.dataset.title
                });
            });
        });

        headerNotifications.forEach(account => {
            account.addEventListener("click", function (e) {
                e.preventDefault();

                openMenu({
                    modifier: "header-mob--menu-notifications",
                    title: account.dataset.title
                });
            });
        });

        headerAccounts.forEach(account => {
            account.addEventListener("click", function (e) {
                e.preventDefault();

                openMenu({
                    modifier: "header-mob--menu-account",
                    title: account.dataset.title
                });
            });
        });

        headerBtnClose.addEventListener("click", function (e) {
            e.preventDefault();

            headerMob.style.display = "none";
            headerMob.classList.remove("header-mob--active");

            headerMob.classList.forEach(cls => {
                if (cls.startsWith("header-mob--menu-")) {
                    headerMob.classList.remove(cls);
                }
            });

            body.classList.remove("body--no-scroll");
        });
    }

    const modalOpenBtn = document.querySelectorAll(".modal-open-btn");
    const modalCloseBtn = document.querySelector(".modal__close");
    const modalFade = document.querySelector(".fade");
    const modal = document.querySelector(".modal");
    const modalTitle = modal.querySelector(".modal__title");
    const forms = modal.querySelectorAll(".modal__wrapper > div");

    const waitModal = document.querySelector("#timer-modal"); // модалка ожидания
    const waitTimerEl = document.querySelector("#timer-count"); // элемент таймера
    let waitInterval = null;

    if (!isEmptyObject(modalOpenBtn)) {
        modalOpenBtn.forEach(function (el) {
            el.addEventListener("click", function (event) {
                event.preventDefault();

                const data = el.dataset.form;
                if (!data) return;

                const [formId, title] = data.split(",");

                const timerValue = el.dataset.timer; // получаем таймер из кнопки
                if (timerValue) {
                    // если таймер указан — показываем модалку ожидания
                    fadeIn(waitModal);
                    fadeIn(modalFade);
                    body.classList.add("body--no-scroll");

                    let seconds = parseTimer(timerValue);
                    waitTimerEl.textContent = formatTime(seconds);

                    if (waitInterval) clearInterval(waitInterval);

                    waitInterval = setInterval(() => {
                        seconds--;
                        waitTimerEl.textContent = formatTime(seconds);

                        if (seconds <= 0) {
                            clearInterval(waitInterval);
                            fadeOut(waitModal);

                            // затем открываем основную модалку
                            const activeForm = modal.querySelector(formId);
                            if (!activeForm) return;

                            forms.forEach(form => {
                                if (form !== activeForm && form.style.display !== "none") {
                                    fadeOut(form);
                                }
                            });

                            fadeIn(activeForm);

                            if (title) {
                                modalTitle.textContent = title;
                            }
                            fadeIn(modalFade);
                            fadeIn(modal);
                        }
                    }, 1000);

                    return; // прерываем дальнейшее выполнение, основная модалка откроется через таймер
                }

                // текущая логика без таймера
                const activeForm = modal.querySelector(formId);
                if (!activeForm) return;

                forms.forEach(form => {
                    if (form !== activeForm && form.style.display !== "none") {
                        fadeOut(form);
                    }
                });

                fadeIn(activeForm);

                if (title) {
                    modalTitle.textContent = title;
                }

                fadeIn(modalFade);
                fadeIn(modal);
                body.classList.add("body--no-scroll");
            });
        });
    }
    modalCloseBtn.addEventListener("click", function (event) {
        event.preventDefault();
        fadeOut(modalFade);
        fadeOut(modal);
        body.classList.remove("body--no-scroll");
    });
    modalFade.addEventListener("click", function (event) {
        event.preventDefault();
        if (modal.style.display !== "none") {
            fadeOut(modalFade);
            fadeOut(modal);
            body.classList.remove("body--no-scroll");
        }
    });

    const scrollToTopBtn = document.querySelector(".button-up");
    if (scrollToTopBtn !== null) {
        document.addEventListener("scroll", handleScroll);

        function handleScroll() {
            let scrollableHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            let GOLDEN_RATIO = 0.2;

            if ((document.documentElement.scrollTop / scrollableHeight) > GOLDEN_RATIO) {
                scrollToTopBtn.style.opacity = "1";
            } else {
                scrollToTopBtn.style.opacity = "0";
            }
        }

        scrollToTopBtn.addEventListener("click", scrollToTop);
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    const bannerVideo = document.querySelector(".banner-video");
    if (bannerVideo !== null) {
        lightGallery(bannerVideo, {
            plugins: [lgVideo],
            selector: ".banner-video__play"
        });
    }

    const quantityFields = document.querySelectorAll('.calc-quantity__field');
    if(!isEmptyObject(quantityFields)) {
        quantityFields.forEach((field) => {
            const input = field.querySelector('.calc-quantity__input');
            const plusBtn = field.querySelector('.calc-quantity__btn--plus');
            const minusBtn = field.querySelector('.calc-quantity__btn--minus');

            if (!input || !plusBtn || !minusBtn) return;

            const step = Number(input.step) || 1;
            const min = Number(input.min) || 0;
            const max = Number(input.max) || 1000;

            const updateButtonState = () => {
                const value = Number(input.value) || 0;
                minusBtn.disabled = value <= min;
                plusBtn.disabled = value >= max;
            };

            plusBtn.addEventListener('click', () => {
                let value = Number(input.value) || 0;
                value = Math.min(max, value + step);
                input.value = value;
                input.dispatchEvent(new Event('change', {bubbles: true}));
                updateButtonState();
            });

            minusBtn.addEventListener('click', () => {
                let value = Number(input.value) || 0;
                value = Math.max(min, value - step);
                input.value = value;
                input.dispatchEvent(new Event('change', {bubbles: true}));
                updateButtonState();
            });

            // Обновление при ручном вводе
            input.addEventListener('input', () => {
                let value = Number(input.value) || 0;
                if (value > max) value = max;
                if (value < min) value = min;
                input.value = value;
                updateButtonState();
            });

            // Изначальное состояние кнопок
            updateButtonState();
        });
    }

    const calcSelect =  document.querySelectorAll('.calc-select[data-select]');
    if(!isEmptyObject(calcSelect)) {
        calcSelect.forEach(select => {
            const trigger = select.querySelector('[data-select-trigger]');
            const valueBox = select.querySelector('[data-select-value]');
            const radios = select.querySelectorAll('input[type="radio"]');

            trigger.addEventListener('click', () => {
                select.classList.toggle('calc-select--is-open');
            });

            radios.forEach(radio => {
                radio.addEventListener('change', () => {
                    const row = radio.parentNode.querySelector('[data-select-row]');

                    valueBox.innerHTML = row.innerHTML;
                    select.classList.add('calc-select--is-filled');
                    select.classList.remove('calc-select--is-open');
                });
            });

            // если уже есть выбранный при загрузке
            const checked = select.querySelector('input[type="radio"]:checked');
            if (checked) {
                const row = checked.parentNode.querySelector('[data-select-row]');

                valueBox.innerHTML = row.innerHTML;
                select.classList.add('calc-select--filled');
            }

            // закрытие при клике вне
            document.addEventListener('click', e => {
                if (!select.contains(e.target)) {
                    select.classList.remove('calc-select--is-open');
                }
            });
        });
    }

    const calcFeeds = document.querySelectorAll('.calc-feed');
    if(!isEmptyObject(calcFeeds)) {
        calcFeeds.forEach(feed => {
            const checkbox = feed.querySelector('.calc-feed__input');
            const wrapper = feed.querySelector('.calc-feed__wrapper');

            if (!checkbox || !wrapper) return;

            const toggleWrapper = () => {
                if (checkbox.checked) {
                    fadeIn(wrapper, 'flex');
                } else {
                    fadeOut(wrapper);
                }
            };

            toggleWrapper();
            checkbox.addEventListener('change', toggleWrapper);
        });
    }

    const container = document.querySelector('.seo__description');
    const button = document.querySelector('.seo__btn');
    const buttonText = button?.querySelector('.seo__btn-text');
    if (container !== null && button !== null && buttonText !== null) {
        const COLLAPSED_HEIGHT = 170;
        let isExpanded = false;

        // стартовое состояние
        container.classList.add('seo__description--collapsed');
        container.style.maxHeight = COLLAPSED_HEIGHT + 'px';
        button.classList.remove('seo__btn--expanded');

        button.addEventListener('click', () => {
            const isCollapsed = container.classList.contains('seo__description--collapsed');

            if (isCollapsed) {
                // раскрыть
                container.classList.remove('seo__description--collapsed');
                container.style.maxHeight = container.scrollHeight + 'px';

                button.classList.add('seo__btn--expanded');
                buttonText.textContent = 'Свернуть';
            } else {
                // свернуть
                container.classList.add('seo__description--collapsed');
                container.style.maxHeight = COLLAPSED_HEIGHT + 'px';

                button.classList.remove('seo__btn--expanded');
                buttonText.textContent = 'Читать далее';
            }
        });
    }

    const reviewsRows = document.querySelectorAll('.reviews__row');
    if(!isEmptyObject(reviewsRows)) {
        reviewsRows.forEach(row => {
            const track = row.querySelector('.reviews__track');

            // Дублируем контент
            track.innerHTML += track.innerHTML;

            const direction = row.dataset.direction === 'right' ? 1 : -1;
            const speed = row.dataset.direction === 'right' ? 40 : 30; // px/sec

            let pos = direction === 1 ? -track.scrollWidth / 2 : 0;
            const halfWidth = track.scrollWidth / 2;
            let lastTime = performance.now();

            function animate(time) {
                const delta = (time - lastTime) / 1000;
                lastTime = time;

                pos += direction * speed * delta;

                // 🔥 ВОТ ОНО — разный reset
                if (direction === -1 && pos <= -halfWidth) {
                    pos = 0;
                }

                if (direction === 1 && pos >= 0) {
                    pos = -halfWidth;
                }

                track.style.transform = `translateX(${pos}px)`;
                requestAnimationFrame(animate);
            }

            requestAnimationFrame(animate);
        });
    }

    const blogSwiper = document.querySelector(".blog__swiper");
    if(blogSwiper !== null) {
        new Swiper(blogSwiper, {
            slidesPerView: 'auto',
            spaceBetween: 12,
            navigation: {
                nextEl: ".blog__controls--next",
                prevEl: ".blog__controls--prev",
            },
            breakpoints: {
                1025: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
            },
        });
    }

    function initAcc(elem, single = false) {
        const items = elem.querySelectorAll('.faq-item');

        items.forEach(item => {
            const head = item.querySelector('.faq-item__head');
            const content = item.querySelector('.faq-item__content');

            if (!head || !content) return;

            head.addEventListener('click', () => {
                const isActive = item.classList.contains('faq-item--is-active');

                if (single) {
                    items.forEach(i => {
                        i.classList.remove('faq-item--is-active');
                        fadeOut(i.querySelector('.faq-item__content'));
                    });
                }

                if (!isActive) {
                    item.classList.add('faq-item--is-active');
                    fadeIn(content);
                } else {
                    item.classList.remove('faq-item--is-active');
                    fadeOut(content);
                }
            });
        });
    }

    const FAQ = document.querySelector(".faq");
    if (FAQ !== null) {
        initAcc(FAQ, false);
    }

    const faqBtnTabs = document.querySelectorAll(".faq__tab");
    const faqContentTabs = document.querySelectorAll(".faq__items");
    if (!isEmptyObject(faqContentTabs) && !isEmptyObject(faqBtnTabs)) {
        for (let el of faqBtnTabs) {
            el.addEventListener("click", e => {
                e.preventDefault();
                if (document.querySelector(".faq__tab.faq__tab--is-active")) {
                    document.querySelector(".faq__tab.faq__tab--is-active").classList.remove("faq__tab--is-active");
                }
                if (document.querySelector(".faq__items.faq__items--is-active")) {
                    document.querySelector(".faq__items.faq__items--is-active").classList.remove("faq__items--is-active");
                }
                el.classList.add("faq__tab--is-active");
                var index = [...el.parentElement.children].indexOf(el);
                var panel = [...faqContentTabs].filter(el => el.getAttribute("data-index") == index);
                panel[0].classList.add("faq__items--is-active");
            });
        }
    }

    const singleContent = document.getElementById('single-page-content');
    const introContainer = document.getElementById('single-page-intro-list');
    if (singleContent !== null || introContainer !== null) {
        const headings = singleContent.querySelectorAll('h2, h3');
        if (!headings.length) return;

        let headerIndex = 0;
        let currentParentLi = null;

        const rootOl = document.createElement('ol');
        rootOl.className = 'single-page-intro__list';

        headings.forEach((heading) => {
            headerIndex++;
            const id = `section-${headerIndex}`;
            heading.id = id;

            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = heading.textContent.trim();
            link.className = `single-page-intro__link single-page-intro__link--${heading.tagName.toLowerCase()}`;

            link.addEventListener('click', (e) => {
                e.preventDefault();

                const headerHeight =
                    document.querySelector('.main-header')?.offsetHeight || 0;

                const y =
                    heading.getBoundingClientRect().top +
                    window.pageYOffset -
                    headerHeight -
                    24;

                window.scrollTo({
                    top: y,
                    behavior: 'smooth',
                });
            });

            const li = document.createElement('li');
            li.className = 'single-page-intro__item';
            li.appendChild(link);

            if (heading.tagName === 'H2') {
                rootOl.appendChild(li);
                currentParentLi = li;
            }

            if (heading.tagName === 'H3' && currentParentLi) {
                let subUl = currentParentLi.querySelector('ul');

                if (!subUl) {
                    subUl = document.createElement('ul');
                    subUl.className = 'single-page-intro__sublist';
                    currentParentLi.appendChild(subUl);
                }

                subUl.appendChild(li);
            }
        });

        introContainer.appendChild(rootOl);
    }

    const depositBlocks = document.querySelectorAll('.account-deposit-amount');
    if (!isEmptyObject(depositBlocks)) {
        depositBlocks.forEach(block => {
            const input = block.querySelector('.account-deposit-amount__input');
            const buttons = block.querySelectorAll('.account-deposit-amount__btn');
            const ACTIVE_CLASS = 'account-deposit-amount__btn--is-active';

            if (!input || isEmptyObject(buttons)) return;

            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const value = btn.innerText.trim();
                    input.value = value;

                    buttons.forEach(b => b.classList.remove(ACTIVE_CLASS));
                    btn.classList.add(ACTIVE_CLASS);
                });
            });
            input.addEventListener('input', () => {
                input.value = input.value.replace(/\D/g, '');

                const currentValue = input.value;
                let hasMatch = false;
                buttons.forEach(btn => {
                    const btnValue = btn.innerText.trim();
                    if (btnValue === currentValue && currentValue !== '') {
                        btn.classList.add(ACTIVE_CLASS);
                        hasMatch = true;
                    } else {
                        btn.classList.remove(ACTIVE_CLASS);
                    }
                });
                if (!hasMatch) {
                    buttons.forEach(b => b.classList.remove(ACTIVE_CLASS));
                }
            });

            input.addEventListener('blur', () => {
                let value = parseInt(input.value, 10);
                if (!value || value < 1) {
                    input.value = 1;
                }

                const currentValue = input.value;
                buttons.forEach(btn => {
                    const btnValue = btn.innerText.trim();
                    if (btnValue === currentValue) {
                        btn.classList.add(ACTIVE_CLASS);
                    } else {
                        btn.classList.remove(ACTIVE_CLASS);
                    }
                });
            });
        });
    }

    const copyButtons = document.querySelectorAll('.btn-copy');
    if (!isEmptyObject(copyButtons)) {
        copyButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const input = btn.parentElement.querySelector('input');

                if (!input || input.disabled) return;

                const value = input.value.trim();
                if (!value) return;

                try {
                    await navigator.clipboard.writeText(value);
                    showTooltip(btn, 'Скопировано');
                } catch (err) {
                    console.error('Ошибка копирования:', err);
                }
            });
        });
    }

    // функция тултипа
    function showTooltip(el, text) {
        let tooltip = el.querySelector('.copy-tooltip');

        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'copy-tooltip';
            el.appendChild(tooltip);
        }

        tooltip.textContent = text;
        tooltip.classList.add('copy-tooltip--is-active');

        setTimeout(() => {
            tooltip.classList.remove('copy-tooltip--is-active');
        }, 1500);
    }

    const passwordToggles = document.querySelectorAll('.auth-form__visible');
    if (!isEmptyObject(passwordToggles)) {
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const input = toggle.parentElement.querySelector('input');

                if (!input || input.disabled) return;

                input.type = input.type === 'password' ? 'text' : 'password';
                toggle.classList.toggle('auth-form__visible-is-active');
            });
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;

    const registerNameInput = document.querySelector('#register-name');
    if(registerNameInput !== null) {
        registerNameInput.addEventListener('input', () => {
            if (registerNameInput.value.trim().length >= 2) {
                registerNameInput.classList.add('auth-form__input--is-valid');
            } else {
                registerNameInput.classList.remove('auth-form__input--is-valid');
            }
        });
    }

    const registerEmailInput = document.querySelector('#register-email');
    if(registerEmailInput !== null) {
        registerEmailInput.addEventListener('input', () => {
            if (emailRegex.test(registerEmailInput.value.trim())) {
                registerEmailInput.classList.add('auth-form__input--is-valid');
            } else {
                registerEmailInput.classList.remove('auth-form__input--is-valid');
            }
        });
    }

    const authLoginInput = document.querySelector('#auth-login');
    const validateLogin = (value) => {
        const v = value.trim();
        return emailRegex.test(v) || usernameRegex.test(v);
    };

    if(authLoginInput !== null) {
        authLoginInput.addEventListener('input', () => {
            if (validateLogin(authLoginInput.value)) {
                authLoginInput.classList.add('auth-form__input--is-valid');
            } else {
                authLoginInput.classList.remove('auth-form__input--is-valid');
            }
        });
    }

    const accountSelect = document.querySelectorAll('.account-select');
    if (!isEmptyObject(accountSelect)) {
        accountSelect.forEach(select => {
            const field = select.querySelector('.account-select__field');
            const value = select.querySelector('.account-select__value');
            const wrapper = select.querySelector('.account-select__wrapper');
            const items = select.querySelectorAll('.account-select__item');

            field.addEventListener('click', (e) => {
                e.stopPropagation();

                const isOpen = select.classList.contains('is-open');

                // закрыть все остальные
                document.querySelectorAll('.account-select').forEach(s => {
                    if (s !== select) {
                        s.classList.remove('account-select--is-open');
                        const w = s.querySelector('.account-select__wrapper');
                        fadeOut(w);
                    }
                });

                if (isOpen) {
                    select.classList.remove('account-select--is-open');
                    fadeOut(wrapper);
                } else {
                    select.classList.add('account-select--is-open');
                    fadeIn(wrapper);
                }
            });

            items.forEach(item => {
                item.addEventListener('click', () => {
                    value.textContent = item.textContent;

                    items.forEach(i => i.classList.remove('account-select__item--is-active'));
                    item.classList.add('account-select__item--is-active');

                    select.classList.remove('account-select--is-open');
                    fadeOut(wrapper);
                });
            });
        });

        // клик вне
        document.addEventListener('click', () => {
            accountSelect.forEach(select => {
                select.classList.remove('account-select--is-open');
                const wrapper = select.querySelector('.account-select__wrapper');
                fadeOut(wrapper);
            });
        });
    }

    const accountNotificationTabs = document.querySelectorAll(".account-notification__tab");
    const accountNotificationContentTabs = document.querySelectorAll(".account-notification__items");
    if (!isEmptyObject(accountNotificationContentTabs) && !isEmptyObject(accountNotificationTabs)) {
        for (let el of accountNotificationTabs) {
            el.addEventListener("click", e => {
                e.preventDefault();
                if (document.querySelector(".account-notification__tab.account-notification__tab--is-active")) {
                    document.querySelector(".account-notification__tab.account-notification__tab--is-active").classList.remove("account-notification__tab--is-active");
                }
                if (document.querySelector(".account-notification__items.account-notification__items--is-active")) {
                    document.querySelector(".account-notification__items.account-notification__items--is-active").classList.remove("account-notification__items--is-active");
                }
                el.classList.add("account-notification__tab--is-active");
                var index = [...el.parentElement.children].indexOf(el);
                var panel = [...accountNotificationContentTabs].filter(el => el.getAttribute("data-index") == index);
                panel[0].classList.add("account-notification__items--is-active");
            });
        }
    }


    const inputsDate = document.querySelectorAll('input[name="date"]');
    if (!isEmptyObject(inputsDate)) {
        inputsDate.forEach(input => {
            const datepicker = new Datepicker(input, {
                weekStart: 1,
                language: 'ru',
                format: 'dd.mm.yyyy',
                type: 'input',
            });
            datepicker.input
        });
    }
})
