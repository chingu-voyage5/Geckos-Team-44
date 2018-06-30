// Manual Test

chrome.storage.sync.clear();
var taskRepository = new TaskRepository(chrome);
var taskService = new TaskService(taskRepository);
var pomodoroTimer = new PomodoroTimer();







