import AbstractView from "./abstract";
import {isTaskExpired, isTaskRepeating, formatTaskDueDate} from "../utils/task";
import he from "he";

const createTaskTemplate = (task) => {
  const {color, dueDate, description, repeating, isFavorite, isArchive} = task;
  const date = formatTaskDueDate(dueDate);
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
          <p class="card__text">${he.encode(description)}</p>
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

export default class Task extends AbstractView {
  constructor(task) {
    super();
    this._task = task;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._archiveClickHandler = this._archiveClickHandler.bind(this);
  }

  _getTemplate() {
    return createTaskTemplate(this._task);
  }

  _editClickHandler(event) {
    event.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(event) {
    event.preventDefault();
    this._callback.favoriteClick();
  }

  _archiveClickHandler(event) {
    event.preventDefault();
    this._callback.archiveClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.element.querySelector(`.card__btn--edit`).addEventListener(`click`, this._editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.element.querySelector(`.card__btn--favorites`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setArchiveClickHandler(callback) {
    this._callback.archiveClick = callback;
    this.element.querySelector(`.card__btn--archive`).addEventListener(`click`, this._archiveClickHandler);
  }
}
