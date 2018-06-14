// Manual Test

chrome.storage.sync.clear();
var taskRepository = new TaskRepository(chrome);
var taskService = new TaskService(taskRepository);
var request = {title: "test", timeBlocks: 1, mode: "work"};

taskService.addTask(request, function(error, response){
    console.log(error, response);
});

taskService.listTasks(function(error, response){
    console.log(error, response);
    for (task of response.tasks){
        var request = {id: task.id, title: "test updated", timeBlocks: 1, mode: "work"};
        taskService.editTask(request, function(error, response){
            console.log(error, response);
        })
    }
});

