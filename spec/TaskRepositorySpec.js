
chromeMock = {
	inMemoryStore: {},
	storage: {
		sync: {
			set: function(keyValue, callback){
				Object.keys(keyValue).forEach(function(key){
					chromeMock.inMemoryStore[key] = JSON.stringify(keyValue[key]);
				});
			},
			get: function(keys, callback){
				let result = {};
				for (key in keys) {
					let value = chromeMock.inMemoryStore[key];
					if (value !== undefined)
						result[key] = JSON.parse(value);
				}
				callback(result);
			}
		}
	}
}

describe("TaskRepository", function(){
	beforeEach(function(){
		this.taskRepository = new TaskRepository(new ChromeStorage(chromeMock.storage)); 
		this.task = new Task();
		this.task.title = "test";
	});

	describe("save", function(){
		it("should save task", function(){
			this.taskRepository.save(this.task);
			expect(this.taskRepository._tasks[this.task.id].title).toEqual("test");
		});

		it("should save a copied task that cannot be modified by original task changes", function(){
			this.taskRepository.save(this.task);
			this.task.title = "new title";
			expect(this.taskRepository._tasks[this.task.id].title).toEqual("test");
		})

		it("should call set in chrome storage", function(){
			spyOn(this.taskRepository._storage, "set");
			this.taskRepository.save(this.task);
			expect(this.taskRepository._storage.set).toHaveBeenCalled();
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