import SiteMenuView from "./view/site-menu.js";
import Filters from "./view/filters.js";
import BoardView from "./view/board.js";
import TaskListView from "./view/task-list.js";
import SortingView from "./view/sorting.js";
import {createTaskTemplate} from "./view/task.js";
import {createTaskEditTemplate} from "./view/task-edit.js";
import LoadMoreButtonView from "./view/load-more-button.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filters.js";
import {renderTemplate, renderElement, RenderPosition} from "./utils.js";


const TASK_COUNT = 30;
const TASK_COUNT_PER_STER = 8;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

renderElement(siteHeaderElement, new SiteMenuView().element, RenderPosition.BEFOREEND);
renderElement(siteMainElement, new Filters(filters).element, RenderPosition.BEFOREEND);

const boardComponent = new BoardView();
renderElement(siteMainElement, boardComponent.element, RenderPosition.BEFOREEND);

const taskListComponent = new TaskListView();
renderElement(boardComponent.element, taskListComponent.element, RenderPosition.BEFOREEND);

renderElement(boardComponent.element, new SortingView().element, RenderPosition.AFTERBEGIN);

renderTemplate(taskListComponent.element, createTaskEditTemplate(tasks[0]), `beforeend`);

for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STER); i++) {
  renderTemplate(taskListComponent.element, createTaskTemplate(tasks[i]), `beforeend`);
}

if (tasks.length > TASK_COUNT_PER_STER) {
  let renderedTasksCount = TASK_COUNT_PER_STER;

  const loadMoreButtonComponent = new LoadMoreButtonView();
  renderElement(boardComponent.element, loadMoreButtonComponent.element, RenderPosition.BEFOREEND);

  loadMoreButtonComponent.element.addEventListener(`click`, (event) => {
    event.preventDefault();
    tasks
      .slice(renderedTasksCount, renderedTasksCount + TASK_COUNT_PER_STER)
      .forEach((task) => renderTemplate(taskListComponent.element, createTaskTemplate(task), `beforeend`));

    renderedTasksCount += TASK_COUNT_PER_STER;
    if (renderedTasksCount > tasks.length) {
      loadMoreButtonComponent.element.remove();
      loadMoreButtonComponent.removeElement();

    }
  });
}
