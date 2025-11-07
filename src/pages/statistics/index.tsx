import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, List, Tag, message } from 'antd';
import {
  UserOutlined,
  MessageOutlined,
  EyeOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  CalendarOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Pie, Bar } from '@ant-design/plots';
import {
  getSystemStatistics,
  getCommentStatistics,
  getUserStatistics,
  getRecentActivities,
} from '@/services/statistics';
import type { StatisticsData, ActivityLog } from '@/services/statistics/types';
import styles from './index.less';

export default function StatisticsDashboard() {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [commentStats, setCommentStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    newToday: 0,
  });
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取统计数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 并行获取所有统计数据
        const [statsResponse, commentStatsResponse, userStatsResponse, activitiesResponse] = await Promise.all([
          getSystemStatistics(),
          getCommentStatistics(),
          getUserStatistics(),
          getRecentActivities({ limit: 10 }),
        ]);

        // 处理响应数据
        const statsData = statsResponse.data || {
          users: {
            total: 0,
            active: 0,
            inactive: 0,
            newToday: 0,
          },
          comments: {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
          },
          visits: {
            total: 0,
            today: 0,
            yesterday: 0,
            average: 0,
          },
          storage: {
            used: 0,
            total: 0,
            percentage: 0,
          },
          systemStatus: {
            uptime: '未知',
            version: '未知',
            lastBackup: '未知',
          },
        };

        setStatistics(statsData);
        setCommentStats(commentStatsResponse);
        setUserStats(userStatsResponse);
        setActivities(activitiesResponse);
      } catch (error) {
        console.error('获取统计数据失败', error);
        message.error('获取统计数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 评论状态饼图数据
  const commentPieData = [
    { type: '已通过', value: commentStats.approved, color: '#52c41a' },
    { type: '待审核', value: commentStats.pending, color: '#faad14' },
    { type: '已拒绝', value: commentStats.rejected, color: '#ff4d4f' },
  ].filter(item => item.value > 0);

  // 用户状态柱状图数据
  const userBarData = [
    { type: '活跃用户', value: userStats.active, color: '#52c41a' },
    { type: '禁用用户', value: userStats.inactive, color: '#ff4d4f' },
  ];

  // 获取活动类型对应的图标和颜色
  const getActivityInfo = (type: string) => {
    const activityMap: Record<string, { icon: React.ReactNode; color: string }> = {
      comment: { icon: <MessageOutlined />, color: '#1890ff' },
      user: { icon: <UserOutlined />, color: '#52c41a' },
      system: { icon: <AlertOutlined />, color: '#faad14' },
    };
    return activityMap[type] || { icon: <ClockCircleOutlined />, color: '#8c8c8c' };
  };

  // 饼图配置
  const pieConfig = {
    data: commentPieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    legend: {
      layout: 'horizontal',
      position: 'bottom',
    },
  };

  // 柱状图配置
  const barConfig = {
    data: userBarData,
    xField: 'type',
    yField: 'value',
    label: {
      position: 'top',
    },
    color: '#1890ff',
  };

  return (
    <div className={styles.container}>
      <Row gutter={[16, 16]}>
        {/* 用户统计卡片 */}
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className={styles.card}>
            <Statistic
              title="总用户数"
              value={userStats.total}
              prefix={<UserOutlined />}
              suffix={
                <Tag color="blue" className="ml-2">
                  +{userStats.newToday} 今日新增
                </Tag>
              }
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        {/* 评论统计卡片 */}
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className={styles.card}>
            <Statistic
              title="总评论数"
              value={commentStats.total}
              prefix={<MessageOutlined />}
              suffix={
                <Tag color={commentStats.pending > 0 ? "orange" : "green"} className="ml-2">
                  {commentStats.pending} 待审核
                </Tag>
              }
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>

        {/* 访问量统计卡片 */}
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className={styles.card}>
            <Statistic
              title="今日访问"
              value={statistics?.visits.today || 256}
              prefix={<EyeOutlined />}
              suffix={`平均: ${statistics?.visits.average || 200}`}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        {/* 系统状态卡片 */}
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className={styles.card}>
            <Statistic
              title="系统运行"
              value={statistics?.systemStatus.uptime || '24天'}
              prefix={<CheckCircleOutlined />}
              suffix={`v${statistics?.systemStatus.version || '1.0.0'}`}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 评论状态饼图 */}
        <Col xs={24} md={12}>
          <Card title="评论状态分布" bordered={false} className={styles.card}>
            <div className={styles.chartContainer}>
              {commentPieData.length > 0 ? (
                <Pie {...pieConfig} />
              ) : (
                <div className={styles.emptyChart}>暂无评论数据</div>
              )}
            </div>
          </Card>
        </Col>

        {/* 用户状态柱状图 */}
        <Col xs={24} md={12}>
          <Card title="用户状态统计" bordered={false} className={styles.card}>
            <div className={styles.chartContainer}>
              <Bar {...barConfig} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 最近活动 */}
      <Card title="最近活动" bordered={false} className={styles.card} style={{ marginTop: 16 }}>
        <List
          size="small"
          dataSource={activities}
          renderItem={(item) => {
            const { icon, color } = getActivityInfo(item.type);
            return (
              <List.Item
                actions={[
                  <Tag color="default" key="time">
                    {item.time}
                  </Tag>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Tag icon={icon} color={color}>
                      {item.type === 'comment' ? '评论' : item.type === 'user' ? '用户' : '系统'}
                    </Tag>
                  }
                  title={
                    <span>
                      <strong>{item.user}</strong> {item.action}
                      {item.target && <span className="ml-2">{item.target}</span>}
                    </span>
                  }
                />
              </List.Item>
            );
          }}
          locale={{
            emptyText: '暂无活动记录',
          }}
        />
      </Card>
    </div>
  );
}