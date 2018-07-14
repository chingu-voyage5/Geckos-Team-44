$(document).ready(function(){
    let timeBlockSize = $("#timeBlockSize"),
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

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        if (request.command === "updateSettings")
            updateSettings(request.settings);
    });

    resetSettingsButton.click(function(){
        chrome.runtime.getBackgroundPage(function(page){
            page.settings.resetAll();
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