
function InvalidRequestError(message){
    this.name = "InvalidRequestError";
    this.message = message;
}

function TaskService(taskRepository){
    this.taskRepository = taskRepository;
}

TaskService.prototype.validateRequest = function(request){
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

TaskService.prototype.addTask = function(request, callback){
    let errors = this.validateRequest(request);
    if (errors){
        callback(new InvalidRequestError(errors), null);
    } else {
        let task = new Task(request.title, request.mode, request.timeBlocks);
        this.taskRepository.save(task, function(){
            callback(null, {"task": task});
        });
    }
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
}

