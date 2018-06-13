

function TaskRepository(storage){
	this._storage = storage;
	this._tasks = {};
};

TaskRepository.prototype.save = function(task, callback){
	if (task.id === null)
		task.id = uuid();
	if (task.createdOn === null)
		task.createdOn = new Date();
	task.updatedOn = new Date();

	let copiedTask = Object.assign({}, task);
	this._tasks[task.id] = copiedTask;
	this._storage.sync.set({[task.id]: this.serializeTask(copiedTask)}, function(){
		callback(task);
	});
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
