import {isTaskExpired, isTaskRepeating, humanizeTaskDueDate, createElement} from "../utils.js";

const createTaskTemplate = (task) => {
  const {color, dueDate, description, repeating, isFavorite, isArchive} = task;
  const date = dueDate !== null
    ? humanizeTaskDueDate(dueDate)
    : ``;
  const deadlineClassName = isTaskExpired(dueDate)
    ? `card--deadline`
    : ``;
  const repeatingClassName = isTaskRepeating(repeating)
    ? `card--repeat`
    : ``;
  const favoriteClassName = isFavorite
    ? `card__btn--favorites card__btn--disabled`
    : `card__btn--favorites`;
  const archiveClassName = isArchive
    ? `card__btn--archive card__btn--disabled`
    : `card__btn--archive`;


  return (
    `<article class="card card--${color} ${deadlineClassName} ${repeatingClassName}">
    <div class="card__form">
      <div class="card__inner">
        <div class="card__control">
          <button type="button" class="card__btn card__btn--edit">
            edit
          </button>
          <button type="button" class="card__btn ${archiveClassName}">
            archive
          </button>
          <button
            type="button"
            class="card__btn ${favoriteClassName}"
          >
            favorites
          </button>
        </div>

        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>

        <div class="card__textarea-wrap">
          <p class="card__text">${description}</p>
        </div>

        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <div class="card__date-deadline">
                <p class="card__input-deadline-wrap">
                  <span class="card__date">${date}</span>
                  <span class="card__time">16:15</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>`
  );
};

export default class Task {
  constructor(task) {
    this._task = task;
    this._element = null;
  }

  _getTemplate() {
    return createTaskTemplate(this._task);
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
