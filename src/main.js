import SiteMenuView from "./view/site-menu.js";
import {createFiltersTemplate} from "./view/filters.js";
import {createBoardTemplate} from "./view/board.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createTaskTemplate} from "./view/task.js";
import {createTaskEditTemplate} from "./view/task-edit.js";
import LoadMoreButton from "./view/load-more-button.js";
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
renderTemplate(siteMainElement, createFiltersTemplate(filters), `beforeend`);
renderTemplate(siteMainElement, createBoardTemplate(), `beforeend`);

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

renderTemplate(boardElement, createSortingTemplate(), `afterbegin`);

renderTemplate(taskListElement, createTaskEditTemplate(tasks[0]), `beforeend`);

for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STER); i++) {
  renderTemplate(taskListElement, createTaskTemplate(tasks[i]), `beforeend`);
}

if (tasks.length > TASK_COUNT_PER_STER) {
  let renderedTasksCount = TASK_COUNT_PER_STER;

  renderElement(boardElement, new LoadMoreButton().element, RenderPosition.BEFOREEND);

  const loadMoreButton = document.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (event) => {
    event.preventDefault();
    tasks
      .slice(renderedTasksCount, renderedTasksCount + TASK_COUNT_PER_STER)
      .forEach((task) => renderTemplate(taskListElement, createTaskTemplate(task), `beforeend`));

    renderedTasksCount += TASK_COUNT_PER_STER;
    if (renderedTasksCount > tasks.length) {
      loadMoreButton.remove();
    }
  });
}
