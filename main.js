import './style-reset.css';
import './style.css';

const app = document.querySelector('#app');

const Priorities = {
  High: 'high',
  Default: 'default',
  Low: 'low',
};

class Task {
  constructor(id, taskList) {
    this.title = 'Task name';
    this.description = 'Task description';
    this.priority = Priorities.Default;
    this.dueDate = '';
    this.id = id ?? '0';
    this.taskList = taskList ?? '0';
  }

  // This method is static because localStorage doesn't store methods
  static display(task, parent) {
    const taskHolder = document.createElement('div');
    taskHolder.classList.toggle('task-holder');

    const taskTitleHolder = document.createElement('div');
    taskTitleHolder.dataset.id = task.id;
    taskTitleHolder.dataset.taskList = task.taskList;
    taskTitleHolder.classList.toggle('task-title-holder');
    const taskTitle = document.createElement('textarea');
    taskTitle.rows = 1;
    taskTitle.classList.toggle('task-title');
    taskTitle.value = task.title;
    taskTitle.addEventListener('input', () => {
      task.title = taskTitle.value;
      Main.save();
    });
    taskTitleHolder.appendChild(taskTitle);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'R';
    removeButton.addEventListener('click', () => {
      Main.removeTask(task.taskList, removeButton.parentElement?.dataset.id);
    });
    taskTitleHolder.appendChild(removeButton);

    taskHolder.appendChild(taskTitleHolder);

    const taskDescription = document.createElement('textarea');
    taskDescription.classList.toggle('task-description');
    taskDescription.value = task.description;
    taskDescription.addEventListener('input', () => {
      task.description = taskDescription.value;
      Main.save();
    });
    taskHolder.appendChild(taskDescription);
    parent.appendChild(taskHolder);
  }
}

class TaskList {
  constructor(id) {
    this.title = 'New Task List';
    this.id = id ?? '0';
    this.tasks = [new Task(0, this.id)];
  }

  static addTask(taskList) {
    taskList.tasks.push(new Task(taskList.tasks.length - 1, taskList.id));
    Main.save();
    Main.display();
  }

  static display(taskList, parent) {
    const taskListHolder = document.createElement('div');
    taskListHolder.classList.toggle('task-list-holder');

    const taskListTitle = document.createElement('textarea');
    taskListTitle.rows = 1;
    taskListTitle.classList.toggle('task-list-title');
    taskListTitle.value = taskList.title;
    taskListTitle.addEventListener('input', () => {
      taskList.title = taskListTitle.value;
    });
    taskListHolder.appendChild(taskListTitle);

    taskList.tasks.forEach((task) => {
      Task.display(task, taskListHolder);
    });

    const taskListButtonsHolder = document.createElement('div');
    taskListButtonsHolder.classList.toggle('task-list-button-holder');
    taskListButtonsHolder.dataset.id = taskList.id;

    const addTaskButton = document.createElement('button');
    addTaskButton.textContent = 'Add Task';
    addTaskButton.addEventListener('click', () => {
      TaskList.addTask(taskList);
    });
    taskListButtonsHolder.appendChild(addTaskButton);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove List';
    removeButton.addEventListener('click', () => {
      Main.removeTaskList(removeButton.parentElement?.dataset.id);
    });
    taskListButtonsHolder.appendChild(removeButton);

    taskListHolder.appendChild(taskListButtonsHolder);

    parent?.appendChild(taskListHolder);
  }
}

const Header = (() => {
  const headerHolder = document.createElement('div');
  headerHolder.classList.toggle('header-holder');

  const appName = document.createElement('h1');
  appName.classList.toggle('header-app-name');
  appName.textContent = 'TODO App';
  headerHolder.appendChild(appName);

  const newTaskListBtn = document.createElement('button');
  newTaskListBtn.textContent = 'New Task List';
  headerHolder.appendChild(newTaskListBtn);

  const clearTaskListListBtn = document.createElement('button');
  clearTaskListListBtn.textContent = 'Clear Task List List';
  headerHolder.appendChild(clearTaskListListBtn);

  app?.appendChild(headerHolder);

  return {
    newTaskListBtn,
    clearTaskListListBtn,
  };
})();

const Main = (() => {
  let taskListList = [];
  if (localStorage.taskListList) {
    taskListList = JSON.parse(localStorage.taskListList);
  }

  Header.newTaskListBtn.addEventListener('click', createTaskList);
  Header.clearTaskListListBtn.addEventListener('click', clear);

  const mainHolder = document.createElement('div');
  mainHolder.classList.toggle('main-holder');

  display();

  app?.appendChild(mainHolder);

  function display() {
    while (mainHolder.hasChildNodes()) {
      // @ts-ignore
      mainHolder.removeChild(mainHolder.lastChild);
    }
    taskListList.forEach((taskList) => {
      TaskList.display(taskList, mainHolder);
    });
  }

  function createTaskList() {
    taskListList.push(new TaskList(taskListList.length));
    console.log(taskListList);
    save();
    display();
  }

  function removeTaskList(index) {
    taskListList.splice(index, 1);
    save();
    display();
  }

  function removeTask(taskList, index) {
    console.log(taskList);
    console.log(taskListList[taskList]);
    taskListList[taskList].tasks.splice(index, 1);
    save();
    display();
  }

  function save() {
    localStorage.taskListList = JSON.stringify(taskListList);
  }

  function clear() {
    taskListList = [];
    localStorage.clear();
    save();
    display();
  }

  return {
    taskListList,
    createTaskList,
    removeTaskList,
    removeTask,
    save,
    clear,
    display,
  };
})();
