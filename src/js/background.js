
chrome.storage.sync.clear();

var settingsRepository = new SettingsRepository(chrome);
var settings = new SettingsService(settingsRepository);
settings.loadUserSettings();

var taskRepository = new TaskRepository(chrome);
taskRepository.load();
var taskService = new TaskService(taskRepository);
var pomodoroTimer = new PomodoroTimer(taskRepository, settings);

// Test Fixtures
taskService.addTask({title: "Add Notifications", mode: "work", timeBlocks: 1}, function(error, result){});
taskService.addTask({title: "Watch OSW Review", mode: "play", timeBlocks: 3}, function(error, result){}); 
taskService.addTask({title: "Style buttons", mode: "work", timeBlocks: 2}, function(error, result){}); 

