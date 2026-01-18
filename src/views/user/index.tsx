import { getuserlist } from "@/api/user";
import ProTable, { PaginationConfig, ProColumnType } from "@/components/Table";
import { User } from "@/types/auth/types";
import { Button, PaginationProps } from "antd";
import React, { useEffect, useState } from "react";

const UserList = () => {
    const [loading, setLoading] = React.useState(false);
    const [selectedRows, setSelectedRows] = React.useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [pageSize, setpageSize] = useState<number>(10);
    const [currentPage, setcurrentPage] = useState<number>(1);

    const getUsers = async () => {
        try {
            setLoading(true);
            // 使用泛型指定返回数据类型
            const data = await getuserlist({ page: currentPage, page_size: pageSize });
            setUsers(data.data.data);
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
    }, []); // 空依赖数组表示仅在组件挂载时执行

    // 状态标签配置
    const statusMapping = {
        0: {
            text: '正常',
            color: 'green',
            // icon: <CheckCircleOutlined />
        },
        1: {
            text: '禁用',
            color: 'red',
            // icon: <SyncOutlined spin />
        },
    };

    // 列定义
    const columns: ProColumnType<User>[] = [
        {
            title: '登录名',
            dataIndex: 'username',
            sorter: true,
            width: 80,
        },
        {
            title: '昵称',
            dataIndex: 'name',
            sorter: true,
            width: 80,
        },
        {
            title: '头像',
            dataIndex: 'avatar',
            width: 60,
            valueType: 'avatar',
            avatarProps: {
                srcField: 'avatar'
            },
        },
        {
            title: '角色',
            dataIndex: 'role',
            width: 80,
            valueType: 'tags',
            tagProps: {
                color: (tag) => {
                    const colors: Record<string, string> = {
                        'user': 'blue',
                        'admin': 'orange',
                    };
                    return colors[tag] || 'default';
                },
                maxCount: 2
            },
        },
        {
            title: '状态',
            dataIndex: 'status',
            sorter: true,
            width: 40,
            valueType: 'status',
            statusProps: {
                mapping: statusMapping
            },
        },
        {
            title: '操作',
            dataIndex: 'action',
            valueType: 'action',
            fixed: 'right',
            width: 100,
            actions: [
                {
                    key: 'view',
                    text: '查看',
                    // icon: <EyeOutlined />,
                    type: 'link',
                    onClick: (record) => console.log('查看', record)
                },
                {
                    key: 'edit',
                    text: '编辑',
                    // icon: <EditOutlined />,
                    type: 'link',
                    onClick: (record) => console.log('编辑', record)
                },
                {
                    key: 'delete',
                    text: '删除',
                    // icon: <DeleteOutlined />,
                    type: 'link',
                    danger: true,
                    confirm: '确定删除吗？',
                    onClick: (record) => console.log('删除', record)
                }
            ]
        },
    ];

    // 处理表格变化
    const handleTableChange = (pagination: PaginationConfig, filters: any, sorter: any) => {
        //console.log('表格变化:', { pagination, filters, sorter });
        const pg = pagination as PaginationProps
        // 这里可以发送API请求获取新数据
        setcurrentPage(pg.current == null ? 10 : pg.current)
        setpageSize(pg.pageSize == null ? 10 : pg.pageSize)
        getUsers()
    };

    // 处理行选择
    const handleRowSelectionChange = (_selectedKeys: any, selectedRows: React.SetStateAction<User[]>) => {
        setSelectedRows(selectedRows);
    };

    return (
        <ProTable<User>
            columns={columns}
            dataSource={users}
            loading={loading}
            pagination={{ current: currentPage, pageSize: pageSize }}
            rowKey="id"
            // rowSelection={{
            //     onChange: handleRowSelectionChange
            // }}
            bordered={false}
            onTableChange={handleTableChange}
            header={
                <div>
                    {/* <Button type="primary">新增用户</Button> */}
                </div>
            }
            // footer={
            //     <div>共 {data.length} 条记录</div>
            // }
            showIndex
        // scroll={{ y: 500 }}
        />
    );
}

export default UserList