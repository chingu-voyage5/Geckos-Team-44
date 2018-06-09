

function TaskRepository(state){
	this._state = state;
	this._tasks = {};
};

TaskRepository.prototype.save = function(task){
	if (task.id === null)
		task.id = uuid();
	if (task.createdOn === null)
		task.createdOn = new Date();
	task.updatedOn = new Date();

	let copiedTask = Object.assign({}, task);
	this._tasks[copiedTask.id] = copiedTask;
	this._state.sync.set({"tasksMap": this._tasks}, function(){});
};
