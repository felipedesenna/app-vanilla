window.document.addEventListener('readystatechange', function (e) {
  e.preventDefault();
  var { target: doc } = e;
  var formAddTask = $('#add-task');
  var allTasks = $('.all-tasks');
  var addButton = $('.app-button');
  var appCalc = $('.app-calc');
  var appInput = $('.app-input');
  var alert = $('.app-alert');
  var footerContent = $('.footer-content');
  var tasksDuration = [];
  var tasksDispatchButton = [];
  var isRunning = [];
  var today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);

  var _tasks = [];

  var intervalEvents = [];

  formAddTask.addEventListener('submit', InsertTask);
  appCalc.addEventListener('click', calcTotal);

  //events

  function InsertTask(evt) {
    evt.preventDefault();
    var name = this.newTask.value;
    var duration = '';
    var id = new Date().getTime();

    if (name.length && name.length >= 5) {
      var hasTask = _tasks.find((task) => task.name === name);
      var timer;
      clearInterval(timer);

      if (!hasTask) {
        clearField(this.newTask);
        addTask({ id, name, duration });
        renderTask();
        InitFields();
        return;
      }

      alert.classList.add('show');
      timer = setTimeout(function () {
        alert.classList.remove('show');
      }, 2000);
      return;
    }
  }

  function runStop(i) {
    return function (evt) {
      const { checked } = evt.target;
      var { id } = _tasks[i];
      var time = new Date(today);
      var taskTime = $(`#taskDur-${id}`);
      var prevTime = timeValue(taskTime.value);
      isRunning[i] = checked;
      blockButtons(isRunning);
      if (!checked) {
        clearInterval(intervalEvents[i]);
        return;
      }

      intervalEvents[i] = setInterval(() => {
        time.setSeconds(prevTime++);
        var timeFormat = time.toLocaleTimeString('pt-BR');
        _tasks[i].duration = timeFormat;
        taskTime.value = timeFormat;
      }, 1000);
    };
  }

  function calcTotal(evt) {
    var totalTime = [].map.call($$('.app-input-time'), function (
      currentValue,
      index,
      collection
    ) {
      return currentValue.value;
    });

    var sumTime = totalTime.reduce((acc, value) => {
      return formatTime(timeValue(acc) + timeValue(value));
    });

    $('.app-total').value = sumTime;
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
    if (!!val) {
      var seconds = timeValue(val);
      date.setSeconds(seconds);
    }

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
                <input class="app-input-time" type="text" value="${timeStampConvert(
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

  function timeValue(time) {
    var item = time.split(':');

    return item[0] * 3600 + item[1] * 60 + item[2] * 1;
  }

  function padHour(num) {
    if (num < 10) {
      return '0' + num;
    } else {
      return '' + num;
    }
  }

  function formatTime(seconds) {
    return [
      padHour(Math.floor(seconds / 3600)),
      padHour(Math.floor(seconds / 60) % 60),
      padHour(seconds % 60),
    ].join(':');
  }

  function InitFields() {
    if (tasksDispatchButton.length > 0) {
      for (i in tasksDispatchButton) {
        tasksDispatchButton[i].addEventListener('change', runStop(i));
      }
    }
  }

  function blockButtons(arr) {
    var timeRun = arr.find((i) => !!i);
    if (!!timeRun) {
      addButton.setAttribute('disabled', timeRun);
      appCalc.setAttribute('disabled', timeRun);
      return;
    }
    addButton.removeAttribute('disabled');
    appCalc.removeAttribute('disabled');
    return;
  }

  function clearField(field) {
    field.value = '';
    return;
  }
});
