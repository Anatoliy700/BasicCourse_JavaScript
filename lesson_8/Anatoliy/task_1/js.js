"use strict";

const snake = (function () {
  const settings = {
    rowsCount: 21,
    colsCount: 21,
    speed: 2,
    winLength: 50,

    //TODO task_1: Добавлено новое свойство(Определяет ID HTML элемента счетчика).
    idScoreCountEl: 'score-count',

// TODO task_3 Добавлено свойство(определяет количество стен).
    quantityWall: 5,

    /**
     * Проверка значений настроек игры.
     * @returns {boolean} true, если настройки верные, иначе false.
     */
    validate() {
      if (this.rowsCount < 10 || this.rowsCount > 30) {
        console.error('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].');
        return false;
      }

      if (this.colsCount < 10 || this.colsCount > 30) {
        console.error('Неверные настройки, значение colsCount должно быть в диапазоне [10, 30].');
        return false;
      }

      if (this.speed < 1 || this.speed > 10) {
        console.error('Неверные настройки, значение speed должно быть в диапазоне [1, 10].');
        return false;
      }

      if (this.winLength < 5 || this.winLength > 50) {
        console.error('Неверные настройки, значение winLength должно быть в диапазоне [5, 50].');
        return false;
      }

      return true;
    },
  };

//TODO task_3: Добавлен новый объект(Стены).
  /**
   * Объект работающий со всеми стенами в игре.
   * @property {{x: int, y: int}[]} points Массив объектов с координатами стен.
   */
  const walls = {
    points: [],

    /**
     * Инициализация стен в игре.
     * @param {{x: int, y: int}[]} wallsPoints Массив точек со стенами.
     */
    init(wallsPoints) {
      this.points = wallsPoints;
    },

    /**
     * Проверяет стоит ли на точке стена.
     * @param {{x: int, y: int}} point Точка, которую проверяем, стоит ли в ней стена.
     * @returns {boolean} true если точка содержит стену, иначе false.
     */
    isWallPoint(point) {
      return this.points.some(wallPoint => wallPoint.x === point.x && wallPoint.y === point.y);
    },

    /**
     * Меняет позицию случайной стены на переданную точку.
     * @param {{x: int, y: int}} point Точка, куда будет поставлена новая стенка.
     */
    changeRandomWallPosition(point) {
      // Удаляем случайный элемент с координатой стены и заменяем новым
      this.points.splice(Math.floor(Math.random() * this.points.length), 1, point);
    },
  };

  /**
   * Объект змейки.
   * @property {{x: int, y: int}[]} body Массив с точками тела змейки.
   * @property {string} lastStepDirection Направление, куда сходила змейка прошлый раз.
   * @property {string} direction Направление, куда пользователь направил змейку.
   * @property {{x: int, y: int}} nextPoint Объект с координатами следующей точки для перемещения.
   */
  const snake = {
    body: null,
    lastStepDirection: null,
    direction: null,
    /**
     * Инициализирует змейку, откуда она будет начинать и ее направление.
     * @param {{x: int, y: int}} startPoint Точка начальной позиции змейки.
     * @param {string} direction Начальное направление игрока.
     */
    init(startPoint, direction) {
      this.body = [startPoint];
      this.lastStepDirection = direction;
      this.direction = direction;
    },

    /**
     * Проверяет содержит ли змейка переданную точку.
     * @see {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/some|Array.prototype.some()}
     * @param {{x: int, y: int}} point Точка, которую проверяем.
     * @returns {boolean} true, если змейка содержит переданную точку, иначе false.
     */
    isBodyPoint(point) {
      return this.body.some(snakePoint => snakePoint.x === point.x && snakePoint.y === point.y);
    },

    // TODO task_2: Модернизированный метод(Теперь принимает количество строк и столбцов поля).
    /**
     * Двигает змейку на один шаг.
     * @param {int} colsCount Количество столбцов.
     * @param {int} rowsCount Количество строк.
     */
    makeStep(colsCount, rowsCount) {
      // Записываем направление движения, которое сейчас произойдет как направление прошлого шага.
      this.lastStepDirection = this.direction;
      // Вставляем следующую точку в начало массива.

      // TODO task_2: Теперь при вызове метода передаем количество столбцов и строк.
      this.body.unshift(this.getNextStepHeadPoint(colsCount, rowsCount));
      // Удаляем последний лишний элемент.
      this.body.pop();
    },

    /**
     * Добавляет в конец тела змейки копию последнего элемента змейки.
     */
    incrementBody() {
      // Получаем индекс последней точки в массиве точек змейки (последний элемент this.body).
      const lastBodyIdx = this.body.length - 1;
      // Получаем последнюю точку змейки.
      const lastBodyPoint = this.body[lastBodyIdx];
      // Клонируем последнюю точку змейки (делаем копию).
      const lastBodyPointClone = Object.assign({}, lastBodyPoint);
      // Добавляем копию в наш массив this.body.
      this.body.push(lastBodyPointClone);
    },

    /**
     * Отдает точку, где будет голова змейки если она сделает шаг.
     * @returns {{x: int, y: int}} Следующая точка куда придет змейка сделав шаг.
     */
    getNextStepHeadPoint(colsCount, rowsCount) {
      // Получаем в отдельную переменную голову змейки.
      const firstPoint = this.body[0];
      // Суда положим преедполагаемую следующую точку.
      const nextHeadPoint = {
        x: null,
        y: null,
      };
      // Возвращаем точку, где окажется голова змейки в зависимости от направления.
      switch (this.direction) {
        case 'up':
          nextHeadPoint.x = firstPoint.x;
          nextHeadPoint.y = firstPoint.y - 1;
          break;
        case 'down':
          nextHeadPoint.x = firstPoint.x;
          nextHeadPoint.y = firstPoint.y + 1;
          break;
        case 'right':
          nextHeadPoint.x = firstPoint.x + 1;
          nextHeadPoint.y = firstPoint.y;
          break;
        case 'left':
          nextHeadPoint.x = firstPoint.x - 1;
          nextHeadPoint.y = firstPoint.y;
      }

      // Если пересекаем границу поля, то корректируем координаты следующей точки.
      if (nextHeadPoint.x >= colsCount ||
        nextHeadPoint.y >= rowsCount ||
        nextHeadPoint.x < 0 ||
        nextHeadPoint.y < 0) {
        let nextStep = {
          x: null,
          y: null,
        };
        if (nextHeadPoint.x < 0) {
          nextStep.x = colsCount - 1;
        } else if (nextHeadPoint.x >= colsCount) {
          nextStep.x = 0;
        } else {
          nextStep.x = nextHeadPoint.x;
        }
        if (nextHeadPoint.y < 0) {
          nextStep.y = rowsCount - 1;
        } else if (nextHeadPoint.y >= rowsCount) {
          nextStep.y = 0;
        } else {
          nextStep.y = nextHeadPoint.y;
        }
        return nextStep;
      } else {
        return nextHeadPoint;
      }


    },

    /**
     * Устанавливает направление змейки.
     * @param {string} direction Направление змейки.
     */
    setDirection(direction) {
      this.direction = direction;
    },
  };

  /**
   * Объект отображения.
   */
  const renderer = {
    cells: null,

    /**
     * Метод инициализирует и выводит карту для игры.
     * @param {int} rowsCount Количество строк в карте.
     * @param {int} colsCount Количество колонок в карте.
     */
    renderMap(rowsCount, colsCount) {
      // Контейнер, где будут наши ячейки, первоначально его очистим.
      const table = document.getElementById('game');
      table.innerHTML = "";

      // Объект-хранилище всех клеток пока пустой.
      this.cells = {};

      // Цикл запустится столько раз, сколько у нас количество строк.
      for (let row = 0; row < rowsCount; row++) {
        // Создаем строку, добавляем ей класс, после добавляем ее в таблицу.
        const tr = document.createElement('tr');
        tr.classList.add('row');
        table.appendChild(tr);

        // Цикл запустится столько раз, сколько у нас количество колонок.
        for (let col = 0; col < colsCount; col++) {
          // Создаем ячейку, добавляем ячейке класс cell.
          const td = document.createElement('td');
          td.classList.add('cell');

          // Записываем в объект всех ячеек новую ячейку.
          this.cells[`x${col.toString()}_y${row.toString()}`] = td;

          // Добавляем ячейку в строку.
          tr.appendChild(td);
        }
      }
    },

    /**
     * Отображает все объекты на карте.
     * @param {{x: int, y: int}[]} snakePointsArray Массив с точками змейки.
     * @param {{x: int, y: int}} foodPoint Точка еды.
     * @param {{x: int, y: int}[]} wallPoints Точки стен.
     * @see {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames|Object.getOwnPropertyNames()}
     * @see {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach|Array.prototype.forEach()}
     */
    render(snakePointsArray, foodPoint, wallPoints) {
      // Чистим карту от предыдущего рендера, всем ячейкам оставляем только класс cell.
      for (const key of Object.getOwnPropertyNames(this.cells)) {
        this.cells[key].className = 'cell';
      }

      // Отображаем змейку.
      snakePointsArray.forEach((point, idx) => {
        // Если первый элемент массива, значит это голова, иначе тело.
        this.cells[`x${point.x}_y${point.y}`].classList.add(idx === 0 ? 'snakeHead' : 'snakeBody');
      });

      // Отображаем еду.
      this.cells[`x${foodPoint.x}_y${foodPoint.y}`].classList.add('food');

      //TODO task_3: Добавлен вызов метода(Отображаем стены).
      // Отображаем стены
      wallPoints.forEach((point) => {
        this.cells[`x${point.x}_y${point.y}`].classList.add('wall');
      });


    },
  };

  /**
   * Объект еды.
   * @property {int} x Координата X еды.
   * @property {int} y Координата Y еды.
   */
  const food = {
    x: null,
    y: null,

    /**
     * Отдает координаты еды.
     * @returns {{x: int, y: int}} Координаты еды.
     */
    getFoodCoordinates() {
      return {
        x: this.x,
        y: this.y,
      }
    },

    /**
     * Устанавливает координаты для еды.
     * @param {{x: int, y: int}} point Новая точка с координатами еды.
     */
    setFoodCoordinates(point) {
      this.x = point.x;
      this.y = point.y;
    },

    /**
     * Определяет соответствует ли точка на которой находится еда той точке что была передана.
     * @param {{x: int, y: int}} point Точка, для проверки соответствия точке еды.
     * @returns {boolean} true, если точки совпали, иначе false.
     */
    isFoodPoint(point) {
      return this.x === point.x && this.y === point.y;
    },
  };

  /**
   * Статус игры.
   * @property {string} condition Статус игры.
   */
  const status = {
    condition: null,

    /**
     * Устанавливает статус в "playing".
     */
    setPlaying() {
      this.condition = 'playing';
    },

    /**
     * Устанавливает статус в "stopped".
     */
    setStopped() {
      this.condition = 'stopped';
    },

    /**
     * Устанавливает статус в "finished".
     */
    setFinished() {
      this.condition = 'finished';
    },

    /**
     * Проверяет является ли статус "playing".
     * @returns {boolean} true, если статус "playing", иначе false.
     */
    isPlaying() {
      return this.condition === 'playing';
    },

    /**
     * Проверяет является ли статус "stopped".
     * @returns {boolean} true, если статус "stopped", иначе false.
     */
    isStopped() {
      return this.condition === 'stopped';
    },
  };

  /**
   * Объект с настройками по умолчанию, которые можно будет поменять при инициализации игры.
   * @property {int} rowsCount Количество строк.
   * @property {int} colsCount Количество колонок.
   * @property {int} speed Скорость змейки.
   * @property {int} winLength Длина змейки для победы.
   */

//TODO task_1: Новый объект счетчика игры.
  /**
   * Объект счетчика игры пользователя.
   * @property {settings} settings Настройки игры.
   * @property {HTMLElement} scoreCountEl Элемент, в который выводим счет.
   * @property {int} count Число счетчика игры.
   */
  const score = {
    settings,
    scoreCountEl: null,
    count: 0,
    /**
     * Инициализируем счетчик.
     */
    init() {
      // Object.assign(this.settings, settings);
      this.scoreCountEl = document.getElementById(this.settings.idScoreCountEl);
      this.drop();
    },

    /**
     * Увеличиваем счетчик.
     */
    increment() {
      this.renderScore(++this.count);
    },

    /**
     * Сбрасываем счетчик.
     */
    drop() {
      // this.count = 0;
      this.renderScore(this.count = 0);
    },

    /**
     * Выводим счетчик на страницу.
     * @param {int} count Число счетчика.
     */
    renderScore(count) {
      this.scoreCountEl.textContent = count;
    },
  };


  /**
   * Объект игры.
   * @property {settings} settings Настройки игры.
   * @property {renderer} renderer Объект отображения.
   * @property {snake} snake Объект змейки.
   * @property {food} food Объект еды.
   * @property {status} status Статус игры.
   * @property {walls} walls Объект стен.
   * @property {score} score Объект счетчика игры пользователя.
   * @property {int} tickInterval Номер интервала игры.
   * @property {int} wallTimeout Номер таймаута стен.
   */
  const game = {
    settings,
    renderer,
    snake,
    food,
    status,

    //TODO task_3: Добавлено свойство ссылающееся на объект стен.
    walls,

    //TODO task_1: Добавлено свойство ссылающееся на объект счетчика.
    score,
    tickInterval: null,

    //TODO task_3: Добавлено свойство для хранения ID Timeout.
    wallTimeout: null,

    /**
     * Инициализация игры.
     * @param {object} [settings = {}] Настройки игры, которые можно изменить.
     */
    init(settings = {}) {
      // Записываем переданные настройки в те, которые будут использоваться.
      Object.assign(this.settings, settings);
      // Если настройки игры неверные - не проводим инициализацию.
      if (!this.settings.validate()) {
        return;
      }

      //TODO task_1: Добавлен вызов метода объекта счетчик(Инициализируем счетчик score).
      // Инициализируем счетчик score.
      this.score.init();
      // Инициализируем карту.
      this.renderer.renderMap(this.settings.rowsCount, this.settings.colsCount);
      // Устанавливаем обработчики событий.
      this.setEventHandlers();
      // Ставим игру в начальное положение.
      this.reset();

      /*
          this.getDisabledWallCells().forEach((p)=>{
            this.renderer.cells[`x${p.x}_y${p.y}`].style.backgroundColor = 'blue';
          });
      */

    },

    /**
     * Ставит игру в начальное положение.
     */
    reset() {
      // Ставим статус игры в "остановлена".
      this.stop();
      // Инициализируем змейку.
      this.snake.init(this.getStartSnakePoint(), 'up');
      // Ставим еду на карту в случайную пустую ячейку.
      this.food.setFoodCoordinates(this.getRandomCoordinates());

      //TODO task_3: Добавлен вызов метода(Инициализируем стены).
      // Инициализируем стены.
      this.walls.init(this.getRandomCoordinates(this.settings.quantityWall, this.getDisabledWallCells()));
      // Отображаем все что нужно для игры.
      this.render();
    },

    /**
     * Ставим статус игры в "играем".
     */
    play() {
      // Ставим статус в 'playing'.
      this.status.setPlaying();
      // Ставим интервал шагов змейки.
      this.tickInterval = setInterval(() => this.tickHandler(), 1000 / this.settings.speed);

      //TODO task_3: Ставим таймаут на запуск функции генерации случайной стены.
      // Ставим таймаут геренации случайной стены
      this.wallTimeout = window.setTimeout(
        () => this.changeWallPosition(), (Math.floor(Math.random() * (15 - 5) + 5) * 1000)
      );


      // Меняем название кнопки в меню на "Стоп" и делаем ее активной.
      this.changePlayButton('Стоп');
    },

    /**
     * Ставим статус игры в "стоп".
     */
    stop() {
      // Ставим статус в 'stopped'.
      this.status.setStopped();
      // Убираем интервал шагов змейки.
      clearInterval(this.tickInterval);

      // TODO task_3: Добавлен вызов метода(Убираем интервал генерации случайной стены).
      // Убираем интервал генерации случайной стены
      clearInterval(this.wallTimeout);

      // Меняем название кнопки в меню на "Старт" и делаем ее активной.
      this.changePlayButton('Старт');
    },

    /**
     * Ставим статус игры в "финиш".
     */
    finish() {
      // Ставим статус в 'finished'.
      this.status.setFinished();
      // Убираем интервал шагов змейки.
      clearInterval(this.tickInterval);

      //TODO task_3: Добавлен вызов метода(Убираем интервал генерации случайной стены).
      // Убираем интервал генерации случайной стены
      clearInterval(this.wallTimeout);

      // Меняем название кнопки в меню на "Игра закончена" и делаем ее неактивной.
      this.changePlayButton('Игра закончена', true);
    },

    /**
     * Обработчик события тика игры, когда змейка должна перемещаться.
     */
    tickHandler() {
      // Если следующий шаг невозможен, то ставим игру в статус завершенный.
      if (!this.canSnakeMakeStep()) {
        return this.finish();
      }

      //TODO task_2: Теперь при вызове метода передаем количество столбцов и строк.
      // Если следующий шаг будет на еду, то заходим в if.
      if (this.food.isFoodPoint(this.snake.getNextStepHeadPoint(this.settings.colsCount, this.settings.rowsCount))) {

        // Прибавляем к змейке ячейку.
        this.snake.incrementBody();
        //TODO task_1: Добавлен вызов метода объекта счетчик(Увеличиваем счетчик игры).
        // Увеличиваем счетчик игры.
        this.score.increment();
        // Ставим еду в свободную ячейку.
        this.food.setFoodCoordinates(this.getRandomCoordinates());
        // Если выиграли, завершаем игру.
        if (this.isGameWon()) {
          this.finish();
        }
      }

      // Перемещаем змейку.
      this.snake.makeStep(this.settings.colsCount, this.settings.rowsCount);
      // Отрисовываем что получилось после шага.
      this.render();
    },

    /**
     * Меняем кнопку с классом playButton.
     * @param {string} textContent Текст кнопки.
     * @param {boolean} [isDisabled = false] Необходимо ли заблокировать кнопку.
     */
    changePlayButton(textContent, isDisabled = false) {
      // Находим кнопку.
      const playButton = document.getElementById('playButton');
      // Меняем текст внутри кнопки на переданный.
      playButton.textContent = textContent;
      // Если необходимо запретить нажатие кнопку - ставим класс disabled, иначе убираем класс disabled.
      isDisabled ? playButton.classList.add('disabled') : playButton.classList.remove('disabled');
    },

    /**
     * Возвращает начальную позицию змейки в центре карты.
     * @returns {{x: int, y: int}} Точка начальной позиции змейки.
     */
    getStartSnakePoint() {
      return {
        x: Math.floor(this.settings.colsCount / 2),
        y: Math.floor(this.settings.rowsCount / 2)
      };
    },

    /**
     * Ставит обработчики события.
     */
    setEventHandlers() {
      // При клике на кнопку с классом playButton вызвать функцию this.playClickHandler.
      document.getElementById('playButton').addEventListener('click', () => this.playClickHandler());
      // При клике на кнопку с классом newGameButton вызвать функцию this.newGameClickHandler.
      document.getElementById('newGameButton').addEventListener('click', event => this.newGameClickHandler(event));
      // При нажатии кнопки, если статус игры "играем", то вызываем функцию смены направления у змейки.
      document.addEventListener('keydown', event => this.keyDownHandler(event));
    },

    //TODO task_3: Модернизирован вызов метода(Передаем и массив с коодинатами стен).
    /**
     * Отображает все для игры, карту, еду, змейку и стены.
     */
    render() {
      this.renderer.render(this.snake.body, this.food.getFoodCoordinates(), this.walls.points);
    },


    //TODO task_3: Модернизированный метод(Добавлен параметр опредеяющий возвращаемое кол-во точек и возможность добавить точки исключения).
    /**
     * Отдает случайную не занятую точку на карте или массив точек.
     * @param {int} count Количество точек, которое должен отдать метод.
     * @param {{x: int, y: int}[]} exclude Массив с дополнительными точками исключениями.
     * @return {{x: int, y: int}||{x: int, y: int}[]} Точку с координатами или массив точек.
     */
    getRandomCoordinates(count = 1, exclude = []) {
      // Занятые точки на карте и точки исключения если переданы.
      const excludePoints = [this.food.getFoodCoordinates(), ...this.snake.body, ...this.walls.points, ...exclude];
      // Массив для точек если нужно вернуть несколько.
      let arrPoints = [];
      // Цикл на количество запрашиваемых точек.
      for (let i = 0; i < count; i++) {
        // Пытаемся получить точку ничем не занятую на карте.
        while (true) {
          // Случайно сгенерированная точка.
          const rndPoint = {
            x: Math.floor(Math.random() * this.settings.colsCount),
            y: Math.floor(Math.random() * this.settings.rowsCount),
          };

          // Если точка ничем не занята, то передаем ее для обработки дальше.
          if (!excludePoints.some(exPoint => rndPoint.x === exPoint.x && rndPoint.y === exPoint.y)) {
            // Если запрашивали одну точку, то отдаем ее как объект.
            if (count === 1) {
              return rndPoint;
            }
            // Если точек должно быть несколько то складываем их в массив.
            arrPoints.push(rndPoint);
            // Добавляем найденную точку в исключения.
            excludePoints.push(rndPoint);
            break;
          }
        }
      }
      return arrPoints;
    },

    /**
     * Обработчик события нажатия на кнопку playButton.
     */
    playClickHandler() {
      // Если сейчас статус игры "играем", то игру останавливаем, если игра остановлена, то запускаем.
      if (this.status.isPlaying()) {
        this.stop();
      } else if (this.status.isStopped()) {
        this.play();
      }
    },

    /**
     * Обработчик события нажатия на кнопку "Новая игра".
     */
    newGameClickHandler() {
      // Ставим игру в начальное положение.
      this.reset();

      //TODO task_1: Добавлен вызов метода(Сбрасываем счетчик игры).
      // Сбрасываем счетчик игры.
      this.score.drop();
    },

    /**
     * Обработчик события нажатия кнопки клавиатуры.
     * @param {KeyboardEvent} event
     */
    keyDownHandler(event) {
      // Если статус игры не "играем", значит обрабатывать ничего не нужно.
      if (!this.status.isPlaying()) {
        return;
      }

      // Получаем направление змейки, больше мы не обрабатываем других нажатий.
      const direction = this.getDirectionByKeyCode(event.keyCode);

      // Змейка не может повернуть на 180 градусов, поэтому делаем проверку, можем ли мы назначить направление.
      if (this.canSetDirection(direction)) {
        this.snake.setDirection(direction);
      }
    },

    /**
     * Отдает направление змейки в зависимости от переданного кода нажатой клавиши.
     * @param {int} keyCode Код нажатой клавиши.
     * @returns {string} Направление змейки.
     */
    getDirectionByKeyCode(keyCode) {
      switch (keyCode) {
        case 38:
        case 87:
          return 'up';
        case 39:
        case 68:
          return 'right';
        case 40:
        case 83:
          return 'down';
        case 37:
        case 65:
          return 'left';
        default:
          return '';
      }
    },

    /**
     * Определяет можно ли назначить переданное направление змейке.
     * @param {string} direction Направление, которое проверяем.
     * @returns {boolean} true, если направление можно назначить змейке, иначе false.
     */
    canSetDirection(direction) {
      return direction === 'up' && this.snake.lastStepDirection !== 'down' ||
        direction === 'right' && this.snake.lastStepDirection !== 'left' ||
        direction === 'down' && this.snake.lastStepDirection !== 'up' ||
        direction === 'left' && this.snake.lastStepDirection !== 'right';
    },

    /**
     * Проверяем произошла ли победа, судим по очкам игрока (длине змейки).
     * @returns {boolean} true, если игрок выиграл игру, иначе false.
     */
    isGameWon() {
      return this.snake.body.length > this.settings.winLength;
    },

    //TODO task_2: Подкоректированный метод(удалена проверка на границу поля и добавлена проверка на шаг в стену).
    /**
     * Проверяет возможен ли следующий шаг.
     * @returns {boolean} true если следующий шаг змейки возможен, false если шаг не может быть совершен.
     */
    canSnakeMakeStep() {
      // Получаем следующую точку головы змейки в соответствии с текущим направлением.
      const nextHeadPoint = this.snake.getNextStepHeadPoint(this.settings.colsCount, this.settings.rowsCount);
      // Змейка может сделать шаг если следующая точка не на теле змейки и эта точка не стена.
      return !(this.snake.isBodyPoint(nextHeadPoint) || this.walls.isWallPoint(nextHeadPoint));
    },

    // TODO task_3: Добавлен новый метод(Находит точки где неможет располагаться стена).
    /**
     * Возвращает все точки клеток, где не может располагаться стена.
     * @returns {{x: int, y: int}[]} Массив точек, где стена располагаться не может.
     */
    getDisabledWallCells() {
      let disabledPoints = [];
      // Получаем точку головы змейки, от нее должно быть минимум 2 пустые клетки до новой точки стенки.
      const headSnakePoint = this.snake.body[0];

      // Собираем массив точек близ головы змейки, где не может находиться стена.
      for (let x = headSnakePoint.x - 2; x <= headSnakePoint.x + 2; x++) {
        for (let y = headSnakePoint.y - 2; y <= headSnakePoint.y + 2; y++) {
          if (x === headSnakePoint.x && y === headSnakePoint.y) continue;
          let point = {x: null, y: null};
          if (x < 0) {
            point.x = x + this.settings.colsCount;
          } else if (x >= this.settings.colsCount) {
            point.x = this.settings.colsCount - x;
          } else {
            point.x = x;
          }
          if (y < 0) {
            point.y = y + this.settings.rowsCount;
          } else if (y >= this.settings.rowsCount) {
            point.y = this.settings.rowsCount - y;
          } else {
            point.y = y;
          }
          disabledPoints.push(point);
        }
      }
      return disabledPoints;
    },

    //TODO task_3: Новый метод для перемещения стены.
    /**
     * Обработчик события таймаута для перемещения стены на карте.
     */
    changeWallPosition() {
      this.wallTimeout = window.setTimeout(
        () => this.changeWallPosition(), (Math.floor(Math.random() * 15 - 5) + 5) * 1000);

      this.walls.changeRandomWallPosition(this.getRandomCoordinates(1, this.getDisabledWallCells()));
    },
  };

  return {
    init(settings) {
      game.init(settings);
    }
  };
})();
// При загрузке страницы инициализируем игру.
window.onload = snake.init({speed: 5});