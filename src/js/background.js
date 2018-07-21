
var settingsRepository = new SettingsRepository(chrome);
var settings = new SettingsService(settingsRepository);
settings.loadUserSettings();
var taskRepository = new TaskRepository(chrome);
taskRepository.load();
var taskService = new TaskService(taskRepository);
var pomodoroTimer = new PomodoroTimer(taskRepository, settings);
