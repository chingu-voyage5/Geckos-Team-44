
function Task(id=null, title="", mode="", timeBlocks=-1, order=-1, 
			  createdOn=null, updatedOn=null, completedOn=null) {
	this.id = id;
	this.title = title;
	this.mode = mode;
	this.timeBlocks = timeBlocks;
	this.order = order;
	this.createdOn = createdOn;
	this.updatedOn = updatedOn;
	this.completedOn = completedOn;
}


Task.prototype.isCompleted = function() {
	if (this.completedOn !== null)
		return true
	return false;
};

Task.prototype.setComplete = function() {
	this.completedOn = new Date();
}