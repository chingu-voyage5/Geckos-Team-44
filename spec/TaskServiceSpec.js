

function createTestTask(title, id, completed=false){
    let task = new Task(title, "work", 1);
    task.createdOn = new Date();
    task.updatedOn = new Date();
    task.id = id;
    if (completed)
        task.setComplete(15.0);
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

    describe("editTask", function(){
        beforeEach(function(){
            let task = this.taskRepository.serializeTask(createTestTask("test", "1"));
            this.chrome.storage.sync.set({[task.id]: task});
        });

        it("should return TaskNotFoundError if task not found", function(){
            let request = {id: "notFound", title: "test updated", timeBlocks: 1, mode: "work"};
            this.taskService.editTask(request, this.observer.callback);
            expect(this.observer.callback).toHaveBeenCalledWith(
                jasmine.objectContaining({message:"Task not found"}), null)
        });
    });

    describe("deleteTask", function(){
        beforeEach(function(){
            this.task = this.taskRepository.serializeTask(createTestTask("test", "1"));
            this.chrome.storage.sync.set({[this.task.id]: this.task});
        });

        it("should return TaskNotFoundError if task not found", function(){
            let request = {id: "notFound"};
            this.taskService.deleteTask(request, this.observer.callback);
            expect(this.observer.callback).toHaveBeenCalledWith(
                jasmine.objectContaining({message:"Task not found"}), null)
        });
    });
});