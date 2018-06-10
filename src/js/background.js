// Manual Test

chrome.storage.sync.clear();
var taskRepository = new TaskRepository(chrome.storage);
var taskService = new TaskService(taskRepository);
taskService.addTask({title: "test1", timeBlocks: 2, mode: "work"});
taskService.addTask({title: "test2", timeBlocks: 2, mode: "play"});

chrome.storage.sync.get(["tasksMap"], function(result){
    console.log(result);
});