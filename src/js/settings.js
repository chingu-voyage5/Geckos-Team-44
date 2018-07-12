$(document).ready(function(){
    let timeBlockSize = $("#timeBlockSize"),
        saveSettingsButton = $("#saveSettingsButton"),
        messages = $("#settingsMessages");

    chrome.runtime.getBackgroundPage(function(page){
        timeBlockSize.val(page.settings.timeBlockSize);
    });

    saveSettingsButton.click(function(){
        chrome.runtime.getBackgroundPage(function(page){
            let settings = {"timeBlockSize": timeBlockSize.val()};
            page.settings.addUserSettings(settings, function(){
                page.settings.loadUserSettings();
                messages.empty();
                messages.append("Settings saved");
            });
        });
    });
});