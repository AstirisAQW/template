Exercise 1
==========================================================================================
Objectives:
- To be able to learn the `domain` of the Clean Architecture
- To be able to create a class of *Task* `entity`
- To be able to create a class of *Task* `repository`

Task Entity
-----------
This entity will have the following properties:
- `id`
- `title`

Task Repository
---------------
This repository should be able to:
- `addTask()`
- `removeTask()`
- `updateTask()`
- `getAllTasks()`
- `getTask()`
    
Exercise 2
==========================================================================================
Objectives:
- To be able to learn the `data` of the Clean Architecture
- To be able to create a class implementing Task `repository` from the `domain`
    - In-memory implementation
    - localStorage implementation

Note: there will be two data repositories

Task Repository
---------------
This repository should be able to:
- `addTask()`
- `removeTask()`
- `updateTask()`
- `getAllTasks()`
- `getTask()`

Exercise 3
==========================================================================================
Objectives:
- To be able to learn how `use cases` is useful to the Clean Architecture 
- To be able to create `use case` classes for the repository:
    - `add_task_usecase`
    - `remove_task_usecase`
    - `update_task_usecase`
    - `get_all_tasks_usecase`
    - `get_task_usecase`

Task Repository
---------------
This repository should be able to:
- `addTask()`
- `removeTask()`
- `updateTask()`
- `getAllTasks()`
- `getTask()`

Exercise 4
==========================================================================================
Objectives:
- To be able to how to use `use cases`
- Rewrite all repository functions under `app` and use the following `usecases` together with the data repository
    - `add_task_usecase`
    - `remove_task_usecase`
    - `update_task_usecase`
    - `get_all_tasks_usecase`
    - `get_task_usecase`
- Must be able to switch back-and-forth to use `in-memory` or `localStorage` data repositories 

Exercise 5
==========================================================================================
Objectives:
- To be able to know how to use `redux` and `redux-toolkit`
- Setup `redux`, `redux-toolkit`, and `redux-thunk`
    - `createStore()`
    - `combineReducers()`
    - `applyMiddleware(thunk)`
- Write `redux` actions, types, reducers
    - `task.actions.ts`
    - `task.reducers.ts`
    - `task.types.ts`
- Write `redux-toolkit` actions, types, reducers
    - `task.slice.ts`

