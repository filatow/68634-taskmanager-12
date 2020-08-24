import BoardView from "../view/board";
import SortingView from "../view/sorting";
import TaskListView from "../view/task-list";
import NoTasksView from "../view/no-tasks";
import TaskView from "../view/task";
import TaskEditView from "../view/task-edit";
import LoadMoreButtonView from "../view/load-more-button";
import {render, replace, remove, RenderPosition} from "../utils/render";

const TASK_COUNT_PER_STER = 8;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTasksCount = TASK_COUNT_PER_STER;

    this._boardComponent = new BoardView();
    this._sortingComponent = new SortingView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponent = new NoTasksView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
  }

  init(boardTasks) {
    this._boardTasks = boardTasks.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._taskListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _renderSorting() {
    render(this._boardComponent, this._sortingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTask(task) {
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

    render(this._taskListComponent, taskComponent, RenderPosition.BEFOREEND);
  }

  _renderTasks(from, to) {
    this._boardTasks
      .slice(from, to)
      .forEach((boardTask) => this._renderTask(boardTask));
  }

  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, TASK_COUNT_PER_STER));

    if (this._boardTasks.length > TASK_COUNT_PER_STER) {
      this._renderLoadMoreButton();
    }
  }

  _renderNoTasks() {
    render(this._boardComponent, this._noTaskComponent, RenderPosition.AFTERBEGIN);
  }

  _handleLoadMoreButtonClick() {
    this._renderTasks(this._renderedTasksCount, this._renderedTasksCount + TASK_COUNT_PER_STER);
    this._renderedTasksCount += TASK_COUNT_PER_STER;

    if (this._renderedTasksCount > this._boardTasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {

    render(this._boardComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderBoard() {
    if (this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSorting();
    this._renderTaskList();
  }

}
