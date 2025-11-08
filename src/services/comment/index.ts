import { request } from '@umijs/max';
import type { Comment, CommentListParams, CommentListResult } from './types';

// 获取评论列表
export async function getCommentList(params: CommentListParams) {
  return request<CommentListResult>('/api/comments', {
    method: 'GET',
    params,
  });
}

// 获取待审核评论列表
export async function getPendingComments(params?: CommentListParams) {
  return request<CommentListResult>('/api/comments/pending/list', {
    method: 'GET',
    params,
  });
}

// 审核通过评论
export async function approveComment(id: number) {
  return request(`/api/comments/${id}/approve`, {
    method: 'PUT',
  });
}

// 拒绝评论
export async function rejectComment(id: number) {
  return request(`/api/comments/${id}/reject`, {
    method: 'PUT',
  });
}

// 批量审核评论
export async function batchReviewComments(ids: number[], status: 'approved' | 'rejected') {
  return request('/api/comments/batch-review', {
    method: 'POST',
    data: { ids, status },
  });
}

// 获取评论的回复
export async function getReplies(id: number, params?: CommentListParams) {
  return request<CommentListResult>(`/api/comments/${id}/replies`, {
    method: 'GET',
    params,
  });
}

// 回复评论
export async function replyComment(id: number, data: { content: string }) {
  return request(`/api/comments/${id}/reply`, {
    method: 'POST',
    data,
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