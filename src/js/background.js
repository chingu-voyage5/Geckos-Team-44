// Manual Test

chrome.storage.sync.clear();
var taskRepository = new TaskRepository(chrome);
var taskService = new TaskService(taskRepository);
var request = {title: "test", timeBlocks: 1, mode: "work"};

taskService.addTask(request, function(error, response){
    console.log(error, response);
});

taskRepository.fetchAll(function(error, result){
    console.log(error, result);
});
