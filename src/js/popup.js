$(document).ready(function(){
    let newTaskBtn = $(".newTaskButton"),
        tasksList = $(".taskList"),
        startTimerBtn = $(".pomodoroStart"),
        stopTimerBtn = $(".pomodoroStop"),
        pauseTimerBtn = $(".pomodoroPause"),
        pomodoro = $(".pomodoro"),
        currentTaskDiv = $(".currentTask"),
        settingsButton = $("#settingsButton"),
        currentTaskId = null;
        addTaskForm = new TaskFormView(),
        editTaskForm = new TaskFormView(),
        taskDiv = null,
        editMode = false,
        addMode = false,
        timerStarted = false;

    $('.activityButton').on('click', 'a', function () {
        chrome.tabs.create({ url: $(this).attr('href') });
        return false;
    });

    function resizePopUpHeight(removedDivs){
        let totalHeightToBeRemoved = 0.0;
        for (div of removedDivs)
            totalHeightToBeRemoved += div.height(); 
        let newHeight = ($(".wrapper").height() - totalHeightToBeRemoved);
        $("body").height(newHeight);
        $("html").height(newHeight);
    }

    chrome.runtime.getBackgroundPage(function(page){
        page.taskService.listTasks(function(error, response){
            response.tasks.forEach(function(task){
                tasksList.append(showTask(task));
            });
        });
    });

tasksList.on('dblclick', "ul", function(){
        taskId = this.id;
        taskDiv = $("#" + taskId);
        let deleteButton = $("<button class='deleteButton'><i class='fas fa-trash-alt'></i></button>");

        if (!editMode && !addMode) {
            taskDiv.hide();
            chrome.runtime.getBackgroundPage(function(page){
                page.taskRepository.fetch(taskId, function(task){
                    editMode = true;
                    editTaskForm.buttonsDiv.empty();
                    let form = editTaskForm.render(task);
                    form.children().last().append(deleteButton);
                    form.insertBefore(taskDiv);
                }); 
            });
        }

        deleteButton.click( function(){
            if (taskId === currentTaskId) {
                editTaskForm.showErrors(["Cannot delete current task"]);
                return;
            }
            chrome.runtime.getBackgroundPage(function(page){
                page.taskService.deleteTask({id: taskId}, function(error, response){
                    if (!error){
                        let task = $("#" + taskId);
                        resizePopUpHeight([task, $(".taskForm")]); 
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
        resizePopUpHeight([$(".taskForm")]); 
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
            $("<div class='.newTaskButtonsDiv'></div>").appendTo(addTaskForm);
            $(".editButtonsDiv").append(saveBtn);
            $(".editButtonsDiv").append(cancelBtn);
        }
    });

    addTaskForm.onCancel = function(){
        newTaskBtn.show();
        addTaskForm.resetForm();
        resizePopUpHeight([$(".taskForm")]); 
        addMode = false;
    };

    addTaskForm.onSave = function(){
        let mode = $("#modeSelect").val(),
            title = $("#titleInput").val(),
            timeBlocks = parseInt($("#timeBlocksInput").val());

        let request = {mode: mode, title: title, timeBlocks: timeBlocks};
    
        chrome.runtime.getBackgroundPage(function(page){
            page.taskService.addTask(request, function(error, response){
                if (error){
                    addTaskForm.showErrors(error.message)
                } else {
                    tasksList.append(showTask(response.task));
                    newTaskBtn.show();
                    addTaskForm.resetForm();
                    resizePopUpHeight([$(".taskForm")]); 
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
            showCurrentTask(currentTaskDiv, request.task);
        } else if (request.command === "taskComplete"){
            let completedTask = $("#" + request.task.id);
            completedTask.fadeOut(500, function(){
                completedTask.remove();
                resizePopUpHeight([completedTask]); 
            });
            showCurrentTask(currentTaskDiv, request.task);
        } else if (request.command === "allTasksComplete"){
            resetTimer();
            resizePopUpHeight([currentTaskDiv, pomodoro]);    
            currentTaskId = null;     
        }
    });

    startTimerBtn.click(function(){
        chrome.runtime.getBackgroundPage(function(page){
            if (!timerStarted){
                page.pomodoroTimer.start(function(time, task){
                    showCurrentTask(currentTaskDiv, task);
                    showPomodoroTimer(pomodoro, time);
                    timerStarted = true;
                });           
            }   
        });
    });

    stopTimerBtn.click(function(){
        if (timerStarted){
            chrome.runtime.getBackgroundPage(function(page){
                page.pomodoroTimer.stop(function(){
                    resetTimer();
                    resizePopUpHeight([currentTaskDiv, pomodoro]);
                    currentTaskId = null;
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

    settingsButton.click(function(){
        window.open(chrome.runtime.getURL("views/settings.html"));
    });
});