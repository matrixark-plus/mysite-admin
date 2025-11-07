import { request } from '@umijs/max';
import type { User, UserListParams, UserListResult } from './types';

// 登录
export async function login(data: { email: string; password: string; type?: string }) {
  return request('/api/login', {
    method: 'POST',
    data,
  });
}

// 注册
export async function register(data: { username: string; email: string; password: string }) {
  return request('/api/register', {
    method: 'POST',
    data,
  });
}

// 登出
export async function logout() {
  return request('/api/logout', {
    method: 'POST',
  });
}

// 获取当前用户信息
export async function getCurrentUser() {
  return request('/api/user/info', {
    method: 'GET',
  });
}

// 更新用户信息
export async function updateCurrentUser(data: Partial<User>) {
  return request('/api/user/update', {
    method: 'PUT',
    data,
  });
}

// 修改密码
export async function changePassword(data: { oldPassword: string; newPassword: string }) {
  return request('/api/user/change-password', {
    method: 'POST',
    data,
  });
}

// 刷新Token
export async function refreshToken() {
  return request('/api/refresh-token', {
    method: 'POST',
  });
}

// 获取用户列表
export async function getUserList(params: UserListParams) {
  return request<UserListResult>('/api/users', {
    method: 'GET',
    params,
  });
}

// 获取用户详情
export async function getUserDetail(id: number) {
  return request<{ data: User }>(`/api/users/${id}`, {
    method: 'GET',
  });
}

// 创建用户
export async function createUser(data: Partial<User>) {
  return request('/api/users', {
    method: 'POST',
    data,
  });
}

// 更新用户
export async function updateUser(id: number, data: Partial<User>) {
  return request(`/api/users/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除用户
export async function deleteUser(id: number) {
  return request(`/api/users/${id}`, {
    method: 'DELETE',
  });
}

// 批量删除用户
export async function batchDeleteUsers(ids: number[]) {
  return request('/api/users/batch', {
    method: 'DELETE',
    data: { ids },
  });
}

// 更新用户状态
export async function updateUserStatus(id: number, status: 'active' | 'inactive') {
  return request(`/api/users/${id}/status`, {
    method: 'PUT',
    data: { status },
  });
}

/**
 * 获取验证码（模拟）
 */
export async function getFakeCaptcha(params: { phone: string }) {
  return request('/api/captcha', {
    method: 'POST',
    data: params,
  });
}