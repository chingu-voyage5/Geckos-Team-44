

describe("TaskService", function() {
    beforeEach(function(){
        this.taskRepository = new TaskRepository(chromeMock); 
        this.taskService = new TaskService(this.taskRepository);   
        this.observer = {callback: function(error, response){}};
        spyOn(this.observer, "callback");  
    });

    describe("addTask", function(){
        it("should return saved task on valid request", function(){
            let request = {title: "test", timeBlocks: 1, mode: "work"};
            this.taskService.addTask(request, this.observer.callback); 
            expect(this.observer.callback).toHaveBeenCalled();
        });

        it("should not allow a blank title", function(){
            let request = {title: "", timeBlocks: 1, mode: "work"}
            this.taskService.addTask(request, this.observer.callback);
            expect(this.observer.callback).toHaveBeenCalledWith(
                {name: "InvalidRequestError", 
                message:["Title cannot be blank"]}, null); 
        });

        it("should not allow title less than 3 characters", function(){
            let request = {title: "te", timeBlocks: 1, mode: "work"}
            this.taskService.addTask(request, this.observer.callback);
            expect(this.observer.callback).toHaveBeenCalledWith(
                {name: "InvalidRequestError", 
                message: ["Title cannot be less than 3 characters"]}, null);
        });

        it("should not allow title more than 50 characters", function(){
            let request = {title: "Lorem ipsum dolor amet woke freegan blue bottle, pug", timeBlocks: 1, mode: "work"};
            this.taskService.addTask(request, this.observer.callback);
            expect(this.observer.callback).toHaveBeenCalledWith(
                {name: "InvalidRequestError", 
                message: ["Title cannot be more than 50 characters"]}, null);
        });

        it("should not allow invalid mode", function(){
            let request = {title: "test", timeBlocks: 1, mode: "invalid"};
            this.taskService.addTask(request, this.observer.callback);
            expect(this.observer.callback).toHaveBeenCalledWith(
                {name: "InvalidRequestError", 
                message: ["Mode must be either: 'work' or 'play'"]}, null);
        });

        it("should not allow timeBlocks less than 1", function(){
            let request = {title: "test", timeBlocks: 0, mode: "work"};
            this.taskService.addTask(request, this.observer.callback);
            expect(this.observer.callback).toHaveBeenCalledWith(
                {name: "InvalidRequestError", 
                message: ["Time Blocks cannot be less than 1"]}, null);
        });

        it("should not allow timeBlocks more than 4", function(){
            let request = {title: "test", timeBlocks: 5, mode: "work"};
            this.taskService.addTask(request, this.observer.callback);
            expect(this.observer.callback).toHaveBeenCalledWith(
                {name: "InvalidRequestError", 
                message: ["Time Blocks cannot be more than 4"]}, null);
        });
    });
});