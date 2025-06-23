import { TaskEntity } from "../domain/entities/TaskEntity";
import { TaskRepository } from "../domain/repositories/TaskRepository";

const LOCAL_STORAGE_KEY = 'tasks';

export class LocalStorageTaskRepository implements TaskRepository {
    
    private getTasksFromStorage(): TaskEntity[] {
        const tasksJson = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (tasksJson) {
            try {
                // Parse and ensure they are TaskEntity instances
                const parsedTasks = JSON.parse(tasksJson) as Array<{id: number, title: string}>;
                return parsedTasks.map(task => new TaskEntity(task.id, task.title));
            } catch (error) {
                console.error("Error parsing tasks from localStorage", error);
                return [];
            }
        }
        return [];
    }

    private saveTasksToStorage(tasks: TaskEntity[]): void {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }

    private getNextId(tasks: TaskEntity[]): number {
        if (tasks.length === 0) {
            return 1;
        }
        return Math.max(...tasks.map(task => task.id)) + 1;
    }

    async addTask(task: TaskEntity): Promise<TaskEntity> {
        const currentTasks = this.getTasksFromStorage();
        const nextId = this.getNextId(currentTasks);
        // We use the title from the input task, but generate a new ID
        const newTask = new TaskEntity(nextId, task.content); 
        currentTasks.push(newTask);
        this.saveTasksToStorage(currentTasks);
        return newTask;
    }

    async removeTask(id: number): Promise<void> {
        let currentTasks = this.getTasksFromStorage();
        currentTasks = currentTasks.filter(task => task.id !== id);
        this.saveTasksToStorage(currentTasks);
    }

    async updateTask(taskToUpdate: TaskEntity): Promise<TaskEntity> {
        const currentTasks = this.getTasksFromStorage();
        const taskIndex = currentTasks.findIndex(task => task.id === taskToUpdate.id);
        if (taskIndex === -1) {
            throw new Error(`Task with id ${taskToUpdate.id} not found in localStorage`);
        }
        currentTasks[taskIndex] = taskToUpdate;
        this.saveTasksToStorage(currentTasks);
        return taskToUpdate;
    }

    async getAllTasks(): Promise<TaskEntity[]> {
        return this.getTasksFromStorage();
    }

    async getTask(id: number): Promise<TaskEntity | undefined> {
        const currentTasks = this.getTasksFromStorage();
        return currentTasks.find(task => task.id === id);
    }
}