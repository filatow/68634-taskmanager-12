import AbstractView from "./abstract.js";

const createFilterTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${type === currentFilterType ? `checked` : ``}
      ${count === 0 ? `disabled` : ``}
      value="${type}"
      />
      <label for="filter__${name}" class="filter__label">
        ${name} <span class="filter__${name}-count">${count}</span></label
    >`
  );
};

const createFiltersTemplate = (filters, currentFilterType) => {
  const filtersTemplate = filters
    .map((filter) => createFilterTemplate(filter, currentFilterType))
    .join(``);

  return (
    `<section class="main__filter filter container">
      ${filtersTemplate}
    </section>`
  );
};

export default class Filters extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  _getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener(`change`, this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(event) {
    event.preventDefault();
    this._callback.filterTypeChange(event.target.value);
  }
}
