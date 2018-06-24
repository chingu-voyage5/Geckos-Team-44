

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

class TaskView {
    render(task){
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
    
}

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


function showErrors(errors){
    let errorsList = $("#errorsList");
    errorsList.empty();
    errors.forEach(function(error){
        errorsList.append($("<div></div>").text(error))
    });
}

$(document).ready(function(){
    let newTaskBtn = $(".newTaskButton"),
        tasksList = $(".taskList"),
        taskDiv = null;
        addTaskForm = new TaskFormView(),
        editTaskForm = new TaskFormView(),
        taskView = new TaskView(),
        editMode = false,
        addMode = false;
    
    chrome.runtime.getBackgroundPage(function(page){
        chrome.runtime.getBackgroundPage(function(page){
            page.taskService.listTasks(function(error, response){
                response.tasks.forEach(function(task){
                    tasksList.prepend(taskView.render(task));
                });
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
                    showErrors(error.message);
                } else {
                    taskDiv.replaceWith(taskView.render(response.task));
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
                    showErrors(error.message);
                } else {
                    tasksList.append(taskView.render(response.task));
                    newTaskBtn.show();
                    addTaskForm.resetForm();
                    addMode = false;
                }   
            });
        });
    };
});