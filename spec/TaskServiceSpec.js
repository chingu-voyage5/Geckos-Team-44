

describe("TaskService", function() {
    beforeEach(function(){
        this.taskRepository = new TaskRepository(chromeMock.storage); 
        this.taskService = new TaskService(this.taskRepository);   
    });

    describe("addTask", function(){
        it("should return saved task on valid request", function(){
            let request = {title: "test", timeBlocks: 1, mode: "work"};
            let response = this.taskService.addTask(request);   
            expect(response.task.title).toEqual("test");
            expect(response.task.id).not.toEqual(null);
            expect(response.task.createdOn).not.toEqual(null);
        });

        it("should not allow a blank title", function(){
            let request = {title: "", timeBlocks: 1, mode: "work"}
            let taskService = this.taskService;
            expect(function(){ taskService.addTask(request)}).toThrow(
                ["Title cannot be blank"]);
        });

        it("should not allow title less than 3 characters", function(){
            let request = {title: "te", timeBlocks: 1, mode: "work"}
            let taskService = this.taskService;
            expect(function(){ taskService.addTask(request)}).toThrow(
                ["Title cannot be less than 3 characters"]);
        });

        it("should not allow title more than 50 characters", function(){
            let request = {title: "Lorem ipsum dolor amet woke freegan blue bottle, pug", timeBlocks: 1, mode: "work"};
            let taskService = this.taskService;
            expect(function(){ taskService.addTask(request)}).toThrow(
                ["Title cannot be more than 50 characters"]);
        });

        it("should not allow invalid mode", function(){
            let request = {title: "test", timeBlocks: 1, mode: "invalid"};
            let taskService = this.taskService;
            expect(function(){ taskService.addTask(request)}).toThrow(
                ["Mode must be either: 'work' or 'play'"]);
        });

        it("should not allow timeBlocks less than 1", function(){
            let request = {title: "test", timeBlocks: 0, mode: "work"};
            let taskService = this.taskService;
            expect(function(){ taskService.addTask(request)}).toThrow(
                ["Time Blocks cannot be less than 1"]);
        });

        it("should not allow timeBlocks more than 4", function(){
            let request = {title: "test", timeBlocks: 5, mode: "work"};
            let taskService = this.taskService;
            expect(function(){ taskService.addTask(request)}).toThrow(
                ["Time Blocks cannot be more than 4"]);
        });
    });
});