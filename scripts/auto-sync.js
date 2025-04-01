/**
 * GitHub自动监控同步脚本
 * 用于监控文件变化并自动将本地更改推送到GitHub仓库
 * 
 * 使用方法：
 * 1. 确保已安装Node.js
 * 2. 运行 npm install simple-git chokidar --save-dev 安装依赖
 * 3. 在package.json中添加脚本: "auto-sync": "node scripts/auto-sync.js"
 * 4. 运行 npm run auto-sync 启动自动同步
 */

const simpleGit = require('simple-git');
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

// 项目根目录
const rootDir = path.resolve(__dirname, '..');

// 创建git实例
const git = simpleGit(rootDir);

// 防抖函数，避免频繁提交
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// 获取当前时间作为提交信息
const getCommitMessage = () => {
  const now = new Date();
  return `自动同步更新 - ${now.toLocaleString('zh-CN')}`;
};

// 同步到GitHub的函数
async function syncToGitHub() {
  try {
    console.log('检查更改并同步到GitHub...');
    
    // 检查是否有Git仓库
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      console.error('错误: 当前目录不是Git仓库');
      return;
    }
    
    // 获取当前状态
    const status = await git.status();
    
    // 如果没有更改，则退出
    if (status.files.length === 0) {
      console.log('没有检测到更改，无需同步');
      return;
    }
    
    console.log(`检测到 ${status.files.length} 个文件更改`);
    
    // 添加所有更改
    await git.add('.');
    console.log('已添加所有更改');
    
    // 提交更改
    const commitMessage = getCommitMessage();
    await git.commit(commitMessage);
    console.log(`已提交更改: ${commitMessage}`);
    
    // 推送到远程仓库
    await git.push('origin', 'main');
    console.log('已成功推送到GitHub');
    
  } catch (error) {
    console.error('同步过程中出错:', error.message);
  }
}

// 防抖处理，5分钟内的多次更改只触发一次同步
const debouncedSync = debounce(syncToGitHub, 5 * 60 * 1000);

// 开始监控文件变化
function startWatching() {
  console.log('开始监控文件变化...');
  
  // 忽略node_modules和.git目录
  const watcher = chokidar.watch(rootDir, {
    ignored: ['**/node_modules/**', '**/.git/**'],
    persistent: true
  });
  
  // 监听所有文件变化事件
  watcher
    .on('add', path => {
      console.log(`文件添加: ${path}`);
      debouncedSync();
    })
    .on('change', path => {
      console.log(`文件修改: ${path}`);
      debouncedSync();
    })
    .on('unlink', path => {
      console.log(`文件删除: ${path}`);
      debouncedSync();
    });
    
  console.log('文件监控已启动，更改将自动同步到GitHub');
}

// 启动监控
startWatching();

// 导出函数以便其他脚本使用
module.exports = { syncToGitHub, startWatching };