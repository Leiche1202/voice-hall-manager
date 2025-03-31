# 语音厅管理系统

一个用于管理语音厅排班、工资等事务的Web应用。

## 功能特点

- 用户认证：支持不同角色（厅管、主持人）的登录
- 档表管理：可视化的排班系统，支持添加、编辑和保存档表
- 工资管理：（开发中）

## 技术栈

- 前端：React、React Router、Framer Motion、TailwindCSS
- 后端：Firebase (Firestore, Authentication)
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

本项目使用Vercel进行部署，并使用Firebase作为后端服务。详细部署步骤请参考`免费部署方案实施步骤.md`文件。

## 许可证

MIT