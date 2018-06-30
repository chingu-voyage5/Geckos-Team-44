

class TaskFormView {
    constructor(taskDiv=null) {
        this.taskDiv = taskDiv;
        this.taskFormDiv = $("<div></div>", { class: "taskForm" });
        this.saveBtn = $("<button>Save</button>");
        this.cancelBtn = $("<button>Cancel</button>");
        this.errorsList = $("<div></div>", { id: "errorsList" }).css({ color: "red" });
        this.onCancel = function(){};
        this.onSave = function(){};
    }

    showErrors(errors){
        let errorsList = this.errorsList;
        errorsList.empty();
        errors.forEach(function(error){
            errorsList.append($("<div></div>").text(error))
        });
    }

    render(task={ mode: "work", title: "", timeBlocks: 1 }) {
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

        titleInput.keydown(function(event){
            if (event.which === 13)
                taskFormView.onSave();
        })
        
        this.cancelBtn.click(function () {
            taskFormView.onCancel();
        });   

        return this.taskFormDiv;
    }

    resetForm(){
        this.taskFormDiv.hide();
        this.errorsList.empty();
        this.taskFormDiv.empty();
    }
};

function showTask(task){
    let taskDiv = $("<ul></ul>", {id: task.id}),
        taskMode = $("<li></li>", {class: "taskIcon"}),
        taskIcon = $("<i></i>", {class: "fas"}),
        taskName = $("<li></li>", {class: "taskName"}),
        taskBlocks = $("<li></li>", {class: "taskBlocks"});
    
    if (task.mode === "work") 
        taskIcon.addClass("fa-briefcase");
    else if (task.mode === "play")
        taskIcon.addClass("fa-paper-plane");

    taskName.text(task.title);
    taskBlocks.text(task.timeBlocks);
    taskMode.append(taskIcon);
    taskDiv.append([taskMode, taskName, taskBlocks]);

    return taskDiv;
};




$(document).ready(function(){
    let newTaskBtn = $(".newTaskButton"),
        tasksList = $(".taskList"),
        taskDiv = null,
        startTimerBtn = $(".pomodoroStart"),
        pomodoro = $(".pomodoro");
        addTaskForm = new TaskFormView(),
        editTaskForm = new TaskFormView(),
        editMode = false,
        addMode = false;
    

    chrome.runtime.getBackgroundPage(function(page){
        page.taskService.listTasks(function(error, response){
            response.tasks.forEach(function(task){
                tasksList.prepend(showTask(task));
            });
        });
    });

    tasksList.on('dblclick', "ul", function(){
        if (!editMode && !addMode) {
            let taskId = this.id;
            taskDiv = $("#" + taskId);
            taskDiv.hide();
     
            chrome.runtime.getBackgroundPage(function(page){
                page.taskRepository.fetch(taskId, function(task){
                    editMode = true;
                    editTaskForm.render(task).insertBefore(taskDiv);
                }); 
            });
        }
    });

    editTaskForm.onCancel = function(){
        this.resetForm();
        taskDiv.show();
        editMode = false;
    };


    editTaskForm.onSave = function(){
        let mode = $("#modeSelect").val(),
            title = $("#titleInput").val(),
            timeBlocks = $("#timeBlocksInput").val(),
            id = taskDiv[0].id;
        
        let request = {id: id, mode: mode, 
            title: title, timeBlocks: timeBlocks};
        
        chrome.runtime.getBackgroundPage(function(page){
            page.taskService.editTask(request, function(error, response){
                if (error){
                    editTaskForm.showErrors(error.message);
                } else {
                    taskDiv.replaceWith(showTask(response.task));
                    editTaskForm.resetForm();
                    editMode = false;
                }
            });
        });
    };

    newTaskBtn.click(function(){ 
        if (!editMode && !addMode){
            addMode = true;
            newTaskBtn.hide();
            addTaskForm.render().insertBefore(newTaskBtn);
        }
    });

    addTaskForm.onCancel = function(){
        newTaskBtn.show();
        addTaskForm.resetForm();
        addMode = false;
    };

    addTaskForm.onSave = function(){
        let mode = $("#modeSelect").val(),
            title = $("#titleInput").val(),
            timeBlocks = $("#timeBlocksInput").val();

        let request = {mode: mode, title: title, timeBlocks: timeBlocks};
    
        chrome.runtime.getBackgroundPage(function(page){
            page.taskService.addTask(request, function(error, response){
                if (error){
                    addTaskForm.showErrors(error.message)
                } else {
                    tasksList.append(showTask(response.task));
                    newTaskBtn.show();
                    addTaskForm.resetForm();
                    addMode = false;
                }   
            });
        });
    };

    // Pomodoro Timer Events

    function showPomodoroTimer(element, time){
        let timerElement = $("<h2></h2>").text(time);
        element.empty();
        element.append(timerElement);
    };

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        if (request.command === "updateTime"){
            showPomodoroTimer(pomodoro, request.time);
        }
    });

    startTimerBtn.click(function(){
        console.log("start button clicked");
        chrome.runtime.getBackgroundPage(function(page){
            let currentTask = $(".taskList ul").first()[0];
            if (currentTask){
                page.taskRepository.fetch(currentTask.id, function(task){
                    page.pomodoroTimer.start(task, function(time){
                        showPomodoroTimer(pomodoro, time);
                    });
                });               
            }   
        });
    });

});