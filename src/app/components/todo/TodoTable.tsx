import React from 'react';
import { Table, Space, Button, Checkbox } from 'antd';
import type { TableColumnsType } from 'antd';
import { TaskEntity } from '../../../domain/entities/TaskEntity';

interface TodoTableProps {
    data?: TaskEntity[];
    onDelete?: (record: TaskEntity) => void;
    onUpdate?: (record: TaskEntity) => void;
    onToggleComplete?: (record: TaskEntity) => void;
}

function getColumns(
    onDelete?: (record: TaskEntity) => void,
    onUpdate?: (record: TaskEntity) => void,
    onToggleComplete?: (record: TaskEntity) => void
): TableColumnsType<TaskEntity> {
    return [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '80px',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Task',
            dataIndex: 'content',
            key: 'content',
            ellipsis: true,
            render: (text, record) => (
                <span style={{ textDecoration: record.completed ? 'line-through' : 'none', color: record.completed ? '#aaa' : 'inherit' }}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'completed',
            key: 'completed',
            width: 120,
            render: (completed: boolean, record: TaskEntity) => (
                <Checkbox
                    checked={completed}
                    onChange={() => onToggleComplete && onToggleComplete(record)}
                >
                    {completed ? 'Completed' : 'Pending'}
                </Checkbox>
            ),

            onFilter: (value, record) => record.completed === value,
        },
        {
            title: 'Action',
            key: 'action',
            width: 200,
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button
                            type="primary"
                            ghost
                            onClick={() => {
                                onUpdate && onUpdate(record);
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            danger
                            disabled={!record.completed}
                            onClick={() => {
                                onDelete && onDelete(record);
                            }}>
                            Delete
                        </Button>
                    </Space>
                );
            },
        },
    ];
}

function TodoTable({ data, onDelete, onUpdate, onToggleComplete }: TodoTableProps) {
    return (
        <Table
            rowKey="id"
            size="large"
            columns={getColumns(onDelete, onUpdate, onToggleComplete)}
            dataSource={data}
            bordered
            pagination={{ pageSize: 5 }}
        />
    );
}

export default TodoTable;