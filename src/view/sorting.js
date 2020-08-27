import AbstractView from "./abstract.js";
import {SortType} from "../consts";

const createSortingTemplate = () => {
  return (
    `<div class="board__filter-list">
    <a href="#" class="board__filter" data-sort-type="${SortType.DEFAULT}">SORT BY DEFAULT</a>
    <a href="#" class="board__filter" data-sort-type="${SortType.DATE_UP}">SORT BY DATE up</a>
    <a href="#" class="board__filter" data-sort-type="${SortType.DATE_DOWN}">SORT BY DATE down</a>
  </div>`
  );
};

export default class Sorting extends AbstractView {
  _getTemplate() {
    return createSortingTemplate();
  }
}
