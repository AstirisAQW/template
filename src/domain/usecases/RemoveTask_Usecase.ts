import { TaskRepository } from "../repositories/TaskRepository";

export class RemoveTask_Usecase {
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(id: number): Promise<void> {
        const taskToRemove = await this.taskRepository.getTask(id);

        if (!taskToRemove) {
            throw new Error(`Task with id ${id} not found, cannot remove.`);
        }

        if (!taskToRemove.completed) {
            throw new Error("Task must be marked as completed before it can be deleted.");
        }
        
        return this.taskRepository.removeTask(id);
    }
}