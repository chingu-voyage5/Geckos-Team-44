

describe("TaskRepository", function(){
	beforeEach(function(){
		this.chrome = chromeMock;
		this.setSpy = spyOn(this.chrome.storage.sync, "set");
		this.getSpy = spyOn(this.chrome.storage.sync, "get");
		this.removeSpy = spyOn(this.chrome.storage.sync, "remove");
		this.taskRepository = new TaskRepository(this.chrome);
		this.observer = {callback: function(error, response){}};
        spyOn(this.observer, "callback");  
		this.task = new Task();
		this.task.title = "test";
	});

	describe("save", function(){
		it("should save task to in memory and chrome stortage", function(){
			this.taskRepository.save(this.task, function(){});
			expect(this.taskRepository._tasks[this.task.id].title).toEqual("test");
			expect(this.chrome.storage.sync.set).toHaveBeenCalled();
		});

		it("should save a copied task that cannot be modified by original task changes", function(){
			this.taskRepository.save(this.task);
			this.task.title = "new title";
			expect(this.taskRepository._tasks[this.task.id].title).toEqual("test");
		})

		it("should call set in chrome storage", function(){
			this.taskRepository.save(this.task);
			expect(this.chrome.storage.sync.set).toHaveBeenCalled();
		});

		it("should return a saved task with an uuid id", function(){
			this.taskRepository.save(this.task);
			expect(isUUID(this.task.id)).toBe(true);
		});

		it("should add date to createdOn if null", function(){
			this.taskRepository.save(this.task);
			expect(this.task.createdOn).not.toEqual(null);
		});

		it("should add date to updatedOn on each save", function(){
			this.taskRepository.save(this.task);
			let firstDate = this.task.updatedOn;
			jasmine.clock().install();
			jasmine.clock().mockDate();
			jasmine.clock().tick(1);
			this.taskRepository.save(this.task);
			let secondDate = this.task.updatedOn;	
			expect(firstDate.getTime()).not.toEqual(secondDate.getTime());
			jasmine.clock().uninstall();
		});

		it("should update previously saved objects", function(){
			this.taskRepository.save(this.task);
			this.taskRepository.save(this.task);	
			expect(Object.keys(this.taskRepository._tasks).length).toEqual(1);	
		});
	});

	describe("fetch", function(){
		it("should return in-memory object if found", function(){
			let task = new Task();
			task.id = "1";
			this.taskRepository._tasks[task.id] = task;	
			this.taskRepository.fetch(task.id, this.observer.callback);
			expect(this.observer.callback).toHaveBeenCalledWith(
				jasmine.objectContaining({id: task.id})
			);
		});
	});

	describe("serializeTask", function(){
		it("should seralize date objects to json", function(){
			let task = new Task();
			task.createdOn = new Date("2018-06-10");
			let seralizedTask = this.taskRepository.serializeTask(task);
			expect(seralizedTask.createdOn).toEqual("2018-06-10T00:00:00.000Z");
			expect(typeof seralizedTask.createdOn === "string").toBe(true);
		})
	});

	describe("unserializeTask", function(){
		it("should unseralize date from json to object", function(){
			let task = new Task();
			task.createdOn = new Date("2018-06-10");
			let seralizedTask = this.taskRepository.serializeTask(task);
			let unserializedTask = this.taskRepository.unserializeTask(seralizedTask);
			expect(unserializedTask.createdOn).toEqual(new Date("2018-06-10"));
		})
	});
});