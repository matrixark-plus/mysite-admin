import { request } from '@umijs/max';
import type { User, UserListParams, UserListResult } from './types';

// 登录
export async function login(data: { email: string; password: string; type?: string }) {
  const response = await request<{ code: number; message: string; data?: { token: string; user: any } }>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  });
  
  // 尝试从多个可能的位置提取token和用户信息
  let token = null;
  let user = null;
  
  if (response && typeof response === 'object') {
    // 根据实际后端返回格式提取数据
    if (response.code === 200 && response.data) {
      token = response.data.token;
      user = response.data.user;
    }
    // 保存token和用户信息到localStorage
    if (token) {
      localStorage.setItem('token', token);
    }
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }
  
  // 确保返回success字段
  return {
    ...response,
    success: response.code === 200 && !!token, // 以code为200且有token作为登录成功的标准
  };
}

// 注册
export async function register(data: { username: string; email: string; password: string }) {
  return request('/api/auth/register', {
    method: 'POST',
    data,
  });
}

// 登出
export async function logout() {
  return request('/api/auth/logout', {
    method: 'DELETE',
  });
}

// 获取当前用户信息
export async function getCurrentUser() {
  return request('/api/auth/me', {
    method: 'GET',
  });
}

// 更新用户信息
export async function updateCurrentUser(data: Partial<User>) {
  return request('/api/auth/profile', {
    method: 'PUT',
    data,
  });
}

// 修改密码
export async function changePassword(data: { current_password: string; new_password: string }) {
  return request('/api/auth/password', {
    method: 'PUT',
    data,
  });
}

// 刷新Token
export async function refreshToken() {
  return request('/api/auth/refresh', {
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