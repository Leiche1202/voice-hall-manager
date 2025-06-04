# voice-hall-manager

一个用于管理语音厅排班、工资等事务的Web应用。

## 功能特点

- 用户认证：支持不同角色（厅管、主持人）的登录
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

本项目使用 Vercel 进行部署，后端由远程 API 提供。
### 本地账号数据
当远程 API 无法访问时，系统会从 `public/accounts.json` 加载默认账号。


## 许可证

MIT
