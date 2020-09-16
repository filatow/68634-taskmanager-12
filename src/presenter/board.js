import BoardView from "../view/board";
import SortingView from "../view/sorting";
import TaskListView from "../view/task-list";
import NoTasksView from "../view/no-tasks";
import LoadMoreButtonView from "../view/load-more-button";
import TaskPresenter from "./task";
import {render, remove, RenderPosition} from "../utils/render";
import {sortTaskUp, sortTaskDown} from "../utils/task";
import {SortType, UserAction, UpdateType} from "../consts";
// import Sorting from "../view/sorting";

const TASK_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer, taskModel) {
    this._boardContainer = boardContainer;
    this._taskModel = taskModel;
    this._renderedTasksCount = TASK_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._taskPresenter = {};

    this._sortingComponent = null;
    this._loadMoreButtonComponent = null;

    this._boardComponent = new BoardView();
    // this._sortingComponent = new SortingView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponent = new NoTasksView();
    // this._loadMoreButtonComponent = new LoadMoreButtonView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._taskModel.addObserver(this._handleModelEvent);
  }

  init() {

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._taskListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _getTasks() {
    switch (this._currentSortType) {
      case SortType.DATE_UP:
        return this._taskModel.getTasks().slice().sort(sortTaskUp);
      case SortType.DATE_DOWN:
        return this._taskModel.getTasks().slice().sort(sortTaskDown);
    }

    return this._taskModel.getTasks();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;

    // this._clearTaskList();
    // this._renderTaskList();
    this._clearBoard({resetRenderedTaskCount: true});
    this._renderBoard();
  }

  _renderSorting() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSortType);
    render(this._boardComponent, this._sortingComponent, RenderPosition.AFTERBEGIN);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleModeChange() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this._taskModel.updateTask(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this._taskModel.addTask(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this._taskModel.deleteTask(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._taskPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskListComponent, this._handleViewAction, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
  }

  _renderTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
  }

  // _renderTaskList() {
  //   const taskCount = this._getTasks().length;
  //   const tasks = this._getTasks().slice(0, Math.min(taskCount, TASK_COUNT_PER_STEP));

  //   this._renderTasks(tasks);

  //   if (taskCount > TASK_COUNT_PER_STEP) {
  //     this._renderLoadMoreButton();
  //   }
  // }

  _renderNoTasks() {
    render(this._boardComponent, this._noTaskComponent, RenderPosition.AFTERBEGIN);
  }

  _renderBoard() {
    const tasks = this._getTasks();
    const taskCount = tasks.length;

    if (taskCount === 0) {
      this._renderNoTasks();
      return;
    }

    this._renderSorting();

    this._renderTasks(tasks.slice(0, Math.min(taskCount, this._renderedTasksCount)));

    if (taskCount > this._renderedTasksCount) {
      this._renderLoadMoreButton();
    }
  }

  _renderLoadMoreButton() {
    if (this._loadMoreButtonComponent !== null) {
      this._loadMoreButtonComponent = null;
    }

    this._loadMoreButtonComponent = new LoadMoreButtonView();

    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
    render(this._boardComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  // _clearTaskList() {
  //   Object
  //     .values(this._taskPresenter)
  //     .forEach((presenter) => presenter.destroy());
  //   this._taskPresenter = {};
  //   this._renderedTasksCount = TASK_COUNT_PER_STEP;
  // }

  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    const taskCount = this._getTasks().length;

    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};

    remove(this._sortingComponent);
    remove(this._noTaskComponent);
    remove(this._loadMoreButtonComponent);

    if (resetRenderedTaskCount) {
      this._renderedTasksCount = TASK_COUNT_PER_STEP;
    } else {
      this._renderedTaskCount = Math.min(taskCount, this._renderedTaskCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }

  }

  _handleLoadMoreButtonClick() {
    const taskCount = this._getTasks().length;
    const newRenderedTasksCount = Math.min(taskCount, this._renderedTasksCount + TASK_COUNT_PER_STEP);
    const tasks = this._getTasks().slice(this._renderedTasksCount, newRenderedTasksCount);

    this._renderTasks(tasks);
    this._renderedTasksCount = newRenderedTasksCount;


    if (this._renderedTasksCount >= taskCount) {
      remove(this._loadMoreButtonComponent);
    }
  }

}
