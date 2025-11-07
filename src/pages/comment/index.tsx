import React, { useState } from 'react';
import { Button, message, Modal, Form, Input, Select } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { EyeOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import {
  getCommentList,
  reviewComment,
  deleteComment,
  batchDeleteComments,
  updateComment,
  getCommentDetail
} from '@/services/comment';
import type { Comment, CommentListParams } from '@/services/comment/types';
import styles from './index.less';

export default function CommentManagement() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [form] = Form.useForm();

  // 状态选项
  const statusOptions = [
    { value: '', label: '全部' },
    { value: 'pending', label: '待审核' },
    { value: 'approved', label: '已通过' },
    { value: 'rejected', label: '已拒绝' },
  ];

  // 获取状态对应的文本
  const getStatusText = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  // 获取状态对应的标签颜色
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'orange',
      approved: 'green',
      rejected: 'red',
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
      title: '评论内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      width: 400,
    },
    {
      title: '用户',
      key: 'user',
      render: (_, record: Comment) => (
        <div>
          <div>{record.user_name || '匿名用户'}</div>
          <div className="text-xs text-gray-500">{record.user_email}</div>
        </div>
      ),
      width: 200,
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
      width: 120,
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
      render: (_, record: Comment) => [
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
        record.status === 'pending' && (
          <Button
            key="approve"
            type="link"
            icon={<CheckCircleOutlined />}
            className="text-green-500"
            onClick={() => handleApprove(record.id)}
          >
            通过
          </Button>
        ),
        record.status === 'pending' && (
          <Button
            key="reject"
            type="link"
            icon={<CloseCircleOutlined />}
            className="text-red-500"
            onClick={() => handleReject(record.id)}
          >
            拒绝
          </Button>
        ),
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

  // 处理查看评论
  const handleView = async (record: Comment) => {
    try {
      const response = await getCommentDetail(record.id);
      Modal.info({
        title: '评论详情',
        content: (
          <div>
            <p><strong>ID:</strong> {response.data.id}</p>
            <p><strong>内容:</strong> {response.data.content}</p>
            <p><strong>用户:</strong> {response.data.user_name || '匿名用户'}</p>
            <p><strong>邮箱:</strong> {response.data.user_email}</p>
            <p><strong>状态:</strong> {getStatusText(response.data.status)}</p>
            <p><strong>创建时间:</strong> {response.data.created_at}</p>
            <p><strong>更新时间:</strong> {response.data.updated_at}</p>
          </div>
        ),
      });
    } catch (error) {
      message.error('获取评论详情失败');
    }
  };

  // 处理编辑评论
  const handleEdit = (record: Comment) => {
    setEditingComment(record);
    form.setFieldsValue({
      content: record.content,
    });
    setIsModalVisible(true);
  };

  // 处理保存编辑
  const handleSave = async () => {
    if (!editingComment) return;
    
    try {
      const values = await form.validateFields();
      await updateComment(editingComment.id, values);
      message.success('更新成功');
      setIsModalVisible(false);
      // 刷新表格
      setEditingComment(null);
      form.resetFields();
    } catch (error) {
      message.error('更新失败');
    }
  };

  // 处理审核通过
  const handleApprove = async (id: number) => {
    try {
      await reviewComment(id, 'approved');
      message.success('审核通过');
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 处理拒绝
  const handleReject = async (id: number) => {
    try {
      await reviewComment(id, 'rejected');
      message.success('已拒绝');
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条评论吗？',
      onOk: async () => {
        try {
          await deleteComment(id);
          message.success('删除成功');
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 处理批量操作
  const handleBatchReview = async (keys: React.Key[], action: 'approve' | 'reject') => {
    try {
      const ids = keys.map(key => Number(key));
      // 批量审核评论
      for (const id of ids) {
        await reviewComment(id, action);
      }
      message.success(action === 'approve' ? '批量通过成功' : '批量拒绝成功');
    } catch (error) {
      message.error('批量操作失败');
    }
  };

  // 表格的加载函数
  const handleLoadData = async (params: CommentListParams) => {
    try {
      const response = await getCommentList(params);
      
      return {
        data: response.data?.list || [],
        success: true,
        total: response.data?.pagination?.total || 0,
      };
    } catch (error) {
      message.error('获取评论列表失败');
      return {
        data: [],
        success: false,
        total: 0,
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
              placeholder: '搜索评论内容',
            },
            {
              label: '状态',
              fieldKey: 'status',
              valueType: 'select',
              options: statusOptions,
            },
          ],
          filterType: 'dropdown',
        }}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条评论`,
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
              className="ml-2 text-green-500"
              onClick={() => handleBatchReview(selectedRowKeys, 'approve')}
            >
              批量通过
            </Button>
            <Button
              type="link"
              size="small"
              className="ml-2 text-red-500"
              onClick={() => handleBatchReview(selectedRowKeys, 'reject')}
            >
              批量拒绝
            </Button>
          </div>
        )}
        expandable={{
          expandedRowRender: (record: Comment) => (
            <div className={styles.expandContent}>
              <p><strong>完整内容：</strong></p>
              <p>{record.content}</p>
            </div>
          ),
        }}
        headerTitle="评论管理"
        options={{
          reload: true,
          fullScreen: true,
        }}
      />

      {/* 编辑评论弹窗 */}
      <Modal
        title="编辑评论"
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingComment(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="content"
            label="评论内容"
            rules={[{ required: true, message: '请输入评论内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入评论内容" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
