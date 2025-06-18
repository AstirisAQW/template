import { TaskEntity } from "../entities/TaskEntity";
import { TaskRepository } from "../repositories/TaskRepository";

export interface UpdateTaskParams {
    id: number;
    title: string;
}

export class UpdateTaskUsecase {
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(params: UpdateTaskParams): Promise<TaskEntity> {
        const taskToUpdate = new TaskEntity(params.id, params.title);
        return this.taskRepository.updateTask(taskToUpdate);
    }
}