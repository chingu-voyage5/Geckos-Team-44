
function SettingsService(settingsRepository){
    this.settingsRepository = settingsRepository;
    this.timeBlockSize = 3;
    this.displayTaskNotification = true;
}

SettingsService.prototype.loadUserSettings = function(){
    this.settingsRepository.fetchUserSettings(function(error, result){
        for (settingName in result.settings){
            this[settingName] = result.settings[settingName];
        }
    }.bind(this));
}

SettingsService.prototype.addUserSettings = function(settings, callback){
    this.settingsRepository.saveUserSettings(settings, function(){
        callback(settings);
    }.bind(this));
}

SettingsService.prototype.resetAll = function(){
    this.settingsRepository.resetAll();
    chrome.runtime.sendMessage(
        {
            command: "updateSettings", settings: {
            timeBlockSize: this.timeBlockSize,
            displayTaskNotification: this.displayTaskNotification
        }
    });
}
