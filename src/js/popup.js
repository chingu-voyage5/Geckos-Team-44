$(document).ready(function(){
    let newTaskBtn = $(".newTaskButton"),
        tasksList = $(".taskList"),
        startTimerBtn = $(".pomodoroStart"),
        stopTimerBtn = $(".pomodoroStop"),
        pauseTimerBtn = $(".pomodoroPause"),
        pomodoro = $(".pomodoro"),
        currentTaskDiv = $(".currentTask"),
        currentTaskId = null;
        addTaskForm = new TaskFormView(),
        editTaskForm = new TaskFormView(),
        taskDiv = null,
        editMode = false,
        addMode = false,
        timerStarted = false;
        

    chrome.runtime.getBackgroundPage(function(page){
        page.taskService.listTasks(function(error, response){
            response.tasks.forEach(function(task){
                tasksList.prepend(showTask(task));
            });
        });
    });

tasksList.on('dblclick', "ul", function(){
        let deleteButton = $("<button><i class='fas fa-trash-alt'></i></button>", {class: "deleteButton"}), 
        taskId = this.id;
        taskDiv = $("#" + taskId);

        if (!editMode && !addMode) {
            taskDiv.hide();
            chrome.runtime.getBackgroundPage(function(page){
                page.taskRepository.fetch(taskId, function(task){
                    editMode = true;
                    let form = editTaskForm.render(task);
                    form.append(deleteButton);
                    form.insertBefore(taskDiv);
                }); 
            });
        }

        deleteButton.click( function(){
            if (taskId === currentTaskId) {
                showErrors();
                return;
            }
            chrome.runtime.getBackgroundPage(function(page){
                page.taskService.deleteTask({id: taskId}, function(error, response){
                    if (!error){
                        let task = $("#" + taskId); 
                        task.remove();
                        editTaskForm.resetForm();
                        editMode = false;
                    }
                });
            });
        }); 
    });

    // Edit Task Events

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
    function resetTimer(){
        timerStarted = false;
        pomodoro.empty();
        currentTaskDiv.empty();
    };

    chrome.runtime.getBackgroundPage(function(page){
        page.pomodoroTimer.loadTimer(function(response){
            timerStarted = response.timerStarted;
            showCurrentTask(currentTaskDiv, response.currentTask);
        });
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        if (request.command === "updateTime"){
            showPomodoroTimer(pomodoro, request.time);    
        }
    });

    startTimerBtn.click(function(){
        chrome.runtime.getBackgroundPage(function(page){
            let currentTask = $(".taskList ul").first()[0];
                currentTaskId = currentTask.id;
            if (currentTask && !timerStarted){
                page.taskRepository.fetch(currentTask.id, function(task){
                    showCurrentTask(currentTaskDiv, task);
                    page.pomodoroTimer.start(task, function(time){
                        showPomodoroTimer(pomodoro, time);
                        timerStarted = true;
                    });
                });               
            }   
        });
    });

    stopTimerBtn.click(function(){
        if (timerStarted){
            chrome.runtime.getBackgroundPage(function(page){
                page.pomodoroTimer.stop(function(){
                    resetTimer();
                });
            });
        }    
    })

    pauseTimerBtn.click(function(){
        if (timerStarted){
            chrome.runtime.getBackgroundPage(function(page){
                page.pomodoroTimer.pause(function(){});
            });
        }
    });
});