/**
 * 系统统计数据类型
 */
export interface StatisticsData {
  users: {
    total: number;
    active: number;
    inactive: number;
    newToday: number;
  };
  comments: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  visits: {
    total: number;
    today: number;
    yesterday: number;
    average: number;
  };
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
  systemStatus: {
    uptime: string;
    version: string;
    lastBackup: string;
  };
}

/**
 * 活动日志类型
 */
export interface ActivityLog {
  id: number;
  type: string;
  user: string;
  action: string;
  target?: string;
  time: string;
  ip?: string;
}