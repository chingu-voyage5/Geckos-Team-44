
describe("Task", function(){
	beforeEach(function(){
		this.task = new Task();
	});

	describe("Constructor", function(){
		it("should have id with default null", function(){
			expect(this.task.id).toEqual(null);		
		});

		it("should have title with default empty string", function(){
			expect(this.task.title).toEqual("");		
		});

		it("should have mode with default empty string", function(){
			expect(this.task.mode).toEqual("");
		});

		it("should have timeBlocks with default 1", function(){
			expect(this.task.timeBlocks).toEqual(1);
		});

		it("should have order with default -1", function(){
			expect(this.task.order).toEqual(-1);
		});

		it("should have createdOn with default null", function(){
			expect(this.task.createdOn).toEqual(null);
		});

		it("should have updatedOn with default null", function(){
			expect(this.task.updatedOn).toEqual(null);
		});

		it("should have completedOn with default null", function(){
			expect(this.task.completedOn).toEqual(null);
		});

		it("should have totalTimeSpent with default 0", function(){
			expect(this.task.totalTimeSpent).toEqual(0);
		});
	});

	describe("isCompleted", function(){
		it("should return false when completedOn is null", function(){
			expect(this.task.isCompleted()).toBe(false);
		})

		it("should return true when completedOn is Date", function(){
			this.task.completedOn = new Date();
			expect(this.task.isCompleted()).toBe(true);
		})
	});

	describe("setComplete", function(){
		it("should set completedOn to the current date", function(){
			let currentDate = new Date();
			this.task.setComplete();
			expect(this.task.completedOn.getDay()).toEqual(currentDate.getDay());
		});

		it("should set totalTimeSpent to timeBlocSize multipled by timeBlocks", function(){
			this.task.timeBlocks = 4
			let timeBlockSize = 15.0;
			this.task.setComplete(timeBlockSize);
			expect(this.task.totalTimeSpent).toEqual(60.0);
		})
	})
});