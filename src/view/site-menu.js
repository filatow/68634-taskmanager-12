import AbstractView from "./abstract.js";
import {MenuItem} from "../consts";

const createSiteMenuTemplate = () => {
  return (
    `<section class="control__btn-wrap">
      <input
        type="radio"
        name="control"
        id="control__new-task"
        class="control__input visually-hidden"
        value="${MenuItem.ADD_NEW_TASK}"
      />
      <label for="control__new-task" class="control__label control__label--new-task"
        >+ ADD NEW TASK</label
      >
      <input
        type="radio"
        name="control"
        id="control__task"
        class="control__input visually-hidden"
        checked
        value="${MenuItem.TASKS}"
      />
      <label for="control__task" class="control__label">TASKS</label>
      <input
        type="radio"
        name="control"
        id="control__statistic"
        class="control__input visually-hidden"
        value="${MenuItem.STATISTICS}"
      />
      <label for="control__statistic" class="control__label"
        >STATISTICS</label
      >
    </section>`
  );
};


export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  _getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(event) {
    event.preventDefault();
    this._callback.menuClick(event.target.value);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.element.addEventListener(`change`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.element.querySelector(`[value=${menuItem}]`);

    if (item !== null) {
      item.checked = true;
    }
  }
}
