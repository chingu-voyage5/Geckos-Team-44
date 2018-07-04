class TaskFormView {
  constructor(taskDiv = null) {
    this.taskDiv = taskDiv;
    this.taskFormDiv = $("<div></div>", { class: "taskForm" });
    this.saveBtn = $("<button>Save</button>");
    this.cancelBtn = $("<button>Cancel</button>");
    this.errorsList = $("<div></div>", { id: "errorsList" }).css({ color: "red" });
    this.onCancel = function () { };
    this.onSave = function () { };
  }

  showErrors(errors) {
    let errorsList = this.errorsList;
    errorsList.empty();
    errors.forEach(function (error) {
      errorsList.append($("<div></div>").text(error))
    });
  }

  render(task = { mode: "work", title: "", timeBlocks: 1 }) {
    let form = $("<ul></ul>"),
      modeDiv = $("<li></li>"),
      titleDiv = $("<li></li>"),
      timeBlocksDiv = $("<li></li>"),
      modeSelect = $("<select id='modeSelect'></select>"),
      titleInput = $("<input type='text' id='titleInput'>"),
      timeBlocksInput = $("<input type='number' id='timeBlocksInput' min='1' max='4'>"),
      taskFormView = this;

    this.taskFormDiv.show();

    modeSelect.append(["<option value='work'>Work</option>",
      "<option value='play'>Play</option>"]);
    modeDiv.append(modeSelect.val(task.mode));
    titleDiv.append(titleInput.val(task.title));
    timeBlocksDiv.append(timeBlocksInput.val(task.timeBlocks));
    form.append([modeDiv, titleDiv, timeBlocksDiv]);
    this.taskFormDiv.addClass("taskList");
    this.taskFormDiv.append(form);
    this.taskFormDiv.append(this.saveBtn);
    this.taskFormDiv.append(this.cancelBtn);
    this.taskFormDiv.prepend(this.errorsList);

    this.saveBtn.click(function () {
      taskFormView.onSave();
    });

    titleInput.keydown(function (event) {
      if (event.which === 13)
        taskFormView.onSave();
    })

    this.cancelBtn.click(function () {
      taskFormView.onCancel();
    });

    return this.taskFormDiv;
  }

  resetForm() {
    this.taskFormDiv.hide();
    this.errorsList.empty();
    this.taskFormDiv.empty();
  }
};

function showTask(task) {
  let taskDiv = $("<ul></ul>", { id: task.id }),
    taskMode = $("<li></li>", { class: "taskIcon" }),
    taskIcon = $("<i></i>", { class: "fas" }),
    taskName = $("<li></li>", { class: "taskName" }),
    taskBlocks = $("<li></li>", { class: "taskBlocks" }),
    blocks = $("<div></div>", {class: "blocks"});
    
  if (task.mode === "work")
    taskIcon.addClass("fa-briefcase");
  else if (task.mode === "play")
    taskIcon.addClass("fa-paper-plane");
  
  for (var i=0; i < task.timeBlocks; i++){
    let block = $("<div></div>", {class: "block"});
    blocks.append([block]);
  }

  taskName.text(task.title);
  taskMode.append(taskIcon);
  taskBlocks.append(blocks);
  taskDiv.append([taskMode, taskName, taskBlocks]);

  return taskDiv;
};


function formatTimerDisplay(secs) {
  let hours = Math.floor(secs / 3600),
    minutes = Math.floor((secs - (hours * 3600)) / 60),
    seconds = secs - (hours * 3600) - (minutes * 60);
  hours >= 10 ? hours : hours = "0" + hours;
  minutes >= 10 ? minutes : minutes = "0" + minutes;
  seconds >= 10 ? seconds : seconds = "0" + seconds;
  return hours + ":" + minutes + ":" + seconds;
};

function showPomodoroTimer(element, time) {
  let timerElement = $("<h2></h2>").text(formatTimerDisplay(time));
  element.empty();
  element.append(timerElement);
};

function showCurrentTask(element, task) {
  element.empty();
  element.append(showTask(task));
};