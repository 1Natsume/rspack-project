import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableProps, Pagination, Spin, Checkbox, Popconfirm, Button, Badge, Tag, Avatar, Image, Switch } from 'antd';
import type { PaginationProps } from 'antd';
import type { SorterResult, FilterValue, TableRowSelection } from 'antd/es/table/interface';
import './ProTable.css';
const apiUrl = '';

// 表格数据项基础类型
export type RecordType = {
    id: string | number;
    [key: string]: any;
};

// 分页配置
export type PaginationConfig = PaginationProps | false;

// 值类型定义
export type ValueType =
    | 'text'
    | 'avatar'
    | 'image'
    | 'tags'
    | 'status'
    | 'action'
    | 'switch';

// 状态标签配置
export type StatusTagConfig = {
    [key: string]: {
        text: string;
        color: string;
        icon?: React.ReactNode;
    };
};

// 操作按钮配置
export type ActionButtonConfig<T> = {
    key: string;
    text: string;
    icon?: React.ReactNode;
    type?: 'primary' | 'dashed' | 'link' | 'text' | 'default';
    danger?: boolean;
    confirm?: string;
    onClick?: (record: T, e?: React.MouseEvent) => void;
};

// Switch按钮配置
export type SwitchConfig<T> = {
    checkedValue?: any;
    unCheckedValue?: any;
    checkedChildren?: React.ReactNode;
    unCheckedChildren?: React.ReactNode;
    onChange?: (checked: boolean, record: T) => Promise<void> | void;
    disabled?: boolean | ((record: T) => boolean);
    loading?: boolean | ((record: T) => boolean);
};

// 层级展示配置
export type TreeTableConfig<T> = {
    childrenColumnName?: string;
    indentSize?: number;
    expandIcon?: (props: { expanded: boolean; record: T; onExpand: (record: T) => void }) => React.ReactNode;
    defaultExpandAllRows?: boolean;
    defaultExpandedRowKeys?: (string | number)[];
    onExpand?: (expanded: boolean, record: T) => void;
};

// 列定义扩展
export type ProColumnType<T> = {
    title: string;
    dataIndex: string;
    key?: string;
    sorter?: boolean;
    filters?: { text: string; value: any }[];
    render?: (value: any, record: T, index: number) => React.ReactNode;
    valueType?: ValueType;
    width?: number | string;
    fixed?: 'left' | 'right';
    ellipsis?: boolean;
    hideInTable?: boolean;
    // 头像列配置
    avatarProps?: {
        size?: number | 'large' | 'small' | 'default';
        shape?: 'circle' | 'square';
        srcField?: string;
    };
    // 图片列配置
    imageProps?: {
        width?: number;
        height?: number;
        preview?: boolean;
        multiple?: boolean;
        maxCount?: number;
    };
    // 标签列配置
    tagProps?: {
        color?: string | ((value: any) => string);
        maxCount?: number;
    };
    // 状态列配置
    statusProps?: {
        mapping: StatusTagConfig;
    };
    // 操作列配置
    actions?: ActionButtonConfig<T>[];
    // Switch列配置
    switchProps?: SwitchConfig<T>;
    // 层级列配置
    treeColumn?: boolean;
};

// 组件Props
export interface ProTableProps<T extends RecordType> {
    columns: ProColumnType<T>[];
    dataSource: T[];
    loading?: boolean;
    pagination?: PaginationConfig;
    rowKey?: string | ((record: T) => string);
    rowSelection?: {
        selectedRowKeys: (string | number)[];
        onChange?: (selectedKeys: (string | number)[], selectedRows: T[]) => void;
        getCheckboxProps?: (record: T) => Record<string, boolean>;
    };
    onTableChange?: (
        pagination: PaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<T> | SorterResult<T>[]
    ) => void;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    scroll?: { x?: number | true; y?: number };
    size?: 'small' | 'middle' | 'large';
    bordered?: boolean;
    showIndex?: boolean;
    indexColumn?: {
        title?: string;
        width?: number;
    };
    expandable?: TableProps<T>['expandable'];
    rowClassName?: (record: T, index: number) => string;
    onSwitchChange?: (record: T, field: string, value: any) => void;
    // 层级展示配置
    treeTable?: TreeTableConfig<T>;
}

const ProTable = <T extends RecordType>(props: ProTableProps<T>) => {
    const {
        columns,
        dataSource = [],
        loading = false,
        pagination: propPagination = { position: ['bottomRight'] },
        rowKey = 'id',
        rowSelection,
        onTableChange,
        header,
        footer,
        scroll,
        size = 'middle',
        bordered = true,
        showIndex = false,
        indexColumn = { title: '序号', width: 30 },
        expandable,
        rowClassName,
        onSwitchChange,
        treeTable,
    } = props;

    // 状态管理
    const [internalPagination, setInternalPagination] = useState<PaginationConfig>(() => {
        if (propPagination === false) return false;
        return {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `共 ${total} 条`,
            ...propPagination
        };
    });

    const [internalFilters, setInternalFilters] = useState<Record<string, FilterValue | null>>({});
    const [internalSorter, setInternalSorter] = useState<SorterResult<T> | SorterResult<T>[]>({});
    const [switchLoading, setSwitchLoading] = useState<Record<string, boolean>>({});
    const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>(
        treeTable?.defaultExpandedRowKeys || []
    );

    // 处理分页变化
    const handlePaginationChange: PaginationProps['onChange'] = (page, pageSize) => {
        if (internalPagination) {
            const newPagination = { ...internalPagination, current: page, pageSize };
            setInternalPagination(newPagination);
            onTableChange?.(newPagination, internalFilters, internalSorter);
        }
    };

    // 处理表格变化（排序、筛选）
    const handleTableChange: TableProps<T>['onChange'] = (pagination, filters, sorter) => {
        setInternalFilters(filters);
        setInternalSorter(sorter);

        // 如果是受控分页，则使用外部传入的分页配置
        const paginationConfig = propPagination === false ? false : {
            ...internalPagination,
            ...pagination
        };

        onTableChange?.(paginationConfig, filters, sorter);
    };


    // 处理Switch变化
    const handleSwitchChange = async (checked: boolean, record: T, dataIndex: string, switchProps?: SwitchConfig<T>) => {
        const switchKey = `${record.id}-${dataIndex}`;

        try {
            setSwitchLoading(prev => ({ ...prev, [switchKey]: true }));

            // 如果有自定义的onChange处理函数
            if (switchProps?.onChange) {
                await switchProps.onChange(checked, record);
            } else {
                // 默认行为：更新数据值并触发回调
                const { checkedValue = true, unCheckedValue = false } = switchProps || {};
                const newValue = checked ? checkedValue : unCheckedValue;

                // 触发外部回调
                onSwitchChange?.(record, dataIndex, newValue);
            }

            //message.success('状态更新成功');
        } catch (error) {
            console.error('Switch状态更新失败:', error);
            //message.error('状态更新失败');
        } finally {
            setSwitchLoading(prev => ({ ...prev, [switchKey]: false }));
        }
    };

    // 处理展开/折叠
    const handleExpand = (expanded: boolean, record: T) => {
        const key = typeof rowKey === 'function' ? rowKey(record) : record[rowKey as string];

        if (expanded) {
            setExpandedRowKeys(prev => [...prev, key]);
        } else {
            setExpandedRowKeys(prev => prev.filter(k => k !== key));
        }

        treeTable?.onExpand?.(expanded, record);
    };

    //自定义展开图标
    const customExpandIcon = (props: { expanded: boolean; record: T; onExpand: (record: T) => void }) => {
        if (treeTable?.expandIcon) {
            return treeTable.expandIcon(props);
        }

        return props.expanded ? (
            // <DownOutlined
            //     onClick={e => {
            //         e.stopPropagation();
            //         props.onExpand(props.record);
            //     }}
            // />
            <div></div>
        ) : (
            // <RightOutlined
            //     onClick={e => {
            //         e.stopPropagation();
            //         props.onExpand(props.record);
            //     }}
            // />
            <div></div>
        );
    };

    // 处理列渲染
    const processedColumns = useMemo(() => {
        return columns
            .filter(col => !col.hideInTable)
            .map(col => {
                // 如果用户自定义了render，直接返回
                if (col.render) return col;

                const { valueType, avatarProps, imageProps, tagProps, statusProps, actions, switchProps, treeColumn } = col;

                // 根据valueType生成渲染函数
                let render: ProColumnType<T>['render'] | undefined;

                switch (valueType) {
                    case 'avatar':
                        render = (_, record) => {
                            const src = avatarProps?.srcField ? record[avatarProps.srcField] : _;
                            return (
                                <div className="avatar-cell">
                                    <Avatar
                                        size={avatarProps?.size || 'default'}
                                        shape={avatarProps?.shape || 'circle'}
                                        src={apiUrl + src}
                                    // icon={!src ? <UserOutlined /> : undefined}
                                    />
                                    {/* <span className="avatar-name">{_}</span> */}
                                </div>
                            );
                        };
                        break;

                    case 'image':
                        render = (value) => {
                            if (!value) return null;

                            const { multiple = false, maxCount = 3, width = 60, height = 60, preview = true } = imageProps || {};

                            if (Array.isArray(value) && multiple) {
                                const visibleImages = value.slice(0, maxCount);
                                const moreCount = value.length - maxCount;

                                return (
                                    <div className="image-group">
                                        {visibleImages.map((img, idx) => (
                                            <Image
                                                key={idx}
                                                src={img}
                                                width={width}
                                                height={height}
                                                preview={preview}
                                                className="table-image"
                                            />
                                        ))}
                                        {moreCount > 0 && (
                                            <div className="image-more">+{moreCount}</div>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <Image
                                    src={value}
                                    width={width}
                                    height={height}
                                    preview={preview}
                                    className="table-image"
                                />
                            );
                        };
                        break;

                    case 'tags':
                        render = (value) => {
                            if (!value) return null;
                            const tags = Array.isArray(value) ? value : [value];
                            const maxCount = tagProps?.maxCount || 3;
                            const visibleTags = tags.slice(0, maxCount);
                            const moreCount = tags.length - maxCount;

                            return (
                                <div className="tag-group">
                                    {visibleTags.map((tag, idx) => (
                                        <Tag
                                            key={idx}
                                            color={typeof tagProps?.color === 'function'
                                                ? tagProps.color(tag)
                                                : tagProps?.color}
                                        >
                                            {tag}
                                        </Tag>
                                    ))}
                                    {moreCount > 0 && (
                                        <Tag className="more-tag">+{moreCount}</Tag>
                                    )}
                                </div>
                            );
                        };
                        break;

                    case 'status':
                        render = (value) => {
                            if (!statusProps || !statusProps.mapping[value]) return null;
                            const { text, color, icon } = statusProps.mapping[value];
                            return (
                                // <Badge
                                //     color={color}
                                //     text={text}
                                //     className="status-badge"
                                // >
                                //     {icon}
                                // </Badge>
                                <Tag
                                    color={color}
                                >
                                    {text}
                                </Tag>
                            );
                        };
                        break;

                    case 'switch':
                        render = (value, record) => {
                            const {
                                checkedValue = true,
                                unCheckedValue = false,
                                // checkedChildren = <CheckCircleOutlined />,
                                // unCheckedChildren = <CloseCircleOutlined />,
                                disabled,
                                loading: switchLoadingProp
                            } = switchProps || {};

                            const switchKey = `${record.id}-${col.dataIndex}`;
                            const isLoading = switchLoading[switchKey] ||
                                (typeof switchLoadingProp === 'function' ? switchLoadingProp(record) : switchLoadingProp);

                            const isDisabled = typeof disabled === 'function' ? disabled(record) : disabled;
                            const isChecked = value === checkedValue;

                            return (
                                <Switch
                                    checked={isChecked}
                                    // checkedChildren={checkedChildren}
                                    // unCheckedChildren={unCheckedChildren}
                                    loading={isLoading}
                                    disabled={isDisabled}
                                    onChange={(checked) => handleSwitchChange(checked, record, col.dataIndex, switchProps)}
                                />
                            );
                        };
                        break;

                    case 'action':
                        render = (_, record) => {
                            if (!actions || actions.length === 0) return null;

                            return (
                                <div className="action-buttons">
                                    {actions.map((action) => {
                                        const btn = (
                                            <Button
                                                key={action.key}
                                                type={action.type || 'link'}
                                                icon={action.icon}
                                                danger={action.danger}
                                                onClick={(e) => action.onClick?.(record, e)}
                                                className="action-btn"
                                            >
                                                {action.text}
                                            </Button>
                                        );

                                        return action.confirm ? (
                                            <Popconfirm
                                                key={action.key}
                                                title={action.confirm}
                                                onConfirm={(e) => action.onClick?.(record, e)}
                                                okText="确定"
                                                cancelText="取消"
                                            >
                                                {btn}
                                            </Popconfirm>
                                        ) : btn;
                                    })}
                                </div>
                            );
                        };
                        break;

                    default:
                        // 默认文本渲染
                        render = (value) => <span className="table-text">{value}</span>;
                }

                // 如果是树形列，添加缩进和展开图标
                if (treeColumn && treeTable) {
                    const originalRender = render;
                    render = (value, record, index) => {
                        const hasChildren = record.children && record.children.length > 0;
                        const level = getNodeLevel(record, dataSource, treeTable.childrenColumnName || 'children');
                        const indent = level * (treeTable.indentSize || 15);

                        return (
                            <div className="tree-cell" style={{ paddingLeft: indent }}>
                                {hasChildren && (
                                    <span className="expand-icon">
                                        {customExpandIcon({
                                            expanded: expandedRowKeys.includes(record.id),
                                            record,
                                            onExpand: (rec) => handleExpand(!expandedRowKeys.includes(rec.id), rec)
                                        })}
                                    </span>
                                )}
                                {!hasChildren && <span className="expand-icon-placeholder" />}
                                {originalRender ? originalRender(value, record, index) : <span className="table-text">{value}</span>}
                            </div>
                        );
                    };
                }

                return {
                    ...col,
                    render: col.render || render
                };
            });
    }, [columns]);

    // 获取节点层级
    const getNodeLevel = (node: T, data: T[], childrenColumnName: string = 'children', level: number = 0): number => {
        for (const item of data) {
            if (item.id === node.id) {
                return level;
            }
            if (item[childrenColumnName] && Array.isArray(item[childrenColumnName])) {
                const childLevel = getNodeLevel(node, item[childrenColumnName], childrenColumnName, level + 1);
                if (childLevel !== -1) {
                    return childLevel;
                }
            }
        }
        return -1;
    };

    // 添加序号列
    const columnsWithIndex = useMemo(() => {
        if (!showIndex) return processedColumns;

        const indexColumnDef: ProColumnType<T> = {
            title: indexColumn.title || '序号',
            dataIndex: '_index',
            key: '_index',
            width: indexColumn.width || 70,
            fixed: 'left',
            render: (_, __, index) => {
                if (internalPagination) {
                    const { current = 1, pageSize = 10 } = internalPagination;
                    return (current - 1) * pageSize + index + 1;
                }
                return index + 1;
            }
        };

        return [indexColumnDef, ...processedColumns];
    }, [showIndex, indexColumn, processedColumns, internalPagination]);

    // 处理行选择
    const rowSelectionConfig: TableRowSelection<T> | undefined = rowSelection
        ? {
            selectedRowKeys: rowSelection.selectedRowKeys || [],
            onChange: (_selectedRowKeys, selectedRows) => {
                rowSelection.onChange?.(rowSelection.selectedRowKeys, selectedRows);
            },
            getCheckboxProps: rowSelection.getCheckboxProps
        }
        : undefined;

    // 合并滚动配置
    const mergedScroll = scroll || { x: 'max-content' };

    return (
        <div className="pro-table-container">
            {header && <div className="pro-table-header">{header}</div>}

            <Spin spinning={loading}>
                <Table<T>
                    columns={columnsWithIndex}
                    dataSource={dataSource}
                    rowKey={rowKey}
                    pagination={false}
                    onChange={handleTableChange}
                    rowSelection={rowSelectionConfig}
                    scroll={mergedScroll}
                    size={size}
                    bordered={bordered}
                    expandable={expandable}
                    rowClassName={rowClassName}
                    className="pro-table"
                />
            </Spin>

            {internalPagination && (
                <div className="pro-table-pagination">
                    <Pagination
                        {...internalPagination}
                        total={dataSource.length}
                        onChange={handlePaginationChange}
                        onShowSizeChange={handlePaginationChange}
                    />
                </div>
            )}

            {footer && <div className="pro-table-footer">{footer}</div>}
        </div>
    );
};

export default ProTable;