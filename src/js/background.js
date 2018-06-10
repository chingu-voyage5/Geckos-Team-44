// Manual Test
chrome.storage.sync.clear();
var taskRepository = new TaskRepository(chrome.storage);
var taskService = new TaskService(taskRepository);
var response = taskService.addTask({title: "test", timeBlocks: 2, mode: "work"});

chrome.storage.sync.get(["tasksMap"], function(result){
    let task = result.tasksMap[response.task.id];
    console.log(taskRepository.unserializeTask(task));
});