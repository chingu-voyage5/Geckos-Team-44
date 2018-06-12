// Manual Test

chrome.storage.sync.clear();
var taskRepository = new TaskRepository(new ChromeStorage(chrome.storage));
var taskService = new TaskService(taskRepository);
taskService.addTask({title: "test1", timeBlocks: 2, mode: "work"});
taskService.addTask({title: "test1", timeBlocks: 2, mode: "work"});
chrome.storage.sync.get(null, function(result){
    console.log(result);
});