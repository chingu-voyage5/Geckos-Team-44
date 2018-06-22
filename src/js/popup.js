

function TaskFormView(taskElement){
    this.taskElement = taskElement;
    this.taskFormDiv = $("<div></div>", {class: "taskForm"});
    this.saveBtn = $("<button>Save</button>");
    this.cancelBtn = $("<button>Cancel</button>");
    this.errorsList = $("<div></div>", {id: "errorsList"}).css({color: "red"});

    this.taskElement.hide();
    this.taskFormDiv.insertBefore(taskElement);
};

TaskFormView.prototype.render = function(task={mode: "work", title: "", timeBlocks: 1}){
    let form = $("<ul></ul>");
        modeDiv = $("<li></li>"),
        titleDiv = $("<li></li>"),
        timeBlocksDiv = $("<li></li>"),
        modeSelect = $("<select id='modeSelect'></select>"),
        titleInput = $("<input type='text' id='titleInput'>"),
        timeBlocksInput = $("<input type='number' id='timeBlocksInput' min='1' max='4'>");

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
}

TaskFormView.prototype.resetForm = function(){
    this.taskFormDiv.hide();
    this.taskFormDiv.empty();
    this.errorsList.empty();
    this.taskElement.show();
}

TaskFormView.prototype.onSave = function(callback){
    this.saveBtn.click(function(){
        callback();
    });
}

TaskFormView.prototype.onCancel = function(callback){
    this.cancelBtn.click(function(){
        callback();
    })
}

function showTask(tasksList, task){
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
    tasksList.append(taskDiv);
};

function showErrors(errors){
    let errorsList = $("#errorsList");
    errorsList.empty();
    errors.forEach(function(error){
        errorsList.append($("<div></div>").text(error))
    });
}

$(document).ready(function(){
    let newTaskBtn = $(".newTaskButton"),
        tasksList = $(".taskList");
    
    chrome.runtime.getBackgroundPage(function(page){
        chrome.runtime.getBackgroundPage(function(page){
            page.taskService.listTasks(function(error, response){
                response.tasks.forEach(function(task){
                    showTask(tasksList, task);
                });
            });
        });
    });


    newTaskBtn.click(function(){
        let taskFormView = new TaskFormView(newTaskBtn);
        taskFormView.render();

        taskFormView.onCancel(function(){
            taskFormView.resetForm();
        });

        taskFormView.onSave(function(){
            let mode = $("#modeSelect").val(),
                title = $("#titleInput").val(),
                timeBlocks = $("#timeBlocksInput").val();

            let request = {mode: mode, title: title, timeBlocks: timeBlocks};
            chrome.runtime.getBackgroundPage(function(page){
                page.taskService.addTask(request, function(error, response){
                    if(error){
                        showErrors(error.message);
                    } else {
                        showTask(tasksList, response.task);
                        taskFormView.resetForm();
                    }   
                });
            });
        });
    });
});