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

render(siteHeaderElement, new SiteMenuView().element, RenderPosition.BEFOREEND);
render(siteMainElement, new FiltersView(filters).element, RenderPosition.BEFOREEND);

const boardComponent = new BoardView();
render(siteMainElement, boardComponent.element, RenderPosition.BEFOREEND);

const taskListComponent = new TaskListView();
render(boardComponent.element, taskListComponent.element, RenderPosition.BEFOREEND);

render(boardComponent.element, new SortingView().element, RenderPosition.AFTERBEGIN);

render(taskListComponent.element, new TaskEditView(tasks[0]).element, RenderPosition.BEFOREEND);

for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STER); i++) {
  render(taskListComponent.element, new TaskView(tasks[i]).element, RenderPosition.BEFOREEND);
}

if (tasks.length > TASK_COUNT_PER_STER) {
  let renderedTasksCount = TASK_COUNT_PER_STER;

  const loadMoreButtonComponent = new LoadMoreButtonView();
  render(boardComponent.element, loadMoreButtonComponent.element, RenderPosition.BEFOREEND);

  loadMoreButtonComponent.element.addEventListener(`click`, (event) => {
    event.preventDefault();
    tasks
      .slice(renderedTasksCount, renderedTasksCount + TASK_COUNT_PER_STER)
      .forEach((task) => render(taskListComponent.element, new TaskView(task).element, RenderPosition.BEFOREEND));

    renderedTasksCount += TASK_COUNT_PER_STER;
    if (renderedTasksCount > tasks.length) {
      loadMoreButtonComponent.element.remove();
      loadMoreButtonComponent.removeElement();

    }
  });
}
