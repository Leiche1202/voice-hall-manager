# voice-hall-manager

一个用于管理语音厅排班、工资等事务的Web应用。

## 版本

当前版本：0.17

每做任何一次改动，版本号 +0.01。

## 功能特点

- 用户认证：支持不同角色（管理员、多厅厅管、厅管、预备厅管、主持）的登录
- 档表管理：可视化的排班系统，支持添加、编辑和保存档表
- 工资管理：（开发中）

## 技术栈

- 前端：React、React Router、Framer Motion、TailwindCSS
- 后端：远程 API 服务
- 部署：Vercel

## 本地开发

### 前提条件

- Node.js 14.0+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 部署




## 许可证

MIT

## 环境变量

首次运行前请在项目根目录创建 `.env` 文件，并写入 Firebase 配置信息，然后执行 `npm install` 和 `npm run dev` 以启动开发服务器。

### 初始化管理员账号

1. 进入 Firebase 控制台，在 **Authentication** 中新增一个用户并设置邮箱和密码。
2. 打开 Firestore，在 `accounts` 集合创建文档，字段至少包含 `username`、`email`、`phone`，并在 `groups` 数组中加入 `管理员`。
3. 使用上面创建的邮箱和密码登录本系统，即可开始管理其他账号。

