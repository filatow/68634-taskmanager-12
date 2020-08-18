import SiteMenuView from "./view/site-menu.js";
import FiltersView from "./view/filters.js";
import BoardView from "./view/board.js";
import TaskListView from "./view/task-list.js";
import SortingView from "./view/sorting.js";
import TaskView from "./view/task.js";
import TaskEditView from "./view/task-edit.js";
import LoadMoreButtonView from "./view/load-more-button.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filters.js";
import {render, RenderPosition} from "./utils.js";


const TASK_COUNT = 30;
const TASK_COUNT_PER_STER = 8;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);

  render(taskListElement, taskComponent.element, RenderPosition.BEFOREEND);
};

render(siteHeaderElement, new SiteMenuView().element, RenderPosition.BEFOREEND);
render(siteMainElement, new FiltersView(filters).element, RenderPosition.BEFOREEND);

const boardComponent = new BoardView();
render(siteMainElement, boardComponent.element, RenderPosition.BEFOREEND);

const taskListComponent = new TaskListView();
render(boardComponent.element, taskListComponent.element, RenderPosition.BEFOREEND);

render(boardComponent.element, new SortingView().element, RenderPosition.AFTERBEGIN);

for (let i = 0; i < Math.min(tasks.length, TASK_COUNT_PER_STER); i++) {
  renderTask(taskListComponent.element, tasks[i]);
}

if (tasks.length > TASK_COUNT_PER_STER) {
  let renderedTasksCount = TASK_COUNT_PER_STER;

  const loadMoreButtonComponent = new LoadMoreButtonView();
  render(boardComponent.element, loadMoreButtonComponent.element, RenderPosition.BEFOREEND);

  loadMoreButtonComponent.element.addEventListener(`click`, (event) => {
    event.preventDefault();
    tasks
      .slice(renderedTasksCount, renderedTasksCount + TASK_COUNT_PER_STER)
      .forEach((task) => renderTask(taskListComponent.element, task));

    renderedTasksCount += TASK_COUNT_PER_STER;
    if (renderedTasksCount > tasks.length) {
      loadMoreButtonComponent.element.remove();
      loadMoreButtonComponent.removeElement();

    }
  });
}
