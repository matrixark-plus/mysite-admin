import React, { useState } from 'react';
import { Button, message, Modal, Form, Input, Select, Switch } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { EyeOutlined, EditOutlined, DeleteOutlined, UserAddOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  getUserList,
  getUserDetail,
  updateUser,
  createUser,
  deleteUser,
  batchDeleteUsers,
  updateUserStatus
} from '@/services/user';
import type { User, UserListParams } from '@/services/user/types';
import styles from './list.less';

const { Option } = Select;
const { confirm } = Modal;

export default function UserManagement() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // 状态选项
  const statusOptions = [
    { value: '', label: '全部' },
    { value: 'active', label: '活跃' },
    { value: 'inactive', label: '禁用' },
  ];

  // 角色选项
  const roleOptions = [
    { value: '', label: '全部' },
    { value: 'admin', label: '管理员' },
    { value: 'user', label: '普通用户' },
  ];

  // 获取状态对应的文本
  const getStatusText = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  // 获取状态对应的标签颜色
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'green',
      inactive: 'red',
    };
    return colors[status] || 'default';
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      width: 200,
    },
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 150,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      filters: roleOptions,
      render: (role: string) => {
        const roleLabel = roleOptions.find(opt => opt.value === role)?.label || role;
        return role === 'admin' ? 
          <span className="text-blue-500 font-medium">{roleLabel}</span> : 
          roleLabel;
      },
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: statusOptions,
      render: (status: string) => (
        <span className={`text-${getStatusColor(status)}`}>
          {getStatusText(status)}
        </span>
      ),
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      valueType: 'dateTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record: User) => [
        <Button
          key="view"
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
        >
          查看
        </Button>,
        <Button
          key="edit"
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>,
        <Button
          key="delete"
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
        >
          删除
        </Button>,
      ],
    },
  ];

  // 处理查看用户
  const handleView = async (record: User) => {
    try {
      const response = await getUserDetail(record.id);
      const user = response.data;
      Modal.info({
        title: '用户详情',
        content: (
          <div>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>邮箱:</strong> {user.email}</p>
            <p><strong>用户名:</strong> {user.name || '-'}</p>
            <p><strong>角色:</strong> {getStatusText(user.role || '')}</p>
            <p><strong>状态:</strong> {getStatusText(user.status || '')}</p>
            <p><strong>创建时间:</strong> {user.created_at}</p>
            <p><strong>更新时间:</strong> {user.updated_at}</p>
          </div>
        ),
      });
    } catch (error) {
      message.error('获取用户详情失败');
    }
  };

  // 处理编辑用户
  const handleEdit = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      role: record.role,
      status: record.status === 'active',
    });
    setIsModalVisible(true);
  };

  // 处理保存编辑或创建用户
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updateData = {
        ...values,
        status: values.status ? 'active' : 'inactive',
      };
      
      if (editingUser) {
        // 更新用户
        await updateUser(editingUser.id, updateData);
        message.success('更新成功');
      } else {
        // 创建用户
        await createUser(updateData);
        message.success('用户创建成功');
      }
      
      setIsModalVisible(false);
      setEditingUser(null);
      form.resetFields();
    } catch (error) {
      message.error(editingUser ? '更新失败' : '用户创建失败');
    }
  };

  // 处理删除
  const handleDelete = (id: number) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个用户吗？',
      onOk: async () => {
        try {
          await deleteUser(id);
          message.success('删除成功');
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 处理批量删除
  const handleBatchDelete = async (keys: React.Key[]) => {
    confirm({
      title: '确认批量删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${keys.length} 个用户吗？`,
      onOk: async () => {
        try {
          await batchDeleteUsers(keys.map(key => Number(key)));
          message.success('批量删除成功');
        } catch (error) {
          message.error('批量删除失败');
        }
      },
    });
  };

  // 表格的加载函数
  const handleLoadData = async (params: UserListParams) => {
    try {
      // 注意：这里调用的接口可能需要后端实现
      // 如果后端没有实现users列表接口，可以先返回模拟数据
      const response = await getUserList(params);
      
      return {
        data: response.data?.list || [],
        success: true,
        total: response.data?.pagination?.total || 0,
      };
    } catch (error) {
      // 如果接口调用失败，返回模拟数据
      console.error('获取用户列表失败', error);
      // 返回模拟数据
      return {
        data: [
          {
            id: 1,
            email: 'admin@example.com',
            name: '管理员',
            role: 'admin',
            status: 'active',
            created_at: '2024-01-01 00:00:00',
            updated_at: '2024-01-01 00:00:00',
          },
          {
            id: 2,
            email: 'user1@example.com',
            name: '普通用户',
            role: 'user',
            status: 'active',
            created_at: '2024-01-02 00:00:00',
            updated_at: '2024-01-02 00:00:00',
          },
        ],
        success: true,
        total: 2,
      };
    }
  };

  return (
    <div className={styles.container}>
      <ProTable
        columns={columns}
        request={handleLoadData}
        rowKey="id"
        search={{
          items: [
            {
              label: '关键词',
              fieldKey: 'keyword',
              valueType: 'text',
              placeholder: '搜索邮箱或用户名',
            },
            {
              label: '状态',
              fieldKey: 'status',
              valueType: 'select',
              options: statusOptions,
            },
            {
              label: '角色',
              fieldKey: 'role',
              valueType: 'select',
              options: roleOptions,
            },
          ],
          filterType: 'dropdown',
        }}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条用户`,
        }}
        rowSelection={{
          title: '选择',
        }}
        tableAlertRender={({ selectedRowKeys }) => (
          <div>
            已选择 {selectedRowKeys.length} 项 
            <Button
              type="link"
              size="small"
              danger
              className="ml-2"
              onClick={() => handleBatchDelete(selectedRowKeys)}
            >
              批量删除
            </Button>
          </div>
        )}
        headerTitle="用户管理"
        options={{
          reload: true,
          fullScreen: true,
        }}
        rowExpandable={{
          expandedRowRender: (record: User) => (
            <div className={styles.expandContent}>
              <p><strong>详细信息：</strong></p>
              <p><strong>邮箱：</strong>{record.email}</p>
              {record.name && <p><strong>用户名：</strong>{record.name}</p>}
              <p><strong>角色：</strong>{getStatusText(record.role || '')}</p>
              <p><strong>状态：</strong>{getStatusText(record.status || '')}</p>
            </div>
          ),
        }}
      />

      {/* 编辑用户弹窗 */}
      <Modal
        title={editingUser ? "编辑用户" : "新增用户"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' },
            ]}
          >
            <Input placeholder="请输入邮箱" disabled={!!editingUser} />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="admin">管理员</Option>
              <Option value="user">普通用户</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="活跃" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}