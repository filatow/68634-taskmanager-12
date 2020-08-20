import SiteMenuView from "./view/site-menu.js";
import FiltersView from "./view/filters.js";
import BoardView from "./view/board.js";
import TaskListView from "./view/task-list.js";
import SortingView from "./view/sorting.js";
import NoTasksView from "./view/no-tasks.js";
import TaskView from "./view/task.js";
import TaskEditView from "./view/task-edit.js";
import LoadMoreButtonView from "./view/load-more-button.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filters.js";
import {render, RenderPosition} from "./utils.js";


const TASK_COUNT = 20;
const TASK_COUNT_PER_STER = 8;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);

  const replaceCardToForm = () => {
    taskListElement.replaceChild(taskEditComponent.element, taskComponent.element);
  };
  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponent.element, taskEditComponent.element);
  };

  const onEscKeyDown = (event) => {
    if (event.key === `Escape` || event.key === `Esc`) {
      event.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.element.querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.element.querySelector(`form`).addEventListener(`submit`, (event) => {
    event.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent.element, RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, boardTasks) => {
  const boardComponent = new BoardView();
  render(boardContainer, boardComponent.element, RenderPosition.BEFOREEND);

  if (boardTasks.every((task) => task.isArchive)) {
    render(boardComponent.element, new NoTasksView().element, RenderPosition.AFTERBEGIN);
    return;
  }

  render(boardComponent.element, new SortingView().element, RenderPosition.AFTERBEGIN);

  const taskListComponent = new TaskListView();
  render(boardComponent.element, taskListComponent.element, RenderPosition.BEFOREEND);

  for (let i = 0; i < Math.min(boardTasks.length, TASK_COUNT_PER_STER); i++) {
    renderTask(taskListComponent.element, boardTasks[i]);
  }

  if (boardTasks.length > TASK_COUNT_PER_STER) {
    let renderedTasksCount = TASK_COUNT_PER_STER;

    const loadMoreButtonComponent = new LoadMoreButtonView();
    render(boardComponent.element, loadMoreButtonComponent.element, RenderPosition.BEFOREEND);

    loadMoreButtonComponent.element.addEventListener(`click`, (event) => {
      event.preventDefault();
      boardTasks
        .slice(renderedTasksCount, renderedTasksCount + TASK_COUNT_PER_STER)
        .forEach((boardTask) => renderTask(taskListComponent.element, boardTask));

      renderedTasksCount += TASK_COUNT_PER_STER;

      if (renderedTasksCount > boardTasks.length) {
        loadMoreButtonComponent.element.remove();
        loadMoreButtonComponent.removeElement();
      }
    });
  }
};

render(siteHeaderElement, new SiteMenuView().element, RenderPosition.BEFOREEND);
render(siteMainElement, new FiltersView(filters).element, RenderPosition.BEFOREEND);

renderBoard(siteMainElement, tasks);
