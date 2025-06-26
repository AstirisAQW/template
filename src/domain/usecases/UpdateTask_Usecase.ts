import { error } from "console";
import { TaskEntity } from "../entities/TaskEntity";
import { TaskRepository } from "../repositories/TaskRepository";

export interface UpdateTaskParams {
    id: number;
    content?: string;
    completed?: boolean;
}

export class UpdateTask_Usecase {
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(params: UpdateTaskParams): Promise<TaskEntity> {
        const existingTask = await this.taskRepository.getTask(params.id);
        if (!existingTask) {
            throw new Error(`Task with id ${params.id} not found for update.`);
        }

        let updatedContent = existingTask.content;
        if (params.content !== undefined) {
            if (params.content.trim() === "") {
                throw new Error("Task content cannot be empty.");
            }
            updatedContent = params.content;
        }

        const updatedCompleted = params.completed !== undefined ? params.completed : existingTask.completed;

        const taskToUpdate = new TaskEntity(params.id, updatedContent, updatedCompleted);
        return this.taskRepository.updateTask(taskToUpdate);
    }
}