import { TaskEntity } from "../entities/TaskEntity";

export interface TaskRepository {
    addTask(task: TaskEntity): Promise<TaskEntity>;
    removeTask(id: number): Promise<void>;
    updateTask(task: TaskEntity): Promise<TaskEntity>;
    getAllTasks(): Promise<TaskEntity[]>;
    getTask(id: number): Promise<TaskEntity | undefined>;
}