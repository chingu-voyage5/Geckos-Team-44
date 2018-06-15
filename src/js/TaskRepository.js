

function TaskRepository(chrome){
	this._chrome = chrome;
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

	this._chrome.storage.sync.set({[task.id]: this.serializeTask(copiedTask)}, function(){
		callback(null, task);
	});
};

TaskRepository.prototype.fetchAll = function(callback){
	let unserializeTask = this.unserializeTask;
	this._chrome.storage.sync.get(null, function(result){
		let tasks = [];
		for (key in result)
			if (result[key].hasOwnProperty("name") && result[key].name == "Task")
				tasks.push(unserializeTask(result[key]));
		callback(null, {tasks: tasks});
	});
}

TaskRepository.prototype.fetch = function(taskId, callback){
	let unserializeTask = this.unserializeTask;
	this._chrome.storage.sync.get([taskId], function(result){
		let task = result[taskId];
		if (task)
			callback(unserializeTask(task));
		else
			callback(null);
	});
};

TaskRepository.prototype.delete = function(taskId, callback){
	this._chrome.storage.sync.remove([taskId]);
	callback(taskId);
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
