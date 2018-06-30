
class PomodoroTimer{
    constructor(timeBlockSize=15){
        this.currentTask = null;
        this.interval = null;
        this.time = null;
        this.timeBlockSize = timeBlockSize;
        this.delay = 1000;
    }

    start(currentTask, callback){
    	this.currentTask = currentTask;
    	let time = this.timeBlockSize * this.currentTask.timeBlocks;
    	callback(time);

    	this.interval = setInterval(function(){
    		if (time > 0){
    			time--;
    			chrome.runtime.sendMessage({command: "updateTime", time: time});
    		}	
    	}, this.delay);

    }
}