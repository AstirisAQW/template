import { TaskRepository } from "../../domain/repositories/TaskRepository";
import { InMemoryTaskRepository } from "../../data/InMemoryTaskRepository";
import { LocalStorageTaskRepository } from "../../data/LocalStorageTaskRepository";

import { AddTaskUsecase } from "../../domain/usecases/add_task_usecase";
import { GetAllTasksUsecase } from "../../domain/usecases/get_all_task_usecase";
import { RemoveTaskUsecase } from "../../domain/usecases/remove_task_usecase";
import { UpdateTaskUsecase } from "../../domain/usecases/update_task_usecase";
import { GetTaskUsecase } from "../../domain/usecases/get_task_usecase";
import { TaskEntity } from "../../domain/entities/TaskEntity";

// --- Configuration for Switching Repository ---
// Change this to false to use InMemoryTaskRepository
const USE_LOCAL_STORAGE_FOR_TASKS = true;
// ---------------------------------------------

let taskRepositoryInstance: TaskRepository;

if (USE_LOCAL_STORAGE_FOR_TASKS) {
    taskRepositoryInstance = new LocalStorageTaskRepository();
    console.log("Using LocalStorageTaskRepository for tasks.");
} else {
    taskRepositoryInstance = new InMemoryTaskRepository();
    console.log("Using InMemoryTaskRepository for tasks.");
}

// Instantiate use cases with the chosen repository instance
export const addTaskUsecase = new AddTaskUsecase(taskRepositoryInstance);
export const getAllTasksUsecase = new GetAllTasksUsecase(taskRepositoryInstance);
export const removeTaskUsecase = new RemoveTaskUsecase(taskRepositoryInstance);
export const updateTaskUsecase = new UpdateTaskUsecase(taskRepositoryInstance); // We'll prepare it even if UI doesn't use it yet
export const getTaskUsecase = new GetTaskUsecase(taskRepositoryInstance); // We'll prepare it

// Helper type for params, can also be defined in usecase files
export type AddTaskParams = { title: string };
export type UpdateTaskParams = { id: number; title: string };






