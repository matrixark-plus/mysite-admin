import { request } from '@umijs/max';
import type { StatisticsData, ActivityLog } from './types';

// 获取系统统计数据
export async function getSystemStatistics() {
  return request<{ data: StatisticsData }>('/api/statistics', {
    method: 'GET',
  });
}

// 获取评论统计数据
export async function getCommentStatistics() {
  return request('/api/statistics/comments', {
    method: 'GET',
  });
}

// 获取用户统计数据
export async function getUserStatistics() {
  return request('/api/statistics/users', {
    method: 'GET',
  });
}

// 获取最近活动数据
export async function getRecentActivities(params: { limit?: number; offset?: number }) {
  return request<ActivityLog[]>('/api/statistics/activities', {
    method: 'GET',
    params,
  });
}

// 获取访问统计数据
export async function getVisitStatistics(params: { startDate?: string; endDate?: string }) {
  return request('/api/statistics/visits', {
    method: 'GET',
    params,
  });
}

// 获取存储统计数据
export async function getStorageStatistics() {
  return request('/api/statistics/storage', {
    method: 'GET',
  });
}

// 获取系统状态信息
export async function getSystemStatus() {
  return request('/api/statistics/system-status', {
    method: 'GET',
  });
}