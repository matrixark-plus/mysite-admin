import { request } from '@umijs/max';
import type { Comment, CommentListParams, CommentListResult } from './types';

// 获取评论列表
export async function getCommentList(params: CommentListParams) {
  return request<CommentListResult>('/api/comments', {
    method: 'GET',
    params,
  });
}

// 审核评论
export async function reviewComment(id: number, status: 'approved' | 'rejected') {
  return request(`/api/comments/${id}/review`, {
    method: 'POST',
    data: { status },
  });
}

// 创建评论
export async function createComment(data: Partial<Comment>) {
  return request('/api/comments', {
    method: 'POST',
    data,
  });
}

// 更新评论
export async function updateComment(id: number, data: Partial<Comment>) {
  return request(`/api/comments/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除评论
export async function deleteComment(id: number) {
  return request(`/api/comments/${id}`, {
    method: 'DELETE',
  });
}

// 批量删除评论
export async function batchDeleteComments(ids: number[]) {
  return request('/api/comments/batch', {
    method: 'DELETE',
    data: { ids },
  });
}

// 获取评论详情
export async function getCommentDetail(id: number) {
  return request<{ data: Comment }>(`/api/comments/${id}`, {
    method: 'GET',
  });
}