import AbstractView from "./abstract";

const createLoadMoreButtonTemplate = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

export default class LoadMoreButton extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  _getTemplate() {
    return createLoadMoreButtonTemplate();
  }

  _clickHandler(event) {
    event.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.element.addEventListener(`click`, this._clickHandler);
  }
}
