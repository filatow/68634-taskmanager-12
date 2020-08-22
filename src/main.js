import SiteMenuView from "./view/site-menu";
import FiltersView from "./view/filters";
import BoardView from "./view/board";
import TaskListView from "./view/task-list";
import SortingView from "./view/sorting";
import NoTasksView from "./view/no-tasks";
import TaskView from "./view/task";
import TaskEditView from "./view/task-edit";
import LoadMoreButtonView from "./view/load-more-button";
import {generateTask} from "./mock/task";
import {generateFilter} from "./mock/filters";
import {render, replace, remove, RenderPosition} from "./utils/render";


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
    replace(taskEditComponent, taskComponent);
  };
  const replaceFormToCard = () => {
    replace(taskComponent, taskEditComponent);

  };

  const onEscKeyDown = (event) => {
    if (event.key === `Escape` || event.key === `Esc`) {
      event.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.setEditClickHandler(() => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.setFormSubmitCallback(() => {
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, boardTasks) => {
  const boardComponent = new BoardView();
  render(boardContainer, boardComponent, RenderPosition.BEFOREEND);

  if (boardTasks.every((task) => task.isArchive)) {
    render(boardComponent, new NoTasksView(), RenderPosition.AFTERBEGIN);
    return;
  }

  render(boardComponent, new SortingView(), RenderPosition.AFTERBEGIN);

  const taskListComponent = new TaskListView();
  render(boardComponent, taskListComponent, RenderPosition.BEFOREEND);

  for (let i = 0; i < Math.min(boardTasks.length, TASK_COUNT_PER_STER); i++) {
    renderTask(taskListComponent.element, boardTasks[i]);
  }

  if (boardTasks.length > TASK_COUNT_PER_STER) {
    let renderedTasksCount = TASK_COUNT_PER_STER;

    const loadMoreButtonComponent = new LoadMoreButtonView();
    render(boardComponent, loadMoreButtonComponent, RenderPosition.BEFOREEND);

    loadMoreButtonComponent.setClickHandler(() => {
      boardTasks
        .slice(renderedTasksCount, renderedTasksCount + TASK_COUNT_PER_STER)
        .forEach((boardTask) => renderTask(taskListComponent.element, boardTask));

      renderedTasksCount += TASK_COUNT_PER_STER;

      if (renderedTasksCount > boardTasks.length) {
        remove(loadMoreButtonComponent);
      }
    });
  }
};

render(siteHeaderElement, new SiteMenuView().element, RenderPosition.BEFOREEND);
render(siteMainElement, new FiltersView(filters).element, RenderPosition.BEFOREEND);

renderBoard(siteMainElement, tasks);
