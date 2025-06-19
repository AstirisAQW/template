import { TaskRepository } from "../repositories/TaskRepository";

export class RemoveTask_Usecase {
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(id: number): Promise<void> {
        return this.taskRepository.removeTask(id);
    }
}