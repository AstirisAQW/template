import { TaskEntity } from "../domain/entities/TaskEntity";
import { TaskRepository } from "../domain/repositories/TaskRepository";

export class InMemoryTaskRepository implements TaskRepository {
    private tasks: TaskEntity[] = [];
    private nextId: number = 1;

    async addTask(task: TaskEntity): Promise<TaskEntity> {
        const newTask = new TaskEntity(this.nextId++, task.content, task.completed);
        this.tasks.push(newTask);
        return newTask;
    }

    async removeTask(id: number): Promise<void> {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    async updateTask(taskToUpdate: TaskEntity): Promise<TaskEntity> {
        const taskIndex = this.tasks.findIndex(task => task.id === taskToUpdate.id);
        if (taskIndex === -1) {
            throw new Error(`Task with id ${taskToUpdate.id} not found`);
        }
        this.tasks[taskIndex] = new TaskEntity(taskToUpdate.id, taskToUpdate.content,taskToUpdate.completed);
        return this.tasks[taskIndex];
    }

    async getAllTasks(): Promise<TaskEntity[]> {
        return [...this.tasks];
    }

    async getTask(id: number): Promise<TaskEntity | undefined> {
        return this.tasks.find(task => task.id === id);
    }
}