import AbstractView from "./abstract.js";

const createSortingTemplate = () => {
  return (
    `<div class="board__filter-list">
    <a href="#" class="board__filter" data-sort-type="default">SORT BY DEFAULT</a>
    <a href="#" class="board__filter" data-sort-type="date-up">SORT BY DATE up</a>
    <a href="#" class="board__filter" data-sort-type="date-down">SORT BY DATE down</a>
  </div>`
  );
};

export default class Sorting extends AbstractView {
  _getTemplate() {
    return createSortingTemplate();
  }
}
