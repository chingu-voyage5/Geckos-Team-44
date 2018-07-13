

function TaskRepository(chrome){
	this._chrome = chrome;
	this._tasks = {};
};

TaskRepository.prototype.load = function(){
	this._chrome.storage.sync.get("tasks", function(result){
		for (taskId in result.tasks)
			this._tasks[taskId] = Object.assign(new Task(), 
			this.unserializeTask(result.tasks[taskId])); 
	}.bind(this));
};

TaskRepository.prototype.save = function(task, callback){
	if (task.id === null)
		task.id = uuid();
	if (task.createdOn === null)
		task.createdOn = new Date();
	task.updatedOn = new Date();

	let copiedTask = Object.assign(new Task(), task);
	this._tasks[task.id] = copiedTask;

	this._chrome.storage.sync.set({tasks: this.serializeTasks(this._tasks)}, function(){
		callback(null, task);
	});
};

TaskRepository.prototype.fetchAll = function(callback){
	let tasks = [];
	for (taskId in this._tasks)
		tasks.push(this._tasks[taskId]);
	let orderedTasks = tasks.sort(function(a, b){
		return a.createdOn - b.createdOn;
	});
	return callback(null, {tasks: orderedTasks});
}

TaskRepository.prototype.fetchNextIncomplete = function(callback){
	this.fetchAll(function(error, result){
		for (task of result.tasks){
            if (!task.isCompleted())
                return callback(null, {task: task})
		}
		return callback(null, {task: null})
	});
}

TaskRepository.prototype.fetchAllComplete = function(callback){
	this.fetchAll(function(error, result){
		let completedTasks = [];
		for (task of result.tasks){
            if (task.isCompleted())
                completedTasks.push(task);
		}
		return callback(null, {tasks: completedTasks});
	});	
}


TaskRepository.prototype.fetch = function(taskId, callback){
	let task = this._tasks[taskId];
	if (task)
		return callback(task);
	return callback(null);
};

TaskRepository.prototype.delete = function(taskId, callback){
	delete this._tasks[taskId];
	this._chrome.storage.sync.set({tasks: this._tasks}, function(){
		callback(taskId);
	});
};

TaskRepository.prototype.serializeTasks = function(tasks){
	for (taskId in tasks){
		this.serializeTask(tasks[taskId]);
	}
	return tasks;
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
