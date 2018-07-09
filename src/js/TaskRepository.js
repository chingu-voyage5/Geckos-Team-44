

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

	let copiedTask = Object.assign(new Task(), task);
	this._tasks[task.id] = copiedTask;

	this._chrome.storage.sync.set({[task.id]: this.serializeTask(copiedTask)}, function(){
		callback(null, task);
	});
};

TaskRepository.prototype.fetchAll = function(callback){
	let taskRepository = this;
	this._chrome.storage.sync.get(null, function(result){
		let tasks = [];
		for (key in result){
			let task = result[key];
			if (task.hasOwnProperty("name") && task.name == "Task"){
				tasks.push(taskRepository.unserializeTask(task));
				let copiedTask = Object.assign(new Task(), task);
				taskRepository._tasks[task.id] = copiedTask;
			}	
		}
		let ordedTasks = tasks.sort(function(a, b){
			return a.createdOn - b.createdOn;
		});
		callback(null, {tasks: ordedTasks});
	});
}

TaskRepository.prototype.fetchNextIncomplete = function(callback){
	this.fetchAll(function(error, result){
		for (task of result.tasks){
            if (task.completedOn === null)
                return callback(null, {task: task})
		}
		return callback(null, {task: null})
	});
}

TaskRepository.prototype.fetch = function(taskId, callback){
	let unserializeTask = this.unserializeTask;
	let task = this._tasks[taskId];
	if (task)
		return callback(unserializeTask(task));
	this._chrome.storage.sync.get([taskId], function(result){
		task = result[taskId];
		if (task)
			callback(unserializeTask(task));
		else
			callback(null);
	});
};

TaskRepository.prototype.delete = function(taskId, callback){
	this._chrome.storage.sync.remove([taskId]);
	delete this._tasks[taskId];
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
