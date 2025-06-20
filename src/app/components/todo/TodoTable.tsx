import React from 'react';
import { Table, Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

export interface TodoType {
    id: number;
    title: string;
}

interface TodoTableProps {
    data?: TodoType[];
    onDelete?: (record: TodoType) => void;
    onUpdate?: (record: TodoType) => void;
}

function getColumns(
    onDelete?: (record: TodoType) => void,
    onUpdate?: (record: TodoType) => void
)   : ColumnsType<TodoType> {
    return [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '80',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Action',
            key: 'action',
            width: 200,
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button
                            type = "primary"
                            ghost
                            onClick={()=>{
                                onUpdate && onUpdate(record);
                            }}
                        >
                            Update
                        </Button>
                        <Button
                            danger
                            onClick={() => {
                                onDelete && onDelete(record)
                        }}>
                            Delete
                        </Button>
                    </Space>
                );
            },
        },
    ];
}

function TodoTable({ data, onDelete, onUpdate }: TodoTableProps) {
    return (
        <Table
            rowKey="id"
            size="large"
            columns={getColumns(onDelete, onUpdate)}
            dataSource={data}
        />
    );
}

export default TodoTable;
