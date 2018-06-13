

function createTestTask(title, id, completed=false){
    let task = new Task(title);
    task.createdOn = new Date();
    task.updatedOn = new Date();
    task.id = id;
    if (completed)
        task.setComplete();
    return task;
}

describe("TaskService", function() {
    beforeEach(function(){
        this.chrome = chromeMock;
        this.taskRepository = new TaskRepository(this.chrome); 
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
                jasmine.objectContaining({message:["Title cannot be blank"]}), null); 
        });

        it("should not allow title less than 3 characters", function(){
            let request = {title: "te", timeBlocks: 1, mode: "work"}
            this.taskService.addTask(request, this.observer.callback);
            expect(this.observer.callback).toHaveBeenCalledWith(
                jasmine.objectContaining({message:["Title cannot be less than 3 characters"]}), null);
        });

        it("should not allow title more than 50 characters", function(){
            let request = {title: "Lorem ipsum dolor amet woke freegan blue bottle, pug", timeBlocks: 1, mode: "work"};
            this.taskService.addTask(request, this.observer.callback);
            expect(this.observer.callback).toHaveBeenCalledWith(
                jasmine.objectContaining({message:["Title cannot be more than 50 characters"]}), null);
        });

        it("should not allow invalid mode", function(){
            let request = {title: "test", timeBlocks: 1, mode: "invalid"};
            this.taskService.addTask(request, this.observer.callback);
            expect(this.observer.callback).toHaveBeenCalledWith(
                jasmine.objectContaining({message:["Mode must be either: 'work' or 'play'"]}), null);
        });

        it("should not allow timeBlocks less than 1", function(){
            let request = {title: "test", timeBlocks: 0, mode: "work"};
            this.taskService.addTask(request, this.observer.callback);
            expect(this.observer.callback).toHaveBeenCalledWith(
                jasmine.objectContaining({message:["Time Blocks cannot be less than 1"]}), null);
        });

        it("should not allow timeBlocks more than 4", function(){
            let request = {title: "test", timeBlocks: 5, mode: "work"};
            this.taskService.addTask(request, this.observer.callback);
            expect(this.observer.callback).toHaveBeenCalledWith(
                jasmine.objectContaining({message:["Time Blocks cannot be more than 4"]}), null);
        });
    });

    describe("listTasks", function(){
        describe("Given no saved tasks", function(){
            it("should return no tasks", function(){
                this.taskService.listTasks(this.observer.callback); 
                expect(this.observer.callback).toHaveBeenCalledWith(
                    null, {tasks: []});
            });  
        });

        describe("Given multiple saved tasks", function(){
            beforeEach(function(){
                let task1 = this.taskRepository.serializeTask(createTestTask("test1", "1"));
                let task2 = this.taskRepository.serializeTask(createTestTask("test2", "2"));
                let task3 = this.taskRepository.serializeTask(createTestTask("test3", "3", true));
                spyOn(this.chrome.storage.sync, "get").and.callFake(function(keys, callback){
                    callback(null, {[task1.id]: task1, [task2.id]: task2, [task3.id]: task3});
                })
            });

            it("should only return tasks that are not completed", function(){
                this.taskService.listTasks(this.observer.callback);
                expect(this.observer.callback).toHaveBeenCalledWith(
                    null, {tasks: jasmine.arrayContaining([
                        jasmine.objectContaining({id: "1", title: "test1"}),
                        jasmine.objectContaining({id: "2", title: "test2"}),
                    ])});
            });
        });
    });
});