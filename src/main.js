import SiteMenuView from "./view/site-menu";
import FiltersView from "./view/filters";
import {generateTask} from "./mock/task";
import {generateFilter} from "./mock/filters";
import {render, RenderPosition} from "./utils/render";
import BoardPresenter from "./presenter/board";
import TasksModel from "./model/tasks.js";

const TASK_COUNT = 20;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const taskModel = new TasksModel();
taskModel.setTasks(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(siteMainElement, taskModel);


render(siteHeaderElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(siteMainElement, new FiltersView(filters), RenderPosition.BEFOREEND);

boardPresenter.init(tasks);
