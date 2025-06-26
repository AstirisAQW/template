import React, { useState, useEffect, useCallback } from 'react';
import 'antd/dist/reset.css';
import './SinglePage.css';
import { Button, Input, Typography, Row, Col, notification, Spin, Modal, Radio, Space } from 'antd';
import TodoTable from '../components/todo/TodoTable';
import { TaskEntity } from '../../domain/entities/TaskEntity';
import { GetAllTask_Service, RemoveTask_Service, UpdateTask_Service, AddTask_Service} from "../services/taskServices";

type FilterStatus = 'all' | 'pending' | 'completed';

function SinglePage() {
  const [taskContent, setTaskContent] = useState("");
  const [tasks, setTasks] = useState<TaskEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<FilterStatus>('all');

  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [currentEditingTask, setCurrentEditingTask] = useState<TaskEntity | null>(null);
  const [editedTaskContent, setEditedTaskContent] = useState<string>("");

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedTasks = await GetAllTask_Service.execute();
      setTasks(fetchedTasks.sort((a,b) => a.id - b.id));
    } catch (error: any) {
      console.error("Failed to load tasks:", error);
      notification.error({
        message: 'Failed to load tasks',
        description: error.message || 'Could not retrieve tasks.',
        placement: 'bottomRight',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleOnChangeTaskContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskContent(e.target.value);
  };

  const handleAddTask = async () => {
    // if (!taskContent.trim()) {
    //   notification.warning({
    //     message: 'Input required',
    //     description: 'Task content cannot be empty.',
    //     placement: 'bottomRight',
    //   });
    //   return;
    // }

    setIsLoading(true);
    try {
      const newTaskEntity = await AddTask_Service.execute({ content: taskContent });
      setTasks(prevTasks => [...prevTasks, newTaskEntity].sort((a,b) => a.id - b.id));
      setTaskContent("");
      notification.success({
        message: 'Task added successfully!',
        placement: 'bottomRight'
      });
    } catch (error: any) {
      console.error("Failed to add task:", error);
      notification.error({
        message: 'Failed to add task',
        description: error.message || 'Could not save the new task.',
        placement: 'bottomRight',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskToDelete: TaskEntity) => {
    // if (!taskToDelete.completed) {
    //   notification.warning({
    //     message: 'Cannot Delete Task',
    //     description: 'Task must be marked as completed before it can be deleted.',
    //     placement: 'bottomRight',
    //   });
    //   return;
    // }

    setIsLoading(true);
    try {
      await RemoveTask_Service.execute(taskToDelete.id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDelete.id));
      notification.success({
        message: 'Task deleted successfully!',
        placement: 'bottomRight',
      });
    } catch (error: any) {
      console.error("Failed to delete task:", error);
      notification.error({
        message: 'Failed to delete task',
        description: error.message || 'Could not remove the task.',
        placement: 'bottomRight',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCompleteTask = async (taskToToggle: TaskEntity) => {
    setIsLoading(true);
    try {
      const updatedTask = await UpdateTask_Service.execute({
        id: taskToToggle.id,
        completed: !taskToToggle.completed,
      });
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task)).sort((a,b) => a.id - b.id)
      );
      notification.success({
        message: `Task marked as ${updatedTask.completed ? 'completed' : 'pending'}!`,
        placement: 'bottomRight',
      });
    } catch (error: any) {
      console.error("Failed to update task status:", error);
      notification.error({
        message: 'Failed to update task status',
        description: error.message || 'Could not update the task status.',
        placement: 'bottomRight',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTaskContent = async () => {
    // if (!currentEditingTask || !editedTaskContent.trim()) {
    //   notification.warning({
    //     message: 'Input required',
    //     description: 'Please ensure the task content is not empty.',
    //     placement: 'bottomRight',
    //   });
    //   return;
    // }
    if (!currentEditingTask) {
        notification.warning({
            message: 'No task selected',
            description: 'Please select a task to edit.',
            placement: 'bottomRight',
        });
        return;
    }

    setIsLoading(true);
    try {
      const updatedTask = await UpdateTask_Service.execute({
        id: currentEditingTask.id,
        content: editedTaskContent,
      });
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task)).sort((a,b) => a.id - b.id)
      );
      notification.success({
        message: 'Task content updated successfully!',
        placement: 'bottomRight'});
      setIsEditModalVisible(false);
      setCurrentEditingTask(null);
      setEditedTaskContent("");
    } catch (error: any) {
      console.error("Failed to update task content:", error);
      notification.error({ 
        message: 'Failed to update task content',
        placement: 'bottomRight', 
        description: error.message || 'Could not update the task content.'
    });
    } finally {
      setIsLoading(false);
    }
  };

  const showEditModal = (taskToEdit: TaskEntity) => {
    setCurrentEditingTask(taskToEdit);
    setEditedTaskContent(taskToEdit.content);
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setCurrentEditingTask(null);
    setEditedTaskContent("");
  };

  const handleDeleteAllCompletedTasks = async () => {
    const completedTasks = tasks.filter(task => task.completed);
    if (completedTasks.length === 0) {
      notification.info({
        message: 'No Completed Tasks',
        description: 'There are no completed tasks to delete.',
        placement: 'bottomRight',
      });
      return;
    }

    Modal.confirm({
        title: 'Delete All Completed Tasks?',
        content: `Are you sure you want to delete ${completedTasks.length} completed task(s)?`,
        okText: 'Delete All',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
            setIsLoading(true);
            try {
              await Promise.all(completedTasks.map(task => RemoveTask_Service.execute(task.id)));
              setTasks(prevTasks => prevTasks.filter(task => !task.completed).sort((a,b) => a.id - b.id));
              notification.success({
                message: 'All completed tasks deleted successfully!',
                placement: 'bottomRight',
              });
            } catch (error: any) {
              console.error("Failed to delete all completed tasks:", error);
              notification.error({
                message: 'Failed to delete completed tasks',
                description: error.message || 'Could not remove all completed tasks.',
                placement: 'bottomRight',
              });
            } finally {
              setIsLoading(false);
            }
        }
    });
  };


  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="single-page-container">
      <div className="page-header">
        <Typography.Title level={2} className="page-header-title">
          Enhanced TaskList
        </Typography.Title>
      </div>

      <Row justify="center">
        <Col xs={24} style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Input.Group compact className="add-task-input-group">
            <Input
              style={{ width: 'calc(100% - 100px)' }}
              value={taskContent}
              onChange={handleOnChangeTaskContent}
              placeholder="Enter task content"
              onPressEnter={handleAddTask}
              disabled={isLoading}
            />
            <Button type="primary" onClick={handleAddTask} loading={isLoading} style={{ width: 100 }}>
              Add Task
            </Button>
          </Input.Group>

          <Space style={{ marginTop: 16, marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Radio.Group onChange={(e) => setFilter(e.target.value)} value={filter}>
              <Radio.Button value="all">All</Radio.Button>
              <Radio.Button value="pending">Pending</Radio.Button>
              <Radio.Button value="completed">Completed</Radio.Button>
            </Radio.Group>
            <Button
              danger
              onClick={handleDeleteAllCompletedTasks}
              loading={isLoading}
              disabled={tasks.filter(t => t.completed).length === 0 || isLoading}
            >
              Delete All Completed
            </Button>
          </Space>

          {isLoading && tasks.length === 0 && filter === 'all' ? (
             <div className="spinner-container"><Spin size="large" /></div>
          ) : (
            <TodoTable
              data={filteredTasks} 
              onDelete={handleDeleteTask}
              onUpdate={showEditModal} 
              onToggleComplete={handleToggleCompleteTask}
            />
          )}
          {filteredTasks.length === 0 && !isLoading && (
            <Typography.Text className="no-tasks-message" style={{ display: 'block', textAlign: 'center', marginTop: 20 }}>
              {tasks.length === 0 && filter === 'all' ? 'No tasks yet.' : `No tasks match the filter: "${filter}".`}
            </Typography.Text>
          )}
        </Col>
      </Row>

      {currentEditingTask && (
        <Modal
          title="Edit Task Content"
          visible={isEditModalVisible}
          onOk={handleUpdateTaskContent}
          onCancel={handleEditModalCancel}
          confirmLoading={isLoading}
          okText="Save Changes"
        >
          <Input
            value={editedTaskContent}
            onChange={(e) => setEditedTaskContent(e.target.value)}
            placeholder="Enter new task content"
            onPressEnter={handleUpdateTaskContent}
          />
        </Modal>
      )}
    </div>
  );
}

export default SinglePage;