
chrome.storage.sync.clear();
var taskRepository = new TaskRepository(chrome);
var taskService = new TaskService(taskRepository);
var pomodoroTimer = new PomodoroTimer();

// Test Fixtures
taskService.addTask({title: "New Task", mode: "work", timeBlocks: 1}, function(error, result){
});







