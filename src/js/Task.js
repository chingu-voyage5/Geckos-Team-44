
function Task(title="", mode="", timeBlocks=1, order=-1, 
			  createdOn=null, updatedOn=null, completedOn=null, 
			  totalTimeSpent=0, id=null) {
	this.id = id;
	this.title = title;
	this.mode = mode;
	this.timeBlocks = timeBlocks;
	this.order = order;
	this.createdOn = createdOn;
	this.updatedOn = updatedOn;
	this.completedOn = completedOn;
	this.totalTimeSpent = totalTimeSpent;
	this.name = "Task";
}	


Task.prototype.isCompleted = function() {
	if (this.completedOn === null)
		return false
	return true;
};

Task.prototype.setComplete = function(timeBlockSize=15.0) {
	this.totalTimeSpent = timeBlockSize * this.timeBlocks;
	this.completedOn = new Date();
}