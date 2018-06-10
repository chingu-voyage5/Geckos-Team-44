

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
	this._tasks[copiedTask.id] = this.serializeTask(copiedTask);
	this._state.sync.set({"tasksMap": this._tasks}, function(){});
};

TaskRepository.prototype.serializeTask = function(task){
	Object.keys(task).forEach(function(key){
		if (task[key] instanceof Date)
			task[key] = task[key].toJSON();
	});
	return task;
}

TaskRepository.prototype.unserializeTask = function(task){
	Object.keys(task).forEach(function(key){
		if (key.endsWith("On"))
			if (task[key] !== null)
				task[key] = new Date(task[key]);
	});
	return task;	
}
