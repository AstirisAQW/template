import React, { useState, useEffect, useCallback } from 'react';
import 'antd/dist/reset.css';
import './SinglePage.css';
import { Button, Input, Typography, Row, Col, notification, Spin, Modal } from 'antd'; // Added Modal
import TodoTable from '../components/todo/TodoTable';
import { TaskEntity } from '../../domain/entities/TaskEntity';
import { GetAllTask_Service, RemoveTask_Service, UpdateTask_Service, AddTask_Service} from "../services/taskServices";


function SinglePage() {
  const [taskTitle, setTaskTitle] = useState("");
  const [tasks, setTasks] = useState<TaskEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State for Edit Modal
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [currentEditingTask, setCurrentEditingTask] = useState<TaskEntity | null>(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState<string>("");

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedTasks = await GetAllTask_Service.execute();
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
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleOnChangeTaskTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.target.value);
  };

  const handleSubmitTask = async () => {
    if (!taskTitle.trim()) {
      notification.warning({ // Changed to warning for non-critical user error
        message: 'Input required',
        description: 'Please enter a title for the task.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const newTaskEntity = await AddTask_Service.execute({ title: taskTitle });
      setTasks(prevTasks => [...prevTasks, newTaskEntity]);
      setTaskTitle("");
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
    setIsLoading(true);
    try {
      await RemoveTask_Service.execute(taskToDelete.id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDelete.id));
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

   const handleUpdateTask = async () => { // Modified to use state for editing
    if (!currentEditingTask || !editedTaskTitle.trim()) {
      notification.warning({
        message: 'Input required',
        description: 'Please ensure the task title is not empty.',
      });
      return;
    }
    setIsLoading(true);
    try {
      const updatedTask = await UpdateTask_Service.execute({ id: currentEditingTask.id, title: editedTaskTitle });
      setTasks(prevTasks => prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
      notification.success({ message: 'Task updated successfully!' });
      setIsEditModalVisible(false); // Close modal on success
      setCurrentEditingTask(null);
    } catch (error: any) {
      console.error("Failed to update task:", error);
      notification.error({ message: 'Failed to update task', description: error.message || 'Could not update the task.' });
    } finally {
      setIsLoading(false);
    }
   };

  // Handler for opening the edit modal
  const showEditModal = (taskToEdit: TaskEntity) => {
    setCurrentEditingTask(taskToEdit);
    setEditedTaskTitle(taskToEdit.title);
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setCurrentEditingTask(null);
    setEditedTaskTitle(""); // Reset title
  };

  return (
    <div className="single-page-container">
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Typography.Title level={2} className="page-title">
            Task Management (Clean Architecture)
          </Typography.Title>

          <Input.Group compact className="add-task-input-group">
            <Input
              style={{ width: 'calc(100% - 100px)' }}
              value={taskTitle}
              onChange={handleOnChangeTaskTitle}
              placeholder="Enter task title"
              onPressEnter={handleSubmitTask}
              disabled={isLoading}
            />
            <Button type="primary" onClick={handleSubmitTask} loading={isLoading} style={{ width: 100 }}>
              Add Task
            </Button>
          </Input.Group>

          {isLoading && tasks.length === 0 ? (
             <div className="spinner-container"><Spin size="large" /></div>
          ) : (
            <TodoTable
              data={tasks}
              onDelete={handleDeleteTask}
              onUpdate={showEditModal} // Pass the handler to open edit modal
            />
          )}
          {tasks.length === 0 && !isLoading && (
            <Typography.Text className="no-tasks-message">
              No tasks yet. Add one above!
            </Typography.Text>
          )}
        </Col>
      </Row>

      {/* Edit Task Modal */}
      {currentEditingTask && (
        <Modal
          title="Edit Task"
          visible={isEditModalVisible}
          onOk={handleUpdateTask} // This is the actual update submission
          onCancel={handleEditModalCancel}
          confirmLoading={isLoading} // Show loading state on OK button
          okText="Save Changes"
        >
          <Input
            value={editedTaskTitle}
            onChange={(e) => setEditedTaskTitle(e.target.value)}
            placeholder="Enter new task title"
            onPressEnter={handleUpdateTask}
          />
        </Modal>
      )}
    </div>
  );
}

export default SinglePage;