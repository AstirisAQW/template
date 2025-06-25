import { TaskRepository } from "../../domain/repositories/TaskRepository";
import { InMemoryTaskRepository } from "../../data/InMemory_TaskRepository";
import { LocalStorageTaskRepository } from "../../data/LocalStorage_TaskRepository";

import { AddTask_Usecase } from "../../domain/usecases/AddTask_Usecase";
import { GetAllTask_Usecase } from "../../domain/usecases/GetAllTask_Usecase";
import { RemoveTask_Usecase } from "../../domain/usecases/RemoveTask_Usecase";
import { UpdateTask_Usecase } from "../../domain/usecases/UpdateTask_Usecase";
import { GetTask_Usecase } from "../../domain/usecases/GetTask_Usecase";

// --- Configuration for Switching Repository ---

let taskRepositoryInstance: TaskRepository = new LocalStorageTaskRepository();
// let taskRepositoryInstance: TaskRepository = new InMemoryTaskRepository();


// Instantiate use cases with the chosen repository instance
export const AddTask_Service = new AddTask_Usecase(taskRepositoryInstance);
export const GetAllTask_Service = new GetAllTask_Usecase(taskRepositoryInstance);
export const RemoveTask_Service = new RemoveTask_Usecase(taskRepositoryInstance);
export const UpdateTask_Service = new UpdateTask_Usecase(taskRepositoryInstance);
export const GetTask_Service = new GetTask_Usecase(taskRepositoryInstance);

// Param types are typically imported from their respective use_case files
// to ensure consistency and avoid redefinition.
// e.g., import { AddTaskParams } from "../../domain/usecases/AddTask_Usecase";
// e.g., import { UpdateTaskParams } from "../../domain/usecases/UpdateTask_Usecase";
// Removed local re-definitions of AddTaskParams and UpdateTaskParams as they are defined (and exported) in usecase files.