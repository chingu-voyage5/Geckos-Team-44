
function SettingsService(settingsRepository){
    this.defaultSettings = {
        timeBlockSize: 15,
        displayTaskNotification: true
    };

    this.settingsRepository = settingsRepository;
    this.timeBlockSize = this.defaultSettings.timeBlockSize;
    this.displayTaskNotification = this.defaultSettings.displayTaskNotification;
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

SettingsService.prototype.resetAll = function(callback){
    this.settingsRepository.resetAll(function(){
        callback(this.defaultSettings);
    }.bind(this));
}
