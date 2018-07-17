
// chrome.storage.sync.clear();

chrome.storage.sync.clear();

var settingsRepository = new SettingsRepository(chrome);
var settings = new SettingsService(settingsRepository);
settings.loadUserSettings();
var taskRepository = new TaskRepository(chrome);
taskRepository.load();
var taskService = new TaskService(taskRepository);
var pomodoroTimer = new PomodoroTimer(taskRepository, settings);

// Test Fixtures
taskService.addTask({title: "Add Notifications", mode: "work", timeBlocks: 1}, function(error, result){
    taskRepository.fetch(result.task.id, function(task){
        let oneDay = 86400000;
        task.setComplete(settings.timeBlockSize);
        task.completedOn = new Date(task.completedOn.getTime() + (oneDay * 2));
        taskRepository.save(task, function(error, response){});
    });
});

taskService.addTask({title: "Watch OSW Review", mode: "play", timeBlocks: 3}, function(error, result){
    taskRepository.fetch(result.task.id, function(task){
        task.setComplete(settings.timeBlockSize);
        taskRepository.save(task, function(error, response){});
    });
}); 

taskService.addTask({title: "Style buttons", mode: "work", timeBlocks: 2}, function(error, result){
    taskRepository.fetch(result.task.id, function(task){
        let oneDay = 86400000;
        task.setComplete(settings.timeBlockSize);
        task.completedOn = new Date(task.completedOn.getTime() + (oneDay * 8));
        taskRepository.save(task, function(error, response){});
    });
});

taskService.addTask({title: "Complete Chingu Voyage", mode: "work", timeBlocks: 4}, function(error, result){});

