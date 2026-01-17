import { getmenulist } from "@/api/user";
import ProTable, { ProColumnType } from "@/components/Table";
import { Menu } from "@/types/menu";
import { Button } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import NewAndEditForm from './new-edit-form';

const MenuList = () => {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRows, setSelectedRows] = React.useState<Menu[]>([]);
    const [editData, setEditData] = useState<Menu | null>(null);
    const [formOpen, setFormOpen] = useState(false);

    useEffect(() => {
        const getroles = async () => {
            try {
                setLoading(true);
                // 使用泛型指定返回数据类型
                const data = await getmenulist();
                setMenus(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getroles();
    }, []); // 空依赖数组表示仅在组件挂载时执行

    // 状态标签配置 1:目录 2:菜单 3:按钮 4:低代码页面
    const statusMapping = {
        1: {
            text: '目录',
            color: 'blue',
            // icon: <CheckCircleOutlined />
        },
        2: {
            text: '菜单',
            color: 'blue',
            // icon: <SyncOutlined spin />
        },
        3: {
            text: '按钮',
            color: 'blue',
            // icon: <SyncOutlined spin />
        },
        4: {
            text: '低代码页面',
            color: 'blue',
            // icon: <SyncOutlined spin />
        },
    };

    // 列定义
    const columns: ProColumnType<Menu>[] = [
        {
            title: '名称',
            dataIndex: 'title',
            width: 40,
        },
        {
            title: '类型',
            dataIndex: 'type',
            width: 40,
            valueType: 'status',
            statusProps: {
                mapping: statusMapping
            },
        },
        {
            title: '图标',
            dataIndex: 'icon',
            width: 40,
        },
        {
            title: '路径',
            dataIndex: 'path',
            width: 80,
        },
        {
            title: '文件路径',
            dataIndex: 'filepath',
            width: 80,
        },
        {
            title: '是否显示',
            dataIndex: 'show',
            width: 40,
            valueType: 'switch',
            switchProps: {
                checkedChildren: '启用',
                unCheckedChildren: '禁用',
                onChange: async (checked, record) => {
                    //await updateProductStatus(record.id, 'enabled', checked);
                }
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            valueType: 'action',
            fixed: 'right',
            width: 80,
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
    const handleRowSelectionChange = (_selectedKeys: any, selectedRows: React.SetStateAction<Menu[]>) => {
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
        // actionRef.current?.reload();

        setFormOpen(false);
        setEditData(null);
    };

    const add = () => {
        setEditData(null);
        setFormOpen(true);

    }


    return (
        <div>
            <ProTable<Menu>
                columns={columns}
                dataSource={menus}
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
                        <Button type="primary" onClick={add}>新增菜单</Button>
                    </div>
                }
                showIndex
                // scroll={{ y: 500 }}
                treeTable={{
                    childrenColumnName: 'children',
                    indentSize: 20,
                    defaultExpandAllRows: false,
                    defaultExpandedRowKeys: [1],
                    onExpand: (expanded, record) => {

                    }
                }}
            />
            <NewAndEditForm
                visible={formOpen}
                onOpenChange={open => !open && closeForm()}
                editData={editData}
                onSaveSuccess={saveHandle}
                curRecord={editData}
                onCancel={closeForm}
            />
        </div>

    )
}

export default MenuList