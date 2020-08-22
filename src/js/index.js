'use Strict';
window.document.addEventListener('readystatechange', function (e) {
  e.preventDefault();
  var { target: doc } = e;
  var formAddTask = $('#add-task');
  var allTasks = $('.all-tasks');
  var total = $('.app-calc');
  var footerContent = $('.footer-content');
  var tasksDuration = [];
  var tasksDispatchButton = [];
  var today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);

  var _tasks = [];

  var intervalEvents = [];

  formAddTask.addEventListener('submit', InsertTask);
  total.addEventListener('click', calcTotal);

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
      var { id, name, duration } = _tasks[i];

      if (!checked) {
        clearInterval(intervalEvents[i]);
        return;
      }

      intervalEvents[i] = setInterval(() => {
        var elem = document.getElementById(`taskDur-${id}`);
        var [hh, mm, ss] = elem.value.split(':');

        document.getElementById(`taskDur-${id}`).value = timer(
          Number(hh),
          Number(mm),
          Number(ss)
        );
      }, 100);
    };
  }

  var timer = (hh = 0, mm = 0, ss = 0) => {
    ss = ss + 1;

    if (ss === 59) {
      ss = 0;
      mm = mm + 1;

      if (mm === 59) {
        mm = 0;
        hh = hh + 1;
      }
    }

    let format =
      (hh < 10 ? '0' + hh : hh) +
      ':' +
      (mm < 10 ? '0' + mm : mm) +
      ':' +
      (ss < 10 ? '0' + ss : ss);

    return format;
  };

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
    var item = time.split(":");
    
    return (item[0] * 3600) +
           (item[1] * 60) +
           (+item[2]);
  }
  
  function padHour(num) {
    if(num < 10) {
      return "0" + num;
    } else {
      return "" + num;
    }
  }
  
  function formatTime(seconds) {
    return [padHour(Math.floor(seconds/3600)),
            padHour(Math.floor(seconds/60)%60),
            padHour(seconds%60),
            ].join(":");
  }

  function calcTotal(evt) {
    var totalTime = [].map.call(
      document.getElementsByClassName('app-input-time'),
      function (currentValue, index, collection) {
        return currentValue.value;
      }
    );

    var sumTime = totalTime.reduce((acc, value) => {
      return formatTime(timeValue(acc) + timeValue(value));
    });

    $('.app-total').value = sumTime;
  }

  function InitFields() {
    if (tasksDispatchButton.length > 0) {
      for (i in tasksDispatchButton) {
        tasksDispatchButton[i].addEventListener('change', runStop(i));
      }
    }
  }
});
