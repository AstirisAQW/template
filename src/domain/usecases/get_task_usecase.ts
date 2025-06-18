import { TaskEntity } from "../entities/TaskEntity";
import { TaskRepository } from "../repositories/TaskRepository";

export class GetTaskUsecase {
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(id: number): Promise<TaskEntity | undefined> {
        return this.taskRepository.getTask(id);
    }
}