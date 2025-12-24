import { getrolelist } from '@/api/user';
import ProTable, { ProColumnType } from '@/components/Table/Table';
import { MenuType } from '@/types/menu';
import { Role } from '@/types/role';
import { Button } from 'antd';
import { t } from 'i18next';
import React, { useState, useEffect, useRef } from 'react';
import NewAndEditForm from './new-edit-form';
import { ActionType } from '@ant-design/pro-components';

const RoleList = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRows, setSelectedRows] = React.useState<Role[]>([]);
    const [editData, setEditData] = useState<Role | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const actionRef = useRef<ActionType>(null);

    useEffect(() => {
        const getroles = async () => {
            try {
                setLoading(true);
                // 使用泛型指定返回数据类型
                const data = await getrolelist();
                setRoles(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getroles();
    }, []); // 空依赖数组表示仅在组件挂载时执行

    // 列定义
    const columns: ProColumnType<Role>[] = [
        {
            title: '名称',
            dataIndex: 'name',
            width: 80,
        },
        {
            title: '操作',
            dataIndex: 'action',
            valueType: 'action',
            fixed: 'right',
            width: 100,
            actions: [
                // {
                //     key: 'view',
                //     text: '查看',
                //     // icon: <EyeOutlined />,
                //     type: 'link',
                //     onClick: (record) => {
                //         setEditData(record);
                //         setFormOpen(true);
                //     }
                // },
                {
                    key: 'edit',
                    text: '编辑',
                    // icon: <EditOutlined />,
                    type: 'link',
                    onClick: (record) => {
                        setEditData(record);
                        setFormOpen(true);
                    }
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
    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        console.log('表格变化:', { pagination, filters, sorter });
        // 这里可以发送API请求获取新数据
    };

    // 处理行选择
    const handleRowSelectionChange = (_selectedKeys: any, selectedRows: React.SetStateAction<Role[]>) => {
        setSelectedRows(selectedRows);
    };

    const openForm = () => {
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditData(null);
    };

    const saveHandle = () => {
        //actionRef.current?.reload();

        setFormOpen(false);
        setEditData(null);
    };

    const add = () => {
        setEditData(null);
        setFormOpen(true);

    }


    return (
        <>
            <ProTable<Role>
                columns={columns}
                dataSource={roles}
                loading={loading}
                pagination={{ pageSize: 10 }}
                rowKey="id"
                // rowSelection={{
                //     onChange: handleRowSelectionChange
                // }}
                bordered={false}
                onTableChange={handleTableChange}
                header={
                    <div>
                        <Button type="primary" onClick={add}>新增权限</Button>
                    </div>
                }
                showIndex
            // scroll={{ y: 500 }}
            />
            <NewAndEditForm
                onOpenChange={open => !open && closeForm()}
                editData={editData}
                onSaveSuccess={saveHandle}
                open={formOpen}
                title={editData ? t('wXpnewYo' /* 编辑 */) : t('VjwnJLPY' /* 新建 */)}
            />

        </>
    )
}

export default RoleList;