
function SettingsRepository(chrome){
    this._chrome = chrome;
}

SettingsRepository.prototype.fetchUserSettings = function(callback){
    this._chrome.storage.sync.get("settings", function(result){
        callback(null, result);
    });
}

SettingsRepository.prototype.saveUserSettings = function(settings, callback){
    this._chrome.storage.sync.set({"settings": settings}, function(){
        callback(null, settings);
    }); 
}

SettingsRepository.prototype.resetAll = function(callback){
    this._chrome.storage.sync.remove("settings", function(){
        callback();
    });
}
