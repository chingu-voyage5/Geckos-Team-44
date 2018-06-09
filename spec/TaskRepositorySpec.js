
var chromeMock = {
	storage: {
		sync: {
			set: function(keyValue, callback){},
		}
	}
}

describe("TaskRepository", function(){
	beforeEach(function(){
		this.taskRepository = new TaskRepository(chromeMock.storage); 
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
			spyOn(this.taskRepository._state.sync, "set");
			this.taskRepository.save(this.task);
			expect(this.taskRepository._state.sync.set).toHaveBeenCalled();
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
			sleep(1);
			this.taskRepository.save(this.task);
			let secondDate = this.task.updatedOn;	
			expect(firstDate.getTime()).not.toEqual(secondDate.getTime());
		});

		it("should update previously saved objects", function(){
			this.taskRepository.save(this.task);
			this.taskRepository.save(this.task);	
			expect(Object.keys(this.taskRepository._tasks).length).toEqual(1);	
		});
	});
});