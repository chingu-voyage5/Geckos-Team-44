
function InvalidRequestError(message){
    this.name = "InvalidRequestError";
    this.message = message;
}

function TaskNotFoundError(message){
    this.name = "InvalidRequestError";
    this.message = message;
}


function TaskService(taskRepository){
    this.taskRepository = taskRepository;
}

TaskService.prototype.validateSaveRequest = function(request){
    let errors = [];

    if (request.title === "")
        errors.push("Title cannot be blank");
    else if (request.title.length < 3)
        errors.push("Title cannot be less than 3 characters");
    else if (request.title.length > 50)
        errors.push("Title cannot be more than 50 characters");

    if (!["work", "play"].includes(request.mode))
        errors.push("Mode must be either: 'work' or 'play'");

    if (request.timeBlocks < 1) 
        errors.push("Time Blocks cannot be less than 1");
    else if (request.timeBlocks > 4)
        errors.push("Time Blocks cannot be more than 4");

    if (errors.length > 0)    
        return errors;
    return null;
};

TaskService.prototype.handleTaskNotFound = function(task, callback){
    return callback(new TaskNotFoundError("Task not found"), null);
}

TaskService.prototype.handleInvalidRequest = function(errors, callback){
    return callback(new InvalidRequestError(errors), null);
}

TaskService.prototype.addTask = function(request, callback){
    let errors = this.validateSaveRequest(request);
    if (errors)
        return this.handleInvalidRequest(errors, callback);
    let task = new Task(request.title, request.mode, request.timeBlocks);
    this.taskRepository.save(task, function(error, result){
        callback(null, {task: task});
    });
};

TaskService.prototype.listTasks = function(callback){
    this.taskRepository.fetchAll(function(error, result){
        let tasks = [];
        for (task of result.tasks){
            if (!task.isCompleted())
                tasks.push(task);
        }
        callback(error, {tasks: tasks});
    })
};

TaskService.prototype.deleteTask = function(request, callback){
    var taskRepository = this.taskRepository;
    var taskService = this;
    
    taskRepository.fetch(request.id, function(task){
        if (!task)
            return taskService.handleTaskNotFound(task, callback);
        taskRepository.delete(task.id, function(taskId){
            callback(null, {taskId: taskId});
        });
    });
};

TaskService.prototype.getCompletedTasksFor = function(timePeriodString, callback){
    let timePeriodKey = {daily: 1, weekly: 7, monthly: 30};
    let timePeriod = timePeriodKey[timePeriodString];

    function filterTasksWithinTimePeriod(tasks){
        let dailyTasks = [];
        for (task of tasks) {
            let timeDiff = Math.abs(task.completedOn.getTime() - new Date().getTime());
            let diffDays = timeDiff / (1000 * 3600 * 24);
            if (diffDays <= timePeriod) {
                dailyTasks.push(task);
            }
        }
        return dailyTasks;
    };

    this.taskRepository.fetchAllComplete(function(error, request){
        if (!timePeriod)
            return callback(request.tasks);
        return callback(filterTasksWithinTimePeriod(request.tasks));
    });
}

TaskService.prototype.editTask = function(request, callback){
    var taskRepository = this.taskRepository;
    var taskService = this;

    taskRepository.fetch(request.id, function(task){
        if (!task)
            return taskService.handleTaskNotFound(task, callback);
        
        let errors = taskService.validateSaveRequest(request);
        if (errors)
            return taskService.handleInvalidRequest(errors, callback);
        
        task.title = request.title;
        task.timeBlocks = request.timeBlocks;
        task.mode = request.mode;
        
        taskRepository.save(task, function(error, result){ 
            callback(error, {task: result});
        });
    });

};

