
function Task(id=null, title="", mode="", timeBlocks=0, order=0, 
			  createdOn=null, updatedOn=null, completedOn=null, 
			  totalTimeSpent=0) {
	this.id = id;
	this.title = title;
	this.mode = mode;
	this.timeBlocks = timeBlocks;
	this.order = order;
	this.createdOn = createdOn;
	this.updatedOn = updatedOn;
	this.completedOn = completedOn;
	this.totalTimeSpent = totalTimeSpent;
}


Task.prototype.isCompleted = function() {
	if (this.completedOn !== null)
		return true
	return false;
};

Task.prototype.setComplete = function(timeBlockSize=15.0) {
	this.totalTimeSpent = timeBlockSize * this.timeBlocks;
	this.completedOn = new Date();
}