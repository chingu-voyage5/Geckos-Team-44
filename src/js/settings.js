$(document).ready(function(){
    let timeBlockSize = $("#timeBlockSizeSetting"),
        displayTaskNotification = $("#displayTaskNotification"),
        saveSettingsButton = $("#saveSettingsButton"),
        resetSettingsButton = $("#resetSettingsButton"),
        messages = $("#settingsMessages");

    function updateSettings(settings){
        timeBlockSize.val(settings.timeBlockSize);
        displayTaskNotification.prop("checked", settings.displayTaskNotification);  
    }

    chrome.runtime.getBackgroundPage(function(page){
        updateSettings(page.settings);
    });

    resetSettingsButton.click(function(){
        chrome.runtime.getBackgroundPage(function(page){
            page.settings.resetAll(function(request){
                updateSettings(request);
            });
        });
    });

    saveSettingsButton.click(function(){
        chrome.runtime.getBackgroundPage(function(page){
            let settings = {
                "timeBlockSize": timeBlockSize.val(),
                "displayTaskNotification": displayTaskNotification.prop("checked")
            }

            page.settings.addUserSettings(settings, function(){
                page.settings.loadUserSettings();
                messages.empty();
                messages.append("Settings saved");
            });
        });
    });
});