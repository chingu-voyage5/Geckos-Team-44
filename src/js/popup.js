
function showErrors(errorsList, errors){
    errorsList.empty();
    errors.forEach(function(error){
        errorsList.append($("<li></li>").text(error));
    });
}

function showTask(tasksList, task){
    let taskDiv = $("<div></div>", {class: "task-div", id: task.id}),
        modeDiv = $("<div></div>", {class: "task-mode"}),
        titleDiv = $("<div></div>", {class: "task-title"}),
        timeBlocksDiv = $("<div></div>", {class: "task-time-blocks"});
    taskDiv.append(modeDiv.text(task.mode));
    taskDiv.append(titleDiv.text(task.title));
    taskDiv.append(timeBlocksDiv.text(task.timeBlocks));
    tasksList.prepend(taskDiv);
}

$(document).ready(function(){
    let tasksList = $("#tasks-list"),
        addTaskBtn = $("#add-task-btn"),
        taskForm = $("#task-form"),
        saveBtn = $("#save-btn"),
        errorsList = $("#errors"),
        cancelBtn = $("#cancel-btn"),
        modeSelect = $("#mode-select"),
        titleInput = $("#title-input"),
        timeBlocksInput = $("#time-blocks-input"),
        taskDiv = $(".task-div");

    function resetAddForm(){
        taskForm.hide();
        addTaskBtn.show();
        errorsList.empty();
        timeBlocksInput.val(1);
        titleInput.val("");  
    }


    chrome.runtime.getBackgroundPage(function(page){
        page.taskService.listTasks(function(error, response){
            response.tasks.forEach(function(task){
                showTask(tasksList, task);
            });
        });
    });

    tasksList.dblclick(function(event){
        let taskDiv = $(event.target.parentNode);
        console.log(taskDiv)
    });

    addTaskBtn.click(function(){
        addTaskBtn.hide();
        taskForm.show();
        timeBlocksInput.val(1);
    });

    cancelBtn.click(function(){
        resetAddForm();
    });

    saveBtn.click(function(){
        let request = {mode: modeSelect.val(), 
            title: titleInput.val(), 
            timeBlocks: timeBlocksInput.val()};
        chrome.runtime.getBackgroundPage(function(page){
            page.taskService.addTask(request, function(error, response){
                if (error){
                    showErrors(errorsList, error.message);
                } else {
                    showTask(tasksList, response.task);
                    resetAddForm();
                }
            });
        });
    });
});