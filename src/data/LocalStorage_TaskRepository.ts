import { TaskEntity } from "../domain/entities/TaskEntity";
import { TaskRepository } from "../domain/repositories/TaskRepository";

const LOCAL_STORAGE_KEY = 'tasks';

interface StoredTask { 
    id: number;
    content: string; 
    completed: boolean;
}

export class LocalStorageTaskRepository implements TaskRepository {
    
    private getTasksFromStorage(): TaskEntity[] {
        const tasksJson = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (tasksJson) {
            try {
                const parsedTasks = JSON.parse(tasksJson) as StoredTask[]; 
                return parsedTasks.map(task => new TaskEntity(task.id, task.content, task.completed === true));
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
        const maxId = Math.max(...tasks.map(task => typeof task.id === 'number' ? task.id : 0));
        return maxId + 1;
    }

    async addTask(task: TaskEntity): Promise<TaskEntity> {
        const currentTasks = this.getTasksFromStorage();
        const nextId = this.getNextId(currentTasks);
        const newTask = new TaskEntity(nextId, task.content, task.completed); 
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
        currentTasks[taskIndex] = new TaskEntity(taskToUpdate.id, taskToUpdate.content, taskToUpdate.completed);
        this.saveTasksToStorage(currentTasks);
        return currentTasks[taskIndex];
    }

    async getAllTasks(): Promise<TaskEntity[]> {
        return this.getTasksFromStorage();
    }

    async getTask(id: number): Promise<TaskEntity | undefined> {
        const currentTasks = this.getTasksFromStorage();
        return currentTasks.find(task => task.id === id);
    }
}