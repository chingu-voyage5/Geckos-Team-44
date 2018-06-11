
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
        
    return errors;
};

TaskService.prototype.addTask = function(request){
    let errors = this.validateRequest(request);
    if (errors.length > 0)
        throw errors;
    let task = this.taskRepository.save(
        new Task(request.title, request.mode, request.timeBlocks));
    return {task: task};
};
