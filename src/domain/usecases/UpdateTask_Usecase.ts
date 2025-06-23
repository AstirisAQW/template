import { TaskEntity } from "../entities/TaskEntity";
import { TaskRepository } from "../repositories/TaskRepository";

export interface UpdateTaskParams {
    id: number;
    content: string;
}

export class UpdateTask_Usecase {
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(params: UpdateTaskParams): Promise<TaskEntity> {
        const taskToUpdate = new TaskEntity(params.id, params.content);
        return this.taskRepository.updateTask(taskToUpdate);
    }
}