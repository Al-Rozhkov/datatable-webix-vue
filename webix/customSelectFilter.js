/**
 * Кастомный текстовый фильтр
 */
window.webix.ui.datafilter.eggheadsTextFilter = window.webix.extend(
  {
    /**
     * Получить input элемент фильтра из родительского элемента
     *
     * @param node
     * @return {HTMLInputElement}
     */
    getInputNode(node) {
      const popup = $$(node.$webix);

      if (popup) {
        return popup.getBody().getNode().querySelector("input");
      }
    },

    /**
     * Получить значение фильтра
     *
     * @param {HTMLElement} node
     * @return {String}
     */
    getValue(node) {
      const inputNode = node.$webix ? this.getInputNode(node) : node;
      return inputNode ? inputNode.value : "";
    },

    /**
     * Установить значение фильтра
     *
     * @param node
     * @param value
     */
    setValue(node, value) {
      const inputNode = this.getInputNode(node);
      if (inputNode) {
        inputNode.value = value;
      }
    },

    /**
     * Обновляет фильтр
     *
     * @param master
     * @param node
     * @param config
     */
    refresh(master, node, config) {
      node.$webix = config.popup;

      const inputNode = this.getInputNode(node);
      if (inputNode) {
        config.compare = config.compare || this.compare;
        master.registerFilter(inputNode, config, this);

        // Привязываем запуск фильтрации к вводу любого значения в поле фильтра
        webix.event(inputNode, "keydown", () => {
          if (this._filterTimer) {
            window.clearTimeout(this._filterTimer);
          }
          this._filterTimer = window.setTimeout(() => {
            master.filterByAll();
            if (config.value) {
              this._markColumn(config.value, node);
            }
          }, window.webix.ui.datafilter.textWaitDelay);
        });
      }

      node.onclick = (e) => {
        const popup = $$(config.popup);
        if (
          e.target.classList.contains("webix_excel_filter") &&
          !popup.isVisible()
        ) {
          popup.show(this._getPosition(node, popup));
        }
      };
    },

    /**
     * Выводит фильтр
     *
     * @param master Родительский webix компонент
     * @param config Конфигурация колонки
     * @return {string}
     */
    render(master, config) {
      if (!config.popup) {
        const popup = webix.ui({
          view: "popup",
          css: "webix_popup_eggheads",
          height: 100,
          body: {
            content: this.createTemplate(config),
            type: "clean",
            // autoheight: true,
            height: 100,
          },
        });

        master.attachEvent("onScrollX", () => popup.hide());
        config.popup = popup._settings.id;

        master._destroy_with_me.push(popup);
      }

      config.css = (config.css || "") + " webix_ss_excel_filter";
      return (
        '<span class="webix_excel_filter webix_icon wxi-filter"></span>' +
          config.text || ""
      );
    },

    /**
     * Возвращает HTML элемент, размещаемый внутри всплывающего элемента
     *
     * @return {HTMLElement}
     */
    createTemplate(config) {
      const root = document.createElement("div");
      root.classList.add("webix_popup_body");

      const elWrapper = document.createElement("div");
      elWrapper.classList.add("filter-input-group");

      const elInput = document.createElement("input");
      elInput.classList.add("filter-input");
      elInput.setAttribute("type", "text");
      elInput.setAttribute("placeholder", config.placeholder || "Поиск");

      const elSubmit = document.createElement("span");
      elSubmit.classList.add("e-icon", "e-icon-search", "filter-input-submit");

      elWrapper.append(elInput, elSubmit);
      root.append(elWrapper);

      return root;
    },

    /**
     * Получить позицию всплывающего элемента, относительно родителя
     *
     * @param node Родительский элемент
     * @param popup Всплывающий элемент
     * @return {{x: number, y: number}} Объект с координатами
     * @private
     */
    _getPosition(node, popup) {
      const box = node.getBoundingClientRect();
      const body = document.body;
      const docElem = document.documentElement;
      const scrollTop = docElem.scrollTop || body.scrollTop;
      const scrollLeft = docElem.scrollLeft || body.scrollLeft;
      const clientTop = docElem.clientTop || body.clientTop || 0;
      const clientLeft = docElem.clientLeft || body.clientLeft || 0;
      const top = box.top + scrollTop - clientTop;
      const left = box.left + scrollLeft - clientLeft;

      return {
        x: Math.round(left) + node.offsetWidth - popup.$width,
        y: Math.round(top) + node.offsetHeight,
      };
    },

    _markColumn(value, node) {
      if (value) {
        if (!node.classList.contains("webix_ss_filter_active")) {
          node.classList.add("webix_ss_filter_active");
        }
      } else {
        if (node.classList.contains("webix_ss_filter_active")) {
          node.classList.remove("webix_ss_filter_active");
        }
      }
    },
  },
  window.webix.ui.datafilter.textFilter
);

/**
 * Кастомный фильтр диапазона чисел
 */
window.webix.ui.datafilter.eggheadsNumberFilter = window.webix.extend(
  {
    /**
     * Получить значение фильтра
     *
     * @param {HTMLElement} node
     * @return {String[]}
     */
    getValue(node) {
      const popup = $$(node.$webix);

      if (popup) {
        const parentNode = popup.getBody().getNode();
        const minNode = parentNode.querySelector("[data-filter-value-min]");
        const maxNode = parentNode.querySelector("[data-filter-value-max]");

        return [minNode.value, maxNode.value];
      }

      return ["", ""];
    },

    /**
     * Функция сравнения. Если вернет true, сравниваемая запись попадет в выборку
     * В фильтре диапазона
     *
     * @param cellValue Значение сравниваемой записи
     * @param {String[]} filterValue Значение фильтра
     * @param master Родительский webix компонент
     * @return {Boolean}
     */
    compare(cellValue, filterValue, master) {
      const min = Number(filterValue[0]);
      const max = Number(filterValue[1]);

      return (
        (filterValue[0] === "" || min <= cellValue) &&
        (filterValue[1] === "" || cellValue <= max)
      );
    },

    /**
     * Обновляет фильтр
     *
     * @param master
     * @param node
     * @param config
     */
    refresh(master, node, config) {
      node.$webix = config.popup;

      const popup = $$(node.$webix);
      const submitButton = popup
        .getBody()
        .getNode()
        .querySelector(".js-filter-submit");

      if (submitButton) {
        config.compare = config.compare || this.compare;
        master.registerFilter(node, config, this);

        // Привязываем запуск фильтрации к клику
        webix.event(submitButton, "click", () => {
          master.filterByAll();
          if (config.value) {
            this._markColumn(config.value, node);
          }
        });
      }

      node.onclick = (e) => {
        const popup = $$(config.popup);
        if (
          e.target.classList.contains("webix_excel_filter") &&
          !popup.isVisible()
        ) {
          popup.show(this._getPosition(node, popup));
        }
      };
    },

    /**
     * Обновляет фильтр
     *
     * @param master
     * @param node
     * @param config
     */
    // refresh(master, node, config) {},

    /**
     * Возвращает HTML элемент, размещаемый внутри всплывающего элемента
     *
     * @return {HTMLElement}
     */
    createTemplate(config) {
      /*<div className="webix_popup_body">
        <div className="filter-range-group mb-3">
            <span className="text-nowrap">От — до</span>
            <input placeholder="${config.placeholder || 'От'}" className="form-control" type="text">
                <input placeholder="${config.placeholder || 'До'}" className="form-control" type="text">
        </div>
        <div className="d-flex justify-content-end">
            <button className="btn btn-link btn-sm">Очистить</button>
            <button className="btn btn-primary btn-sm">Применить</button>
        </div>
    </div>*/

      const root = document.createElement("div");
      root.classList.add("webix_popup_body");

      const elFirstRow = document.createElement("div");
      elFirstRow.classList.add("filter-range-group", "mb-3");

      const elSecondRow = document.createElement("div");
      elSecondRow.classList.add("d-flex", "justify-content-end");

      const elInputFrom = document.createElement("input");
      elInputFrom.classList.add("form-control");
      elInputFrom.setAttribute("type", "number");
      elInputFrom.setAttribute("data-filter-value-min", "");
      elInputFrom.setAttribute("placeholder", "От");

      const elInputTo = document.createElement("input");
      elInputTo.classList.add("form-control", "js-filter-value-max");
      elInputTo.setAttribute("type", "number");
      elInputTo.setAttribute("data-filter-value-max", "");
      elInputTo.setAttribute("placeholder", "До");

      const elText = document.createElement("span");
      elText.innerText = "От — до";
      elText.classList.add("text-nowrap");

      const elClear = document.createElement("button");
      elClear.innerText = "Очистить";
      elClear.classList.add("btn", "btn-link", "btn-sm");

      const elSubmit = document.createElement("button");
      elSubmit.innerText = "Применить";
      elSubmit.classList.add(
        "btn",
        "btn-primary",
        "btn-sm",
        "js-filter-submit"
      );

      elFirstRow.append(elText, elInputFrom, elInputTo);
      elSecondRow.append(elClear, elSubmit);
      root.append(elFirstRow, elSecondRow);

      return root;
    },
  },
  window.webix.ui.datafilter.eggheadsTextFilter
);

/**
 * Кастомный фильтр с выбором из списка
 */
const customSelectFilter = window.webix.extend(
  {
    /**
     * Возвращает элемент списка текущего фильтра
     *
     * @param node Родительский элемент фильтра
     * @return {webix|null}
     * @private
     */
    _getFilter(node) {
      const popup = $$(node.$webix);
      return popup ? popup.getBody().getChildViews()[1] : null;
    },

    /**
     * Получить значение фильтра
     *
     * @param {HTMLElement} node Родительский элемент фильтра
     * @return {String[]} Значение
     */
    getValue(node) {
      const list = this._getFilter(node);
      return list ? list.$value : "";
    },

    setValue(node, value) {
      const list = this._getFilter(node);
      const listOptions = list.serialize(true);

      if (!value) {
        const options = listOptions.map((row) => row.id);
        list.$value = new Set(options);
      } else {
        list.$value = new Set(value);
      }

      this._markColumn(list.$value.size !== listOptions.length, node);
    },

    _setListSelection(list, values) {
      list.blockEvent();
      list.unselectAll();
      for (const id of values) {
        if (list.exists(id)) {
          list.select(id, true);
        }
      }
      list.unblockEvent();
    },

    /**
     * Функция сравнения. Если вернет true, сравниваемая запись попадет в выборку
     *
     * @param cellValue Значение сравниваемой записи
     * @param {Set|String} filterValue Значение фильтра
     * @param master Родительский webix компонент
     * @return {Boolean}
     */
    compare(cellValue, filterValue) {
      return filterValue === "" ? true : filterValue.has(cellValue);
    },

    /**
     * Обновляет фильтр
     *
     * @param master Родительский webix компонент
     * @param node Родительский элемент фильтра
     * @param config
     */
    refresh(master, node, config) {
      node.$webix = config.popup;
      const popup = $$(node.$webix);
      const [header, list, footer] = popup.getBody().getChildViews();
      const headerNode = header.getNode();
      const searchInput = headerNode.querySelector("input");
      const selectAllLink = headerNode.querySelector(
        "[data-filter-select-all]"
      );
      const clearLink = headerNode.querySelector("[data-filter-clear]");
      const filterInfo = headerNode.querySelector("[data-filter-info]");
      const submitButton = footer.getNode().querySelector("button");
      const selectOptions = this._getData(master, config);

      if (selectOptions.length > 0 && popup) {
        config.compare = config.compare || this.compare;
        master.registerFilter(node, config, this);

        list.clearAll();
        list.parse(selectOptions);
        this.setValue(node, config.value);
        filterInfo.innerHTML = `${config.value ? config.value.size : 0} выбрано`;

        // Обновляем или привязываем операцию фильтрации вариантов в списке
        if (searchInput.$onSearchInputEvent) {
          webix.eventRemove(searchInput.$onSearchInputEvent);
        }
        searchInput.$onSearchInputEvent = webix.event(
          searchInput,
          "input",
          (event) => {
            list.filter((item) =>
              item.id
                .toString()
                .toLowerCase()
                .startsWith(event.target.value.toLowerCase())
            );

            // Восстановить выбор элементов, которые ранее попали под фильтрацию
            list.blockEvent();
            list.data.each(({ id }) => {
              const dirtyValue = list.$valueDirty.get(id);

              if (
                dirtyValue === true ||
                (dirtyValue === undefined && list.$value.has(id))
              ) {
                if (!list.isSelected(id)) {
                  list.select(id, true);
                }
              }
            });
            list.unblockEvent();
          }
        );

        // Обновляем или привязываем операцию "Выбрать все"
        if (selectAllLink.$onSelectAllClickEvent) {
          webix.eventRemove(selectAllLink.$onSelectAllClickEvent);
        }
        selectAllLink.$onSelectAllClickEvent = webix.event(
          selectAllLink,
          "click",
          () => {
            list.blockEvent();
            list.selectAll();
            list.unblockEvent();
            const selected = list.getSelectedId(true);

            for (const id of selected) {
              list.$valueDirty.set(id, true);
            }
          }
        );

        // Обновляем или привязываем операцию "Сбросить"
        if (clearLink.$onClearClickEvent) {
          webix.eventRemove(clearLink.$onClearClickEvent);
        }
        clearLink.$onClearClickEvent = webix.event(
          clearLink,
          "click",
          () => {
            const items = list.serialize(false);
            list.blockEvent();
            list.unselectAll();
            list.unblockEvent();

            for (const { id } of items) {
              list.$valueDirty.set(id, false);
            }
          }
        );

        // Используем события выбора или снятия выбора.
        if (list.$onBeforeSelectEvent) {
          list.detachEvent(list.$onBeforeSelectEvent);
          list.detachEvent(list.$onBeforeUnSelectEvent);
        }
        const onSelectHandler = (id, selection) => {
          if (!list.$valueDirty) {
            return false;
          }

          list.blockEvent();
          if (selection) {
            list.$valueDirty.set(id, true);
            list.select(id, true);
          } else {
            list.$valueDirty.set(id, false);
            list.unselect(id);
          }
          list.unblockEvent();

          return false;
        };
        list.$onBeforeSelectEvent = list.attachEvent(
          "onBeforeSelect",
          onSelectHandler
        );
        list.$onBeforeUnSelectEvent = list.attachEvent(
          "onBeforeUnSelect",
          onSelectHandler
        );

        // Обновляем или привязываем событие фильтрации
        if (submitButton.$onSubmitEvent) {
          webix.eventRemove(submitButton.$onSubmitEvent);
        }
        submitButton.$onSubmitEvent = webix.event(submitButton, "click", () => {
          const currentValue = list.$value;

          for (const [id, value] of list.$valueDirty) {
            if (value) {
              currentValue.add(id);
            } else {
              currentValue.delete(id);
            }
          }

          // Пересчитать количество выбранных элементов
          filterInfo.innerHTML = `${currentValue.size} выбрано`;
          
          master.filterByAll();
          const total = list.serialize(true).length;
          this._markColumn(currentValue.size !== total, node);
          popup.hide();
        });
      }

      // Событие раскрытия поповера
      node.onclick = (e) => {
        if (
          e.target.classList.contains("webix_excel_filter") &&
          !popup.isVisible()
        ) {
          // Выбрать на списке активные значения
          this._setListSelection(list, config.value);

          // Установить значение для хранения операций выбора
          list.$valueDirty = new Map();

          popup.show(this._getPosition(node, popup));
          searchInput.focus();
        }
      };

      popup.attachEvent('onHide', () => {
        searchInput.value = '';
        list.filter();
      });
    },

    /**
     * Выводит фильтр
     *
     * @param master Родительский webix компонент
     * @param config Конфигурация колонки
     * @return {string}
     */
    render(master, config) {
      if (!config.popup) {
        const dom = new DOMParser().parseFromString(
          `
            <div class="webix_popup_body border_bottom">
              <div class="filter-input-group">
                  <input type="text" class="filter-input" placeholder="Поиск">
                  <span class="e-icon e-icon-search filter-input-submit"></span>
              </div>
              <div class="d-flex justify-content-between mt-2">
                <span class="btn btn-link js-filter-control px-0" data-filter-select-all="">Выбрать все</span>
                <span class="btn btn-link js-filter-control px-0" data-filter-clear="">Сбросить</span>
                <span class="text-muted py-1" data-filter-info="">0 выбрано</span>
              </div>
            </div><div class="d-flex justify-content-end">
              <button class="btn btn-primary btn-sm" data-filter-submit="">Применить</button>
            </div>
          `,
          "text/html"
        );

        const header = {
          content: dom.body.childNodes[0],
          height: 85,
          type: "clean",
        };

        const list = {
          view: "list",
          type: "checklist",
          select: true,
          multiselect: "touch",
          height: 220,
          data: [],
          borderless: true,
          css: "filter-select",
        };

        const footer = {
          content: dom.body.childNodes[1],
          height: 50,
          type: "clean",
        };

        const popup = webix.ui({
          view: "popup",
          css: "webix_popup_eggheads",
          height: 350,
          body: {
            rows: [header, list, footer],
          },
        });

        master.attachEvent("onScrollX", () => popup.hide());
        config.popup = popup._settings.id;

        master._destroy_with_me.push(popup);
      }

      config.css = (config.css || "") + " webix_ss_excel_filter";
      return (
        '<span class="webix_excel_filter webix_icon wxi-filter"></span>' +
        (config.text || "")
      );
    },

    /**
     * Получает данные для списка
     *
     * @param master Родительский webix компонент
     * @param config Конфигурация колонки
     * @return {Object[]}
     * @private
     */
    _getData(master, config) {
      if (config.option) {
        return master._collectValues.call(config.options, "id", "value");
      }

      const values = new Set();
      master.data.each(
        (obj) => {
          let value = obj ? obj[config.columnId] : "";

          if (value === 0) {
            value = "0";
          }

          if (typeof value === "object") {
            value = String(value);
          }

          values.add(value);
        },
        master,
        true
      );

      if (!values.size) {
        return [];
      }

      return Array.from(values).sort((a, b) => a.localeCompare(b));
    },
  },
  window.webix.ui.datafilter.eggheadsTextFilter
);

export default customSelectFilter;
