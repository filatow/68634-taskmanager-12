import FilterView from "../view/filters.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import {FilterType, UpdateType} from "../consts.js";

export default class Filter {
  constructor(filterContainer, filterModel, taskModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._taskModel = taskModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._taskModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._getFilters();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const tasks = this._taskModel.getTasks();

    return [
      {
        type: FilterType.ALL,
        name: `all`,
        count: filter[FilterType.ALL](tasks).length
      },
      {
        type: FilterType.OVERDUE,
        name: `overdue`,
        count: filter[FilterType.OVERDUE](tasks).length
      },
      {
        type: FilterType.TODAY,
        name: `today`,
        count: filter[FilterType.TODAY](tasks).length
      },
      {
        type: FilterType.FAVORITES,
        name: `favorites`,
        count: filter[FilterType.FAVORITES](tasks).length
      },
      {
        type: FilterType.REPEATING,
        name: `repeating`,
        count: filter[FilterType.REPEATING](tasks).length
      },
      {
        type: FilterType.ARCHIVE,
        name: `archive`,
        count: filter[FilterType.ARCHIVE](tasks).length
      }
    ];
  }
}
