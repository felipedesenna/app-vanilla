'use Strict';
window.document.addEventListener('readystatechange', function (e) {
  e.preventDefault();
  var { target: doc } = e;
  var formAddTask = $('#add-task');
  var allTasks = $('.all-tasks');
  var footerContent = $('.footer-content');
  var tasksDuration = [];
  var tasksDispatchButton = [];
  var today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);

  var _tasks = [];

  formAddTask.addEventListener('submit', InsertTask);

  //events

  function InsertTask(evt) {
    evt.preventDefault();
    var name = evt.target[0].value;
    var duration = today;
    var id = new Date().getTime();

    if (name.length && name.length >= 5) {
      addTask({ id, name, duration });
      renderTask();
      InitFields();
    }
  }

  function runStop(i) {
    return function (evt) {
      const { checked } = evt.target;
      console.log(i, checked);
    };
  }

  // utils

  function $(selector) {
    return doc.querySelector(selector);
  }

  function $$(selector) {
    return doc.querySelectorAll(selector);
  }

  function timeStampConvert(val) {
    var date = new Date(today);
    return date.toLocaleTimeString('pt-BR');
  }

  function addTask(newTask) {
    return _tasks.push(newTask);
  }

  function renderTask() {
    if (_tasks.length && _tasks.length > 0) {
      var render = _tasks
        .map(
          (item) => `<div class="task">
            <div class="task-details">
                <input class="app-input" type="text" value="${
                  item.name
                }" id="task-${item.id}" disabled/>
                <input class="app-input" type="text" value="${timeStampConvert(
                  item.duration
                )}" id="taskDur-${item.id}"  disabled/>
            </div>
            <div class="task-dispatch">
                <input type="checkbox" class="task-button-dispatch" name="task-button-dispatch" id="task-dispatch-button-${
                  item.id
                }">
                <label class="app-button" for="task-dispatch-button-${item.id}">
                    run / stop
                </label>
            </div>
        </div>`
        )
        .join('');
      allTasks.style.display = 'block';
      footerContent.classList.add('animate');
      allTasks.innerHTML = render;
      tasksDuration = $$('.app-input-duration');

      tasksDispatchButton = $$('.task-button-dispatch');
    }
  }

  function InitFields() {
    if (tasksDispatchButton.length > 0) {
      for (i in tasksDispatchButton) {
        tasksDispatchButton[i].addEventListener('change', runStop(i));
      }
    }
  }
});
