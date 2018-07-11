
function SettingsService(settingsRepository){
    this.settingsRepository = settingsRepository;
    this.timeBlockSize = 3;
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
        console.log(settings);
        callback(settings);
    }.bind(this));
}