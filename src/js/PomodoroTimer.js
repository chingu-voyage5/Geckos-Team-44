
class PomodoroTimer{
    constructor(timeBlockSize=15){
        this.currentTask = null;
        this.interval = null;
        this.timeBlockSize = timeBlockSize;
        this.timerStarted = false;
        this.delay = 1000;
        this.time = null;
    }

    start(currentTask, callback){
    	this.currentTask = currentTask;
        this.time = this.timeBlockSize * this.currentTask.timeBlocks;
        this.timerStarted = true; 
        callback(this.time);

    	this.interval = setInterval(function(){
            if (this.time > 0){
                this.time--;
                chrome.runtime.sendMessage({command: "updateTime", time: this.time});
            } else {
                this.timerStarted = false;
                clearInterval(this.interval);
            }      
        }.bind(this), this.delay);
    }

    loadTimer(callback){
        if (this.currentTask && this.timerStarted){
            chrome.runtime.sendMessage({command: "updateTime", time: this.time});  
            callback({timerStarted: this.timerStarted, currentTask: this.currentTask}); 
        }
    }
}