
class PomodoroTimer{
    constructor(timeBlockSize=15){
        this.currentTask = null;
        this.interval = null;
        this.timeBlockSize = timeBlockSize;
        this.timerStarted = false;
        this.paused = false;
        this.delay = 1000;
        this.time = null;
    }

    start(currentTask, callback){
    	this.currentTask = currentTask;
        this.time = this.timeBlockSize * this.currentTask.timeBlocks;
        this.timerStarted = true; 
        callback(this.time);
    	this.interval = setInterval(this.updateTime.bind(this), this.delay);
    }

    updateTime(){
        if (this.time > 0){
            this.time--;
            chrome.runtime.sendMessage({command: "updateTime", time: this.time});
        } else {
            this.timerStarted = false;
            clearInterval(this.interval);
        }  
    }

    stop(callback){
        this.currentTask = null;
        this.time = null;
        this.timerStarted = false;
        clearInterval(this.interval);
        callback();
    }

    pause(callback){
        if (this.paused){
            this.interval = setInterval(this.updateTime.bind(this), this.delay);    
            this.paused = false;
        } else {
            clearInterval(this.interval)
            this.paused = true;
        } 
        callback();
    }

    loadTimer(callback){
        if (this.currentTask && this.timerStarted){
            chrome.runtime.sendMessage({command: "updateTime", time: this.time});  
            callback({timerStarted: this.timerStarted, currentTask: this.currentTask}); 
        }
    }
}