# 语音厅管理系统 - 后端API设计文档（补充）

## 5. 工资管理（续）

#### 5.6 批量生成工资记录

```
POST /salaries/batch-generate
```

请求头：

```
Authorization: Bearer {token}
```

请求参数：

```json
{
  "year": 2023,
  "month": 10,
  "host_ids": [1, 2, 3],
  "auto_calculate": true
}
```

响应：

```json
{
  "code": 200,
  "message": "工资记录批量生成成功",
  "data": {
    "success_count": 3,
    "failed_count": 0,
    "salary_ids": [10, 11, 12]
  }
}
```

#### 5.7 获取主持人工资统计

```
GET /hosts/{id}/salary-stats?year=2023
```

请求头：

```
Authorization: Bearer {token}
```

响应：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "host_id": 1,
    "nickname": "小明",
    "year": 2023,
    "total_salary": 58000.00,
    "monthly_stats": [
      {
        "month": 1,
        "total_salary": 4500.00
      },
      {
        "month": 2,
        "total_salary": 4600.00
      },
      // 更多月份...
    ],
    "average_salary": 4833.33
  }
}
```

### 6. 系统配置

#### 6.1 获取系统配置列表

```
GET /configs?page=1&limit=20
```

请求头：

```
Authorization: Bearer {token}
```

响应：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "items": [
      {
        "id": 1,
        "config_key": "site_name",
        "config_value": "语音厅管理系统",
        "description": "站点名称"
      },
      {
        "id": 2,
        "config_key": "backup_host_hourly_rate",
        "config_value": "50",
        "description": "备档主持人小时工资"
      },
      // 更多配置...
    ]
  }
}
```

#### 6.2 更新系统配置

```
PUT /configs/{id}
```

请求头：

```
Authorization: Bearer {token}
```

请求参数：

```json
{
  "config_value": "60",
  "description": "更新后的备档主持人小时工资"
}
```

响应：

```json
{
  "code": 200,
  "message": "系统配置更新成功",
  "data": null
}
```

#### 6.3 批量更新系统配置

```
PUT /configs/batch
```

请求头：

```
Authorization: Bearer {token}
```

请求参数：

```json
{
  "configs": [
    {
      "config_key": "backup_host_hourly_rate",
      "config_value": "60"
    },
    {
      "config_key": "main_host_hourly_rate",
      "config_value": "90"
    },
    {
      "config_key": "accompany_host_hourly_rate",
      "config_value": "70"
    }
  ]
}
```

响应：

```json
{
  "code": 200,
  "message": "系统配置批量更新成功",
  "data": null
}
```

### 7. 操作日志

#### 7.1 获取操作日志列表

```
GET /logs?page=1&limit=20&user_id=1&start_date=2023-09-01&end_date=2023-09-30
```

请求头：

```
Authorization: Bearer {token}
```

响应：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "items": [
      {
        "id": 1,
        "user": {
          "id": 1,
          "username": "admin",
          "real_name": "系统管理员"
        },
        "action": "create",
        "target_type": "schedule",
        "target_id": 1,
        "content": "创建了2023-09-01的档表",
        "ip": "192.168.1.1",
        "created_at": "2023-08-30T10:00:00Z"
      },
      // 更多日志...
    ]
  }
}
```

## 数据统计API

### 1. 首页统计数据

```
GET /stats/dashboard
```

请求头：

```
Authorization: Bearer {token}
```

响应：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "host_count": 50,
    "today_schedule": {
      "id": 30,
      "date": "2023-09-30",
      "status": "published"
    },
    "check_in_stats": {
      "total": 72,
      "on_time": 65,
      "late": 5,
      "absent": 2
    },
    "recent_activities": [
      {
        "id": 100,
        "user": {
          "id": 1,
          "username": "admin",
          "real_name": "系统管理员"
        },
        "action": "update",
        "target_type": "schedule",
        "target_id": 30,
        "content": "更新了2023-09-30的档表",
        "created_at": "2023-09-29T15:30:00Z"
      },
      // 更多活动...
    ]
  }
}
```

### 2. 主持人工作统计

```
GET /stats/hosts?year=2023&month=9
```

请求头：

```
Authorization: Bearer {token}
```

响应：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "year": 2023,
    "month": 9,
    "top_hosts": [
      {
        "host_id": 1,
        "nickname": "小明",
        "avatar": "https://example.com/avatar.jpg",
        "work_hours": 120,
        "on_time_rate": 0.98
      },
      // 更多主持人...
    ],
    "role_distribution": {
      "backup": 240,
      "main": 240,
      "accompany": 240
    },
    "hourly_distribution": [
      {
        "hour": 0,
        "count": 30
      },
      // 更多小时...
    ]
  }
}
```

## WebSocket API

### 1. 实时通知

连接WebSocket：

```
ws://api.yourdomain.com/ws/notifications?token={jwt_token}
```

消息格式：

```json
{
  "type": "notification",
  "data": {
    "id": 1,
    "title": "档表更新",
    "content": "2023-09-30的档表已更新",
    "created_at": "2023-09-29T15:30:00Z",
    "is_read": false
  }
}
```

### 2. 实时档表更新

连接WebSocket：

```
ws://api.yourdomain.com/ws/schedules?token={jwt_token}
```

消息格式：

```json
{
  "type": "schedule_update",
  "data": {
    "schedule_id": 30,
    "date": "2023-09-30",
    "detail_id": 720,
    "hour": 0,
    "backup_host": {
      "id": 1,
      "nickname": "小明",
      "avatar": "https://example.com/avatar.jpg"
    },
    "updated_by": {
      "id": 1,
      "username": "admin",
      "real_name": "系统管理员"
    },
    "updated_at": "2023-09-29T15:30:00Z"
  }
}
```

## API开发和部署

### 技术选择

推荐使用以下技术栈开发后端API：

1. **Node.js + Express/Koa**：轻量级、高性能的JavaScript运行时和Web框架
2. **MySQL**：关系型数据库，用于存储结构化数据
3. **Redis**：缓存和会话存储
4. **JWT**：用于身份验证和授权
5. **WebSocket**：用于实时通信
6. **腾讯云对象存储(COS)**：用于存储头像等文件

### 部署架构

在腾讯云上部署时，建议采用以下架构：

1. **前端**：部署在腾讯云对象存储(COS)或轻量应用服务器上
2. **API服务**：部署在腾讯云轻量应用服务器或云服务器CVM上
3. **数据库**：使用腾讯云数据库MySQL
4. **缓存**：使用腾讯云Redis
5. **文件存储**：使用腾讯云对象存储(COS)
6. **CDN**：使用腾讯云CDN加速静态资源访问

### 安全措施

1. 使用HTTPS保护API通信
2. 实施JWT令牌认证和授权
3. 防止SQL注入和XSS攻击
4. 实施请求频率限制
5. 定期备份数据库
6. 记录详细的操作日志

## 结论

本文档详细描述了语音厅管理系统的后端API设计，包括用户管理、主持人管理、档表管理、接档管理、工资管理等核心功能的API接口。通过这些API，前端应用可以与后端服务器进行数据交互，实现系统的完整功能。

在实际开发中，可以根据具体需求对API进行调整和扩展，确保系统的可用性、可靠性和安全性。同时，建议采用腾讯云的相关服务进行部署，以获得更好的性能和稳定性。