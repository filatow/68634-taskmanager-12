import {createElement} from "../utils.js";


const createFilterTemplate = (filter, isChecked) => {
  const {name, count} = filter;

  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? `checked` : ``}
      ${count === 0 ? `disabled` : ``}
      />
      <label for="filter__${name}" class="filter__label">
        ${name} <span class="filter__${name}-count">${count}</span></label
    >`
  );
};

const createFiltersTemplate = (filters) => {
  const filtersTemplate = filters
    .map((filter, index) => createFilterTemplate(filter, index === 0))
    .join(``);

  return (
    `<section class="main__filter filter container">
      ${filtersTemplate}
    </section>`
  );
};

export default class Filters {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  _getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
