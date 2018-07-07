
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        if (request.command === "showNotification"){
            let confirmed = confirm("Did you " + request.task.title + "?");
            if (confirmed)
                sendResponse({command: "markTaskComplete"});
            else 
                sendResponse({command: "markTaskIncomplete"});
        }          
    }
)