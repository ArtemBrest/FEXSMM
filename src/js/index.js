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

window.addEventListener("load", function () {
    const body = document.querySelector("body");
    const headerBtnOpen = document.querySelector(".header__btn");
    const headerBtnClose = document.querySelector(".header-mob__btn");
    const headerMob = document.querySelector(".header-mob");

    if (headerBtnOpen !== null && headerBtnClose !== null && headerMob !== null) {
        headerBtnOpen.addEventListener("click", function (e) {
            e.preventDefault();
            headerMob.style.display = "flex";
            headerMob.classList.add("header-mob--active");
            body.classList.add("body--no-scroll");
        })
        headerBtnClose.addEventListener("click", function (e) {
            e.preventDefault();
            headerMob.style.display = "none";
            headerMob.classList.remove("header-mob--active");
            body.classList.remove("body--no-scroll");
        })
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
                    const row = radio.closest('.calc-guarantee-option')
                        .querySelector('.calc-guarantee-option__row');

                    valueBox.innerHTML = row.innerHTML;
                    select.classList.add('calc-select--is-filled');
                    select.classList.remove('calc-select--is-open');
                });
            });

            // если уже есть выбранный при загрузке
            const checked = select.querySelector('input[type="radio"]:checked');
            if (checked) {
                const row = checked
                    .closest('.calc-guarantee-option')
                    .querySelector('.calc-guarantee-option__row');

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

    const calcFeedCheckbox = document.querySelector('.calc-feed__input');
    const calcFeedWrapper = document.querySelector('.calc-feed__wrapper');

    if (calcFeedCheckbox  !== null && calcFeedWrapper  !== null){
        const toggleWrapper = () => {
            if (calcFeedCheckbox.checked) {
                fadeIn(calcFeedWrapper, 'flex');
            } else {
                fadeOut(calcFeedWrapper);
            }
        };
        toggleWrapper();
        calcFeedCheckbox.addEventListener('change', toggleWrapper);
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

    /*const anchorLinks = (id) => {
        const point = document.querySelector(id);
        if (!point) return;
        point.scrollIntoView({
            behavior: "smooth",
        });
    };

    document.querySelectorAll('a[href^="#"]').forEach((link) =>
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const id = e.currentTarget.getAttribute("href");
            anchorLinks(id);
        })
    );*/

    /*const modalOpenBtn = document.querySelectorAll(".modal-open-btn");
    const modalCloseBtn = document.querySelector(".modal__close");
    const modalFade = document.querySelector(".fade");
    const modal = document.querySelector(".modal");
    if (!isEmptyObject(modalOpenBtn)) {
        modalOpenBtn.forEach(function (el) {
            el.addEventListener("click", function (event) {
                event.preventDefault();
                fadeIn(modalFade);
                fadeIn(modal);
                body.classList.add("body--no-scroll");
            })
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
        fadeOut(modalFade);
        fadeOut(modal);
        body.classList.remove("body--no-scroll");
    });*/

    /*const regexSubject = /^[а-яА-Яa-zA-ZЁёЫы0-9 .,!?:'"+_&@#*()-]{2,100}$/iu;
    const regexPhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;*/

    /*const forms = document.querySelectorAll("form");
    if (!isEmptyObject(forms)) {
        document.querySelectorAll('input[name="phone"]').forEach(function (input) {
            IMask(input, {
                mask: '+{7} (000) 000-00-00'
            })
        })
        document.querySelectorAll('input[name="name"]').forEach(function (input) {
            IMask(input, {
                mask: /^[A-Za-zА-Яа-яЁё]*$/
            });
        });
        let inputName, inputPhone;
        forms.forEach(function (form) {
            form.addEventListener('keyup', () => {
                if (form.classList.contains("feedback-form")) {
                    inputName = form.querySelector('.feedback-form__input--name');
                    inputPhone = form.querySelector('.feedback-form__input--phone');
                } else {
                    inputName = form.querySelector('.modal-form__input--name');
                    inputPhone = form.querySelector('.modal-form__input--phone');
                }

                if (inputName !== null) {
                    if (regexSubject.test(inputName.value)) {
                        inputName.classList.remove("error");
                        inputName.classList.add("valid");
                    } else {
                        inputName.classList.remove("valid");
                        inputName.classList.add("error");
                    }
                }
                if (inputPhone !== null) {
                    if (regexPhone.test(inputPhone.value)) {
                        inputPhone.classList.remove("error");
                        inputPhone.classList.add("valid");
                    } else {
                        inputPhone.classList.remove("valid");
                        inputPhone.classList.add("error");
                    }
                }
            });
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                if (form.classList.contains("feedback-form")) {
                    inputName = form.querySelector('.feedback-form__input--name');
                    inputPhone = form.querySelector('.feedback-form__input--phone');
                } else {
                    inputName = form.querySelector('.modal-form__input--name');
                    inputPhone = form.querySelector('.modal-form__input--phone');
                }

                let validInput = true;
                if (inputName.value === "" || inputPhone.value === "") {
                    inputPhone.classList.add("error");
                    inputName.classList.add("error");
                    validInput = false;
                } else {
                    inputName.classList.remove("error");
                    inputPhone.classList.remove("error");
                }

                if (validInput === true) {
                    let data = new FormData(form);
                    data.append('action', 'form_submit');
                    const ajax = async () => {
                        const response = await fetch('/wp-admin/admin-ajax.php', {
                            method: 'POST',
                            body: data
                        });
                        if (!response.ok) {
                            throw new Error(response.status);
                        } else {
                            const data = await response.text();
                            switch (data) {
                                case '0':
                                    console.log("Извините, произошла ошибка. Пожалуйста, повторите отправку позже!")
                                    break;
                                case '1':
                                    fadeOut(modalFade);
                                    fadeOut(modal);
                                    body.classList.remove("body--no-scroll");
                            }
                        }
                    };
                    ajax()
                    inputName.classList.remove("valid");
                    inputPhone.classList.remove("valid");
                    form.reset();
                }
            });
        })
    }*/
})
