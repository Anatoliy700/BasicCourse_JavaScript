"use strict";
//import * as lockr from 'lockr.js';

/**
 * Объект реализующий логку работы корзины товаров.
 * @property {Object} settings Настройки корзины.
 * @property {{price: number, name: string}[]} goods Список товаров, выбранных пользователем.
 * @property {HTMLElement} countEl Место для вывода количества товаров.
 * @property {HTMLElement} priceEl Место для вывода стоимости всех товаров.
 */
const basket = {
  settings: {
    countSelector: '#basket__count',
    priceSelector: '#basket__price',
    localStorageName: 'basketGoods',
    classButtonBuy: '.buy-btn',
    classButtonClear: '.clear-btn',
  },
  goods: [],
  countEl: null,
  priceEl: null,

  /**
   * Инициализирует переменные корзины и выводит их пользователю.
   * @param {Object} settings Объект настроек для корзины.
   */
  init(settings = {}) {
    Object.assign(this.settings, settings);
    this.countEl = document.querySelector(this.settings.countSelector);
    this.priceEl = document.querySelector(this.settings.priceSelector);
    // Проверяем хранятся ли данные в localStorage и подгружаем если есть или отдаем пустой массив.
    const arr = Lockr.get(this.settings.localStorageName);
    this.goods = (arr) ? arr : [];
    // Вешаем обработчики событий.
    const arrBtn = document.querySelectorAll(this.settings.classButtonBuy);
    for (const btn of arrBtn) {
      btn.addEventListener('click', event => this.clickEventHandlerBtn(event));
    }
    document.querySelector(this.settings.classButtonClear).addEventListener('click', () => this.clearBasket());
    this.render();
  },

  /**
   * Считает и возвращает стоимость всех выбранных товаров из массива this.goods.
   * @returns {number} allPrice Стоимость всех выбранных товаров.
   */
  getGoodsPrice() {
    let allPrice = 0;
    for (const el of this.goods) {
      allPrice += el.price;
    }
    return allPrice;
  },

  /**
   * Выводит на страницу количество и стоимость всех выбранных товаров.
   */
  render() {
    // const qtGoods = this.goods.length;
    // const allPrice = this.getGoodsPrice();
    this.countEl.textContent = this.goods.length;
    this.priceEl.textContent = this.getGoodsPrice();
  },

  /**
   * Добавляет выбранный товар в массив this.goods и выводит новое количество и общюю стоимость на станице.
   * @param {string} goodName Название товара.
   * @param {string} goodPrice Стоимость товара.
   */
  add(goodName, goodPrice) {
    this.goods.push(
      {
        name: goodName,
        price: Number.parseInt(goodPrice),
      }
    );
    Lockr.set(this.settings.localStorageName, this.goods);
    this.render();
  },

  /**
   * Обрабатываем событие click по кнопке.
   * @param event
   */
  clickEventHandlerBtn(event) {
    const btn = event.target;
    this.add(btn.dataset.name, btn.dataset.price);
  },

  /**
   * Удаляет данные в localStorage.
   */
  clearBasket() {
    this.goods = [];
    Lockr.rm(this.settings.localStorageName);
    this.render();
  },
};

window.onload = () => basket.init();