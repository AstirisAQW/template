import React, { useState, useEffect, useCallback } from 'react';
import 'antd/dist/reset.css'; // If you're using Ant Design styling
import { Button, Input, Typography, Row, Col, notification, Spin } from 'antd';
import TodoTable from '../components/todo/TodoTable'; // Reusing TodoTable
import { TaskEntity } from '../../domain/entities/TaskEntity';

// Import our task use cases from the service
import {
  addTaskUsecase,
  getAllTasksUsecase,
  removeTaskUsecase,
  updateTaskUsecase, // Import if you add update functionality later
} from '../services/taskServices'; // Correct path to your service file

function SinglePage() {
  const [taskTitle, setTaskTitle] = useState("");
  const [tasks, setTasks] = useState<TaskEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // For loading state

  // Fetch all tasks when the component mounts
  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedTasks = await getAllTasksUsecase.execute();
      setTasks(fetchedTasks);
    } catch (error: any) {
      console.error("Failed to load tasks:", error);
      notification.error({
        message: 'Failed to load tasks',
        description: error.message || 'Could not retrieve tasks.',
      });
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies other than the use case itself, which is stable

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleOnChangeTaskTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.target.value);
  };

  const handleSubmitTask = async () => {
    if (!taskTitle.trim()) {
      notification.error({
        message: 'Unable to submit task',
        description: 'Please input the title of the Task.',
      });
      return;
    }

    setIsLoading(true); // Indicate loading for add operation
    try {
      // The AddTaskUsecase expects params like { title: string }
      const newTaskEntity = await addTaskUsecase.execute({ title: taskTitle });
      setTasks(prevTasks => [...prevTasks, newTaskEntity]); // Add to local state
      setTaskTitle(""); // Clear input
      notification.success({
        message: 'Task added successfully!',
      });
    } catch (error: any) {
      console.error("Failed to add task:", error);
      notification.error({
        message: 'Failed to add task',
        description: error.message || 'Could not save the new task.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskToDelete: TaskEntity) => {
    setIsLoading(true); // Indicate loading for delete operation
    try {
      await removeTaskUsecase.execute(taskToDelete.id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDelete.id)); // Remove from local state
      notification.success({
        message: 'Task deleted successfully!',
      });
    } catch (error: any) {
      console.error("Failed to delete task:", error);
      notification.error({
        message: 'Failed to delete task',
        description: error.message || 'Could not remove the task.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If you decide to add an update feature, it would look something like this:
   const handleUpdateTask = async (taskToUpdate: TaskEntity, newTitle: string) => {
   setIsLoading(true);
   try {
     const updatedTask = await updateTaskUsecase.execute({ id: taskToUpdate.id, title: newTitle });
       setTasks(prevTasks => prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
       notification.success({ message: 'Task updated successfully!' });
     } catch (error: any) {
       console.error("Failed to update task:", error);
       notification.error({ message: 'Failed to update task', description: error.message });
     } finally {
       setIsLoading(false);
     }
   };

  return (
    <div style={{ padding: 20 }}>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>
            Task Management (Clean Architecture)
          </Typography.Title>

          <Input.Group compact style={{ marginBottom: 20 }}>
            <Input
              style={{ width: 'calc(100% - 100px)' }} // Adjusted width
              value={taskTitle}
              onChange={handleOnChangeTaskTitle}
              placeholder="Enter task title"
              onPressEnter={handleSubmitTask} // Allow submit on Enter
              disabled={isLoading}
            />
            <Button type="primary" onClick={handleSubmitTask} loading={isLoading} style={{ width: 100 }}>
              Add Task
            </Button>
          </Input.Group>

          {isLoading && tasks.length === 0 ? ( // Show spinner only on initial load
             <div style={{ textAlign: 'center', margin: '20px 0' }}><Spin size="large" /></div>
          ) : (
            <TodoTable 
              data={tasks} 
              onDelete={handleDeleteTask} 
              // Pass an onUpdate handler if you implement update in TodoTable
            />
          )}
          {tasks.length === 0 && !isLoading && (
            <Typography.Text style={{ textAlign: 'center', display: 'block' }}>
              No tasks yet. Add one above!
            </Typography.Text>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default SinglePage;