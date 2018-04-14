"use strict";

/**
 * @property {Object} settings Объект с настройками галереи.
 * @property {string} settings.previewSelector Селектор обертки для миниатюр галереи.
 * @property {string} settings.openedImageWrapperClass Класс для обертки открытой картинки.
 * @property {string} settings.openedImageClass Класс открытой картинки.
 * @property {string} settings.openedImageScreenClass Класс для ширмы открытой картинки.
 * @property {string} settings.openedImageCloseBtnClass Класс для картинки кнопки закрыть.
 * @property {string} settings.openedImageCloseBtnSrc Путь до картинки кнопки закрыть.
 * @property {string} settings.openedImageError Путь до картинки которая выводится в случае ошибки
 * загрузки изображения.
 */
const gallery = {
  //todo Добавлено новое свойство.
  settings: {
    previewSelector: '.mySuperGallery',
    openedImageWrapperClass: 'galleryWrapper',
    openedImageClass: 'galleryWrapper__image',
    openedImageScreenClass: 'galleryWrapper__screen',
    openedImageCloseBtnClass: 'galleryWrapper__close',
    openedImageCloseBtnSrc: 'images/gallery/close.png',
    openedImageError: 'images/gallery/error.jpg',
    openedDivNextImage: 'galleryWrapper__next',
    openedDivPrevImage: 'galleryWrapper__prev',
  },

  openedImageEl: null,

  /**
   * Инициализирует галерею, ставит обработчик события.
   * @param {Object} userSettings Объект настроек для галереи.
   */
  init(userSettings = {}) {
    // Записываем настройки, которые передал пользователь в наши настройки.
    Object.assign(this.settings, userSettings);

    // Находим элемент, где будут превью картинок и ставим обработчик на этот элемент,
    // при клике на этот элемент вызовем функцию containerClickHandler в нашем объекте
    // gallery и передадим туда событие MouseEvent, которое случилось.
    document
      .querySelector(this.settings.previewSelector)
      .addEventListener('click', event => this.containerClickHandler(event));
  },

  //todo Модернизированный метод.
  /**
   * Обработчик события клика для открытия картинки.
   * @param {MouseEvent} event Событие клики мышью.
   * @param {HTMLElement} event.target Целевой объект, куда был произведен клик.
   */
  containerClickHandler(event) {
    // Если целевой тег не был картинкой, то ничего не делаем, просто завершаем функцию.
    if (event.target.tagName !== 'IMG') {
      return;
    }

    // Открываем картинку, передаем в качестве параметра HTMLElement.
    this.openImage(event.target);
  },

  //todo Модернизированный метод.
  /**
   * Открывает картинку.
   * @param {HTMLElement} element Ссылка на картинку, которую надо открыть.
   */
  openImage(element) {

    this.openedImageEl = element;
    // Достаем ссылку на картинку из полученного HTMLElement,  из целевого тега (data-full_image_url аттрибут).
    const src = element.dataset.full_image_url;
    // Получаем контейнер для открытой картинки, в нем находим тег img и ставим ему нужный src.

    const image = this.getScreenContainer().querySelector(`.${this.settings.openedImageClass}`);

    const imgTest = new Image();
    // Ставим обработчик событий на случай если запрашиваемая картинка не доступна.
    imgTest.addEventListener('load', () => image.src = src);
    imgTest.addEventListener('error', () => image.src = this.settings.openedImageError);
    // image.onerror = event => console.log(event);
    imgTest.src = src;
  },

  /**
   * Возвращает контейнер для открытой картинки, либо создает такой контейнер, если его еще нет.
   * @returns {Element}
   */
  getScreenContainer() {
    // Получаем контейнер для открытой картинки.
    const galleryWrapperElement = document.querySelector(`.${this.settings.openedImageWrapperClass}`);
    // Если контейнер для открытой картинки существует - возвращаем его.
    if (galleryWrapperElement) {
      return galleryWrapperElement;
    }

    // Возвращаем полученный из метода createScreenContainer контейнер.
    return this.createScreenContainer();
  },

  /**
   * Создает контейнер для открытой картинки.
   * @returns {HTMLElement}
   */
  createScreenContainer() {
    // Создаем сам контейнер-обертку и ставим ему класс.
    const galleryWrapperElement = document.createElement('div');
    galleryWrapperElement.classList.add(this.settings.openedImageWrapperClass);

    // Создаем контейнер занавеса, ставим ему класс и добавляем в контейнер-обертку.
    const galleryScreenElement = document.createElement('div');
    galleryScreenElement.classList.add(this.settings.openedImageScreenClass);
    galleryWrapperElement.appendChild(galleryScreenElement);

    // Создаем картинку для кнопки закрыть, ставим класс, src и добавляем ее в контейнер-обертку.
    const closeImageElement = new Image();
    closeImageElement.classList.add(this.settings.openedImageCloseBtnClass);
    closeImageElement.src = this.settings.openedImageCloseBtnSrc;
    closeImageElement.addEventListener('click', () => this.close());
    galleryWrapperElement.appendChild(closeImageElement);

    // Создаем картинку, которую хотим открыть, ставим класс и добавляем ее в контейнер-обертку.
    const image = new Image();
    image.classList.add(this.settings.openedImageClass);
    galleryWrapperElement.appendChild(image);

    // Добавляем контейнер-обертку в тег body.
    document.body.appendChild(galleryWrapperElement);

    // Добавляем кнопли для переключения картинок.
    const btnNext = document.createElement('div');
    btnNext.classList.add(this.settings.openedDivNextImage);
    btnNext.textContent = '>';
    btnNext.addEventListener('click', () => this.nextImage());
    const btnPrev = document.createElement('div');
    btnPrev.classList.add(this.settings.openedDivPrevImage);
    btnPrev.textContent = '<';
    btnPrev.addEventListener('click', () => this.prevImage());
    galleryWrapperElement.appendChild(btnNext);
    galleryWrapperElement.appendChild(btnPrev);

    // Возвращаем добавленный в body элемент, наш контейнер-обертку.
    return galleryWrapperElement;
  },

  /**
   * Выводит следующий элемент (картинку) от открытой или первую картинку в контейнере,
   * если текущая открытая картинка последняя.
   */
  nextImage() {
    // Получаем элемент справа от текущей открытой картинки.
    const arrImg = this.openedImageEl.parentElement.children;
    for (let img in arrImg) {
      if (arrImg[img].src === this.openedImageEl.src) {
        const nextElem = (++img < arrImg.length) ? arrImg[img] : arrImg[0];
        this.openImage(nextElem);
        break;
      }
    }
    // Если элемент справа есть, его и возвращаем, если нет, то берем первый элемент в контейнере миниатюр.
  },

  /**
   * Выводит предыдущий элемент (картинку) от открытой или последнюю картинку в контейнере,
   * если текущая открытая картинка первая.
   */
  prevImage() {
    // Получаем элемент слева от текущей открытой картинки.
    const arrImg = this.openedImageEl.parentElement.children;
    for (let img in arrImg) {
      if (arrImg[img].src === this.openedImageEl.src) {
        const prevElem = (--img >= 0) ? arrImg[img] : arrImg[arrImg.length - 1];
        this.openImage(prevElem);
        break;
      }
    }
    // Если элемент слева есть, его и возвращаем, если нет, то берем последний элемент в контейнере миниатюр.
  },

  /**
   * Закрывает (удаляет) контейнер для открытой картинки.
   */
  close() {
    document.querySelector(`.${this.settings.openedImageWrapperClass}`).remove();
  }
};

// Инициализируем нашу галерею при загрузке страницы.
window.onload = () => gallery.init({previewSelector: '.galleryPreviewsContainer'});