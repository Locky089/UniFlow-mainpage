document.addEventListener("DOMContentLoaded", () => {
  
  // === АККОРДЕОН FAQ ===
  function initAccordeonFaq() {
    const headers = document.querySelectorAll('.faq-list__item-header--js');

    headers.forEach(header => {
        header.addEventListener('click', () => {
        const item = header.closest('.faq-list__item');
        if (item) {
            item.classList.toggle('active');
        }
        });
    });
  }

  // === Image Popup в отзывах ===
  Fancybox.bind('[data-fancybox-feed]', {
    // Your custom options for a specific gallery
  });

  
  // === Мобильное меню ===
  function initMobileMenu() {
    const isMobileOrTablet = window.matchMedia('(max-width: 1024px)').matches;
    if (!isMobileOrTablet) return;

    const overlay = document.querySelector('.mobile-menu-js');
    const menu = overlay?.querySelector('.mobile-menu');
    const openButton = document.querySelector('.button__open-mobile-menu-js');
    const closeButton = document.querySelector('.mobile-menu__close-js');
    const html = document.documentElement;

    if (!overlay || !menu || !openButton || !closeButton) return;

    const openMenu = () => {
      overlay.classList.add('is-open');
      html.classList.add('unscrollable');
    };

    const closeMenu = () => {
      overlay.classList.remove('is-open');
      html.classList.remove('unscrollable');
    };

    openButton.addEventListener('click', openMenu);
    closeButton.addEventListener('click', closeMenu);

    // закрытие по клику на overlay
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeMenu();
      }
    });
  }

  function initMobileMenu() {
    const isMobileOrTablet = window.matchMedia('(max-width: 1024px)').matches;
    if (!isMobileOrTablet) return;

    const overlay = document.querySelector('.mobile-menu-js');
    const menu = overlay?.querySelector('.mobile-menu');
    const openButton = document.querySelector('.button__open-mobile-menu-js');
    const closeButton = document.querySelector('.mobile-menu__close-js');
    const links = overlay?.querySelectorAll('.mobile-menu__link');
    const html = document.documentElement;

    const headerOffset = 80; // высота фиксированного header

    if (!overlay || !menu || !openButton || !closeButton) return;

    const openMenu = () => {
      overlay.classList.add('is-open');
      html.classList.add('unscrollable');
    };

    const closeMenu = () => {
      overlay.classList.remove('is-open');
      html.classList.remove('unscrollable');
    };

    openButton.addEventListener('click', openMenu);
    closeButton.addEventListener('click', closeMenu);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeMenu();
      }
    });

    // обработка ссылок меню
    links?.forEach((link) => {
      link.addEventListener('click', (event) => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;

        const target = document.querySelector(id);
        if (!target) return;

        event.preventDefault();

        closeMenu();

        setTimeout(() => {
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      });
    });
  }

  initMobileMenu()

  // === Слайдер в списке курсов ===
  const swiperCourses = new Swiper('.swiper-courses-fundamental-js', {

    loop: true,
    slidesPerView: 'auto',
    spaceBetween: 20,
    breakpoints: {
        640: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
      },

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
  });

  const swiperCourses2 = new Swiper('.swiper-courses-express-js', {
    loop: true,
    slidesPerView: 'auto',
    spaceBetween: 20,
    breakpoints: {
        640: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
      },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
  });


  // === Слайдер в отзывах ===
  const swiper = new Swiper('.swiper-feedback-js', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
      },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
  });


  // === Слайдер в разделе "Команда Uniflow" ===
  const swiperTeam = new Swiper('.swiper-team-js', {

    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        renderBullet: function (index, className) {
          return `
            <span class="${className}">
              <span class="autoplay-stroke">
                <svg class="background-circle" viewBox="0 0 48 48">
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#4598FB"/>
                      <stop offset="50%" stop-color="#826CE7"/>
                      <stop offset="100%" stop-color="#D15EAE"/>
                    </linearGradient>
                  </defs>
                  <circle cx="24" cy="24" r="20"></circle>
                </svg>
                <svg class="progress-circle" viewBox="0 0 48 48">
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#4598FB"/>
                      <stop offset="50%" stop-color="#826CE7"/>
                      <stop offset="100%" stop-color="#D15EAE"/>
                    </linearGradient>
                  </defs>
                  <circle cx="24" cy="24" r="20"></circle>
                </svg>
              </span>
              <img class="person-photo" src="img/team/team-${(index + 1)}.webp">
            </span>`;
        },
      },
  });


  // === ЗАПУСК ВСЕХ ФУНКЦИЙ ===
  initAccordeonFaq();
  initMobileMenu();



})