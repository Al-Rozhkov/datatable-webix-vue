/**
 * Метод, который регистрирует внешний инпут как фильтр вебикса.
 * 
 * @param {HTMLElement|Object} object Объект, к которому привязываем фильтр
 * @param {Object} config Конфигурация фильтрам
 * @param {RegisterFilterController} controller Объект с методами нового фильтра
 */
/**
 * @typedef {RegisterFilterController}
 * @param {Function} getValue Получает данные из фильтра
 * @param {Function} setValue Устанавливает значение фильтра
 * @param {Boolean} $server Указывает, что фильтр серверный
 * @param {Function} compare Функция удовлетворения критериям фильтрации
 */
$$('webix-datatable').registerFilter(object, config, controller);

/**
 * Метод, который запускает фильтрацию по всем фильтрам, встроенным в заголовок колонок
 * и внешним инпутам, зарегистрированным через registerFilter()
 */
$$('webix-datatable').filterByAll();

/**
 * Загружает данные в таблицу, используя вебикс прокси объект.
 */
$$('webix-datatable').load({
  $proxy: true,
  load: (view, params) => {
    // Загружаем данные
    const data = webix.ajax()
      .get(url)
      .then((data) => data.json());

    // Заполняем конфигурацию колонок допустимыми вариантами выбора, пришедшими с сервера
    Object.keys(data.filters).forEach((key) => {
      view.getColumnConfig(key).options = data.filters[key].options
      view.refreshFilter(key);
    })

    return data.items
  }
})

/**
 * Метод загрузки следующей порции данных, когда используется пагинация
 * 
 * @param {Number} count Количество элементов в ответе
 * @param {Number} start Начиная с какого элемента
 * ...
 */
$$('webix-datatable').loadNext(сount, start);



/**
 * Структура запроса к бэкенду
 */
const clientRequest = '/url?'
  + '&' + 'filter[columnId]=filterTextValue'
  + '&' + 'filter[columnWithNumberFilter]=100,9999'
  + '&' + 'sort[columnId]=desc'
  + '&' + 'start=0'
  + '&' + 'count=100'

/**
 * Структура ответа бэкенда
 * 
 * @typedef {Object} ServerResponse
 * @prop {Object[]} items Массив данных
 * @prop {Object.<string, ServerResponseFilterConfig>} filters Конфигурация фильтров
 */
const serverResponse = {
  items: [
    { rowObject },
    { rowObject },
    { rowObject },
  ],
  filters: {
    /**
     * @typedef {Object} ServerResponseFilterConfig
     * @property {('select'|'text'|'number')} type Тип фильтра (выбор из списка, текстовый, диапазон чисел)
     * @property {String[] | Object[]} options Массив допустимых значений для выбора из списка
     * @property {Number} min Минимальное значение для числового фильтра
     * @property {Number} max Максимальное значение для числового фильтра
     */
    columnId: {
      type: 'select',
      options: ['Alpha', 'Beta', 'Gamma'],
      min: 0,
      max: 500
    }
  }
}

/**
 * Конфигурация таблицы с серверными фильтрами и серверной сортировкой
 */
const dataTable = {
  view: 'datatable',
  id: 'webix-datatable',
  columns: [
    // Серверная сортировка
    {
      id: "remains",
      header: ["Остаток", { content: "numberFilter" }],
      sort: "server"
    },

    // Кастомный фильтр с выбором из списка
    {
      id: "brand",
      header: ["Бренд", { content: "eggheadsSelectFilter" }],
    },

    // Кастомный фильтр с числовым значением
    {
      id: "brand",
      header: ["Бренд", { content: "eggheadsNumberFilter" }],
      min: 0,
      max: 9999
    },

    // Кастомный серверный фильтр
    {
      id: "seller",
      header: ["Поставщик", { content: "eggheadsServerSelectFilter" }],
    }
  ]
}
