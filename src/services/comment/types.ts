/**
 * 评论类型定义
 */
export interface Comment {
  id: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  user_id: number;
  user_name?: string;
  user_email?: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
}

/**
 * 评论列表参数
 */
export interface CommentListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  keyword?: string;
  sortBy?: string;
  orderBy?: 'asc' | 'desc';
}

/**
 * 评论列表返回结果
 */
export interface CommentListResult {
  items: Comment[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}