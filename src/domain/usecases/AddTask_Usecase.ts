import { TaskEntity } from "../entities/TaskEntity";
import { TaskRepository } from "../repositories/TaskRepository";

export interface AddTaskParams{
    title: string;
}

export class AddTask_Usecase{
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository){
        this.taskRepository = taskRepository;
    }

    async execute(params: AddTaskParams): Promise<TaskEntity> {
        const taskToAdd = new TaskEntity(0, params.title);
        return this.taskRepository.addTask(taskToAdd);
    }
}