
chrome.storage.sync.clear();

var taskRepository = new TaskRepository(chrome);
var taskService = new TaskService(taskRepository);
var pomodoroTimer = new PomodoroTimer(taskRepository);

// Test Fixtures
taskService.addTask({title: "Complete Chingu Voyage", mode: "work", timeBlocks: 1}, function(error, result){
});







