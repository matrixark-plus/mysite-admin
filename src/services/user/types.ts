/**
 * 用户类型定义
 */
export interface User {
  id: number;
  email: string;
  name?: string;
  role?: string;
  status?: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

/**
 * 用户列表参数
 */
export interface UserListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  role?: string;
  sortBy?: string;
  orderBy?: 'asc' | 'desc';
}

/**
 * 用户列表返回结果
 */
export interface UserListResult {
  items: User[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

/**
 * 登录参数
 */
export interface LoginParams {
  email: string;
  password: string;
  type?: string;
}

/**
 * 登录结果
 */
export interface LoginResult {
  token: string;
  user: User;
}

/**
 * 注册参数
 */
export interface RegisterParams {
  email: string;
  password: string;
  name?: string;
}

/**
 * 更新用户参数
 */
export interface UpdateUserParams {
  name?: string;
  email?: string;
  status?: 'active' | 'inactive';
  role?: string;
}

/**
 * 修改密码参数
 */
export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}