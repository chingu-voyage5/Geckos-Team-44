function showTaskRow(tasksTable, task){
    let tableRow = $("<tr></tr>"),
        taskIcon = $("<i></i>", { class: "fas" });

    if (task.mode === "work")
        taskIcon.addClass("fa-briefcase");
    else if (task.mode === "play")
        taskIcon.addClass("fa-paper-plane");

    tableRow.append($("<td></td>").append(taskIcon));
    tableRow.append($("<td></td>").text(task.title));
    tableRow.append($("<td></td>").text(formatDate(task.completedOn)));
    tableRow.append($("<td></td>").text(task.totalTimeSpent + " min(s)"));     
    tasksTable.append(tableRow);     
}

function formatDate (taskDate) {
    return taskDate.toString().split(" ").slice(0, 4).join(" ");
}

function updateTasksTable(tableBody, timePeriodString=null){
    tableBody.empty();
    chrome.runtime.getBackgroundPage(function(page){
        page.taskService.getCompletedTasksFor(timePeriodString, function(tasks){
            for (task of tasks){
                showTaskRow(tableBody, task);                   
            }
        });
    });
}

function removeSelectedClass(){
    let activityNavElements = $(".activityNav ul li span");
    for (element of activityNavElements)
        $(element).removeClass("selected");
}

$(document).ready(function(){
    let completedTasksTable = $("#completedTasksTable"),
        tableBody = $("#completedTasksTable tbody"),
        allTasksButton = $("#allTasksButton"),
        dailyTasksButton = $("#dailyTasksButton"),
        weeklyTasksButton = $("#weeklyTasksButton"),
        monthlyTasksButton = $("#monthlyTasksButton");
    
    updateTasksTable(tableBody);

    allTasksButton.click(function(){
        removeSelectedClass();
        allTasksButton.addClass("selected");
        updateTasksTable(tableBody, null);
    });

    dailyTasksButton.click(function(){
        removeSelectedClass();
        dailyTasksButton.addClass("selected");
        updateTasksTable(tableBody, "daily");
    });

    weeklyTasksButton.click(function() {
        removeSelectedClass();
        weeklyTasksButton.addClass("selected");
        updateTasksTable(tableBody, "weekly");
    });

    monthlyTasksButton.click(function() {
        removeSelectedClass();
        monthlyTasksButton.addClass("selected");
        updateTasksTable(tableBody, "monthly");
    });

});