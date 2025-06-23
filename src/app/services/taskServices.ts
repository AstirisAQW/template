import { TaskRepository } from "../../domain/repositories/TaskRepository";
import { InMemoryTaskRepository } from "../../data/InMemory_TaskRepository";
import { LocalStorageTaskRepository } from "../../data/LocalStorage_TaskRepository";

import { AddTask_Usecase } from "../../domain/usecases/AddTask_Usecase";
import { GetAllTask_Usecase } from "../../domain/usecases/GetAllTask_Usecase";
import { RemoveTask_Usecase } from "../../domain/usecases/RemoveTask_Usecase";
import { UpdateTask_Usecase } from "../../domain/usecases/UpdateTask_Usecase";
import { GetTask_Usecase } from "../../domain/usecases/GetTask_Usecase";

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
export const AddTask_Service = new AddTask_Usecase(taskRepositoryInstance);
export const GetAllTask_Service = new GetAllTask_Usecase(taskRepositoryInstance);
export const RemoveTask_Service = new RemoveTask_Usecase(taskRepositoryInstance);
export const UpdateTask_Service = new UpdateTask_Usecase(taskRepositoryInstance); // We'll prepare it even if UI doesn't use it yet
export const GetTask_Service = new GetTask_Usecase(taskRepositoryInstance); // We'll prepare it

// Helper type for params, can also be defined in usecase files
export type AddTaskParams = { content: string };
export type UpdateTaskParams = { id: number; content: string };






