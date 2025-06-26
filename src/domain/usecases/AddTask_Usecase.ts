import { TaskEntity } from "../entities/TaskEntity";
import { TaskRepository } from "../repositories/TaskRepository";

export interface AddTaskParams{
    content: string;
}

export class AddTask_Usecase{
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository){
        this.taskRepository = taskRepository;
    }

    async execute(params: AddTaskParams): Promise<TaskEntity> {
        if (!params.content || params.content.trim() === ""){
            throw new Error ("Task content cannot be empty");
        }
        
        const taskToAdd = new TaskEntity(0, params.content);
        return this.taskRepository.addTask(taskToAdd);
    }
}