# 语音厅管理系统 - 后端API设计文档

## 概述

本文档详细描述了语音厅管理系统的后端API设计，包括API接口规范、认证机制、接口列表及详细说明。这些API将支持前端React应用与后端服务器之间的数据交互，实现用户管理、档表管理、工资管理等核心功能。

## API规范

### 基本信息

- 基础URL: `https://api.yourdomain.com/api/v1`
- 数据格式: JSON
- 认证方式: JWT (JSON Web Token)
- 请求方法: GET, POST, PUT, DELETE

### 响应格式

所有API响应均使用以下统一格式：

```json
{
  "code": 200,          // 状态码，200表示成功，非200表示错误
  "message": "成功",   // 响应消息
  "data": {}           // 响应数据，可能是对象、数组或null
}
```

### 错误处理

当API请求出错时，将返回相应的错误状态码和错误信息：

```json
{
  "code": 400,                  // 错误状态码
  "message": "参数错误",       // 错误消息
  "errors": [                  // 详细错误信息（可选）
    {
      "field": "username",
      "message": "用户名不能为空"
    }
  ]
}
```

常见错误状态码：

- 400: 请求参数错误
- 401: 未授权（未登录或token无效）
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器内部错误

## 认证与授权

### 登录认证

```
POST /auth/login
```

请求参数：

```json
{
  "username": "admin",
  "password": "password"
}
```

响应：

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400,
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin",
      "real_name": "系统管理员"
    }
  }
}
```

### 刷新Token

```
POST /auth/refresh
```

请求头：

```
Authorization: Bearer {token}
```

响应：

```json
{
  "code": 200,
  "message": "刷新成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400
  }
}
```

### 退出登录

```
POST /auth/logout
```

请求头：

```
Authorization: Bearer {token}
```

响应：

```json
{
  "code": 200,
  "message": "退出成功",
  "data": null
}
```

## API接口列表

### 1. 用户管理

#### 1.1 获取用户信息

```
GET /users/me
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
    "id": 1,
    "username": "admin",
    "real_name": "系统管理员",
    "role": "admin",
    "email": "admin@example.com",
    "phone": "13800138000",
    "last_login_time": "2023-09-01T12:00:00Z"
  }
}
```

#### 1.2 修改密码

```
PUT /users/password
```

请求头：

```
Authorization: Bearer {token}
```

请求参数：

```json
{
  "old_password": "old_password",
  "new_password": "new_password",
  "confirm_password": "new_password"
}
```

响应：

```json
{
  "code": 200,
  "message": "密码修改成功",
  "data": null
}
```

#### 1.3 获取用户列表（仅管理员）

```
GET /users?page=1&limit=10&role=host
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
    "limit": 10,
    "items": [
      {
        "id": 2,
        "username": "host1",
        "real_name": "测试主持人",
        "role": "host",
        "status": 1,
        "created_at": "2023-09-01T12:00:00Z"
      },
      // 更多用户...
    ]
  }
}
```

#### 1.4 创建用户（仅管理员）

```
POST /users
```

请求头：

```
Authorization: Bearer {token}
```

请求参数：

```json
{
  "username": "newhost",
  "password": "password",
  "real_name": "新主持人",
  "role": "host",
  "email": "newhost@example.com",
  "phone": "13900139000"
}
```

响应：

```json
{
  "code": 200,
  "message": "用户创建成功",
  "data": {
    "id": 3,
    "username": "newhost",
    "real_name": "新主持人",
    "role": "host"
  }
}
```

#### 1.5 更新用户信息（仅管理员）

```
PUT /users/{id}
```

请求头：

```
Authorization: Bearer {token}
```

请求参数：

```json
{
  "real_name": "更新的主持人名称",
  "email": "updated@example.com",
  "phone": "13800138001",
  "status": 1
}
```

响应：

```json
{
  "code": 200,
  "message": "用户更新成功",
  "data": null
}
```

#### 1.6 删除用户（仅管理员）

```
DELETE /users/{id}
```

请求头：

```
Authorization: Bearer {token}
```

响应：

```json
{
  "code": 200,
  "message": "用户删除成功",
  "data": null
}
```

### 2. 主持人管理

#### 2.1 获取主持人列表

```
GET /hosts?page=1&limit=10
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
    "total": 50,
    "page": 1,
    "limit": 10,
    "items": [
      {
        "id": 1,
        "user_id": 2,
        "nickname": "小明",
        "avatar": "https://example.com/avatar.jpg",
        "gender": "male",
        "level": 1,
        "experience": 100,
        "join_date": "2023-01-01"
      },
      // 更多主持人...
    ]
  }
}
```

#### 2.2 获取主持人详情

```
GET /hosts/{id}
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
    "id": 1,
    "user_id": 2,
    "nickname": "小明",
    "avatar": "https://example.com/avatar.jpg",
    "gender": "male",
    "birth_date": "1990-01-01",
    "join_date": "2023-01-01",
    "level": 1,
    "experience": 100,
    "description": "这是一个主持人简介",
    "user": {
      "username": "host1",
      "real_name": "测试主持人",
      "email": "host1@example.com",
      "phone": "13800138000"
    }
  }
}
```

#### 2.3 创建主持人信息（仅管理员）

```
POST /hosts
```

请求头：

```
Authorization: Bearer {token}
```

请求参数：

```json
{
  "user_id": 3,
  "nickname": "小红",
  "avatar": "https://example.com/avatar2.jpg",
  "gender": "female",
  "birth_date": "1995-05-05",
  "join_date": "2023-09-01",
  "description": "新主持人简介"
}
```

响应：

```json
{
  "code": 200,
  "message": "主持人信息创建成功",
  "data": {
    "id": 2,
    "user_id": 3,
    "nickname": "小红"
  }
}
```

#### 2.4 更新主持人信息

```
PUT /hosts/{id}
```

请求头：

```
Authorization: Bearer {token}
```

请求参数：

```json
{
  "nickname": "小红更新",
  "avatar": "https://example.com/avatar3.jpg",
  "description": "更新的主持人简介"
}
```

响应：

```json
{
  "code": 200,
  "message": "主持人信息更新成功",
  "data": null
}
```

### 3. 档表管理

#### 3.1 获取档表列表

```
GET /schedules?page=1&limit=10&start_date=2023-09-01&end_date=2023-09-30
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
    "total": 30,
    "page": 1,
    "limit": 10,
    "items": [
      {
        "id": 1,
        "date": "2023-09-01",
        "creator": {
          "id": 1,
          "username": "admin",
          "real_name": "系统管理员"
        },
        "status": "published",
        "created_at": "2023-08-30T10:00:00Z"
      },
      // 更多档表...
    ]
  }
}
```

#### 3.2 获取档表详情

```
GET /schedules/{id}
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
    "id": 1,
    "date": "2023-09-01",
    "creator": {
      "id": 1,
      "username": "admin",
      "real_name": "系统管理员"
    },
    "status": "published",
    "remark": "国庆节特别安排",
    "created_at": "2023-08-30T10:00:00Z",
    "updated_at": "2023-08-31T15:30:00Z",
    "details": [
      {
        "id": 1,
        "hour": 0,
        "backup_host": {
          "id": 1,
          "nickname": "小明",
          "avatar": "https://example.com/avatar.jpg"
        },
        "main_host": null,
        "accompany_host": null
      },
      {
        "id": 2,
        "hour": 1,
        "backup_host": {
          "id": 2,
          "nickname": "小红",
          "avatar": "https://example.com/avatar2.jpg"
        },
        "main_host": {
          "id": 1,
          "nickname": "小明",
          "avatar": "https://example.com/avatar.jpg"
        },
        "accompany_host": null
      },
      // 更多小时...
    ]
  }
}
```

#### 3.3 创建档表

```
POST /schedules
```

请求头：

```
Authorization: Bearer {token}
```

请求参数：

```json
{
  "date": "2023-09-02",
  "remark": "周末特别安排",
  "status": "draft"
}
```

响应：

```json
{
  "code": 200,
  "message": "档表创建成功",
  "data": {
    "id": 2,
    "date": "2023-09-02"
  }
}
```

#### 3.4 更新档表

```
PUT /schedules/{id}
```

请求头：

```
Authorization: Bearer {token}
```

请求参数：

```json
{
  "remark": "更新的备注信息",
  "status": "published"
}
```

响应：

```json
{
  "code": 200,
  "message": "档表更新成功",
  "data": null
}
```

#### 3.5 删除档表

```
DELETE /schedules/{id}
```

请求头：

```
Authorization: Bearer {token}
```

响应：

```json
{
  "code": 200,
  "message": "档表删除成功",
  "data": null
}
```

#### 3.6 更新档表明细

```
PUT /schedules/{id}/details
```

请求头：

```
Authorization: Bearer {token}
```

请求参数：

```json
{
  "details": [
    {
      "hour": 0,
      "backup_host_id": 1
    },
    {
      "hour": 1,
      "backup_host_id": 2
    },
    // 更多小时...
  ]
}
```

响应：

```json
{
  "code": 200,
  "message": "档表明细更新成功",
  "data": null
}
```

#### 3.7 获取当日档表

```
GET /schedules/today
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
    "id": 1,
    "date": "2023-09-01",
    "status": "published",
    "details": [
      {
        "id": 1,
        "hour": 0,
        "backup_host": {
          "id": 1,
          "nickname": "小明",
          "avatar": "https://example.com/avatar.jpg"
        },
        "main_host": null,
        "accompany_host": null
      },
      // 更多小时...
    ]
  }
}
```

### 4. 接档管理

#### 4.1 获取接档记录列表

```
GET /check-ins?schedule_id=1&host_id=1&page=1&limit=10
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
    "total": 24,
    "page": 1,
    "limit": 10,
    "items": [
      {
        "id": 1,
        "schedule_detail_id": 1,
        "host": {
          "id": 1,
          "nickname": "小明",
          "avatar": "https://example.com/avatar.jpg"
        },
        "role": "backup",
        "check_in_time": "2023-09-01T00:05:30Z",
        "status": "on_time",
        "hour": 0,
        "date": "2023-09-01"
      },
      // 更多接档记录...
    ]
  }
}
```

#### 4.2 更新接档状态

```
PUT /check-ins/{id}
```

请求头：

```
Authorization: Bearer {token}
```

请求参数：

```json
{
  "status": "on_time",
  "check_in_time": "2023-09-01T00:05:30Z",
  "remark": "准时接档"
}
```

响应：

```json
{
  "code": 200,
  "message": "接档状态更新成功",
  "data": null
}
```

#### 4.3 获取主持人接档统计

```
GET /hosts/{id}/check-in-stats?start_date=2023-09-01&end_date=2023-09-30
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
    "total_check_ins": 60,
    "on_time": 55,
    "late": 3,
    "absent": 2,
    "backup_count": 20,
    "main_count": 20,
    "accompany_count": 20
  }
}
```

### 5. 工资管理

#### 5.1 获取工资列表

```
GET /salaries?year=2023&month=9&host_id=1&page=1&limit=10
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
    "total": 50,
    "page": 1,
    "limit": 10,
    "items": [
      {
        "id": 1,
        "host": {
          "id": 1,
          "nickname": "小明",
          "real_name": "测试主持人"
        },
        "year": 2023,
        "month": 9,
        "base_salary": 3000.00,
        "performance_salary": 1500.00,
        "bonus": 500.00,
        "deduction": 200.00,
        "total_salary": 4800.00,
        "status": "confirmed"
      },
      // 更多工资记录...
    ]
  }
}
```

#### 5.2 获取工资详情

```
GET /salaries/{id}
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
    "id": 1,
    "host": {
      "id": 1,
      "nickname": "小明",
      "real_name": "测试主持人",
      "avatar": "https://example.com/avatar.jpg"
    },
    "year": 2023,
    "month": 9,
    "base_salary": 3000.00,
    "performance_salary": 1500.00,
    "bonus": 500.00,
    "deduction": 200.00,
    "total_salary": 4800.00,
    "status": "confirmed",
    "remark": "9月份工资",
    "details": [
      {
        "id": 1,
        "item_name": "基本工资",
        "item_type": "income",
        "amount": 3000.00,
        "description": "基本工资"
      },
      {
        "id": 2,
        "item_name": "绩效奖金",
        "item_type": "income",
        "amount": 1500.00,
        "description": "绩效奖金"
      },
      {
        "id": 3,
        "item_name": "全勤奖",
        "item_type": "income",
        "amount": 500.00,
        "description": "全勤奖"
      },
      {
        "id": 4,
        "item_name": "迟到扣款",
        "item_type": "deduction",
        "amount": 200.00,
        "description": "迟到3次扣款"
      }
    ]
  }
}
```

#### 5.3 创建工资记录

```
POST /salaries
```

请求头：

```
Authorization: Bearer {token}
```

请求参数：

```json
{
  "host_id": 1,
  "year": 2023,
  "month": 10,
  "base_salary": 3000.00,
  "performance_salary": 1800.00,
  "bonus": 600.00,
  "deduction": 0.00,
  "remark": "10月份工资",
  "details": [
    {
      "item_name": "基本工资",
      "item_type": "income",
      "amount": 3000.00,
      "description": "基本工资"
    },
    {
      "item_name": "绩效奖金",
      "item_type": "income",
      "amount": 1800.00,
      "description": "绩效奖金"
    },
    {
      "item_name": "全勤奖",
      "item_type": "income",
      "amount": 600.00,
      "description": "全勤奖"
    }
  ]
}
```

响应：

```json
{
  "code": 200,
  "message": "工资记录创建成功",
  "data": {
    "id": 2,
    "host_id": 1,
    "year": 2023,
    "month": 10,
    "total_salary": 5400.00
  }
}
```

#### 5.4 更新工资记录

```
PUT /salaries/{id}
```

请求头：

```
Authorization: Bearer {token}
```

请求参数：

```json
{
  "performance_salary": 2000.00,
  "bonus": 800.00,
  "status": "confirmed",
  "remark": "更新的10月份工资",
  "details": [
    {
      "id": 5,
      "amount": 2000.00,
      "description": "更新的绩效奖金"
    },
    {
      "id": 6,
      "amount": 800.00,
      "description": "更新的全勤奖"
    }
  ]
}
```

响应：

```json
{
  "code": 200,
  "message": "工资记录更新成功",
  "data": null
}
```

#### 5.5 删除工资记录

```
DELETE /salaries/{id}
```

请求头：

```
Authorization: Bearer {token}
```

响应：

```json
{
  "code": 200,
  "message": "工资记录删除成功",
  "data": null
}
```

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
  "month