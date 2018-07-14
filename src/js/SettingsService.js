
function SettingsService(settingsRepository){
    this.settingsRepository = settingsRepository;
    this.timeBlockSize = 3;
    this.displayTaskNotification = true;
    
    this.defaultSettings = {
        timeBlockSize: 3,
        displayTaskNotification: true
    };
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
