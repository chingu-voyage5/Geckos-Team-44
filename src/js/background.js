// Manual Test

chrome.storage.sync.clear();
var taskRepository = new TaskRepository(chrome.storage);
var taskService = new TaskService(taskRepository);
var request = {title: "test", timeBlocks: 2, mode: "work"};
taskService.addTask(request, function(error, response){
    console.log(error, response);
});
