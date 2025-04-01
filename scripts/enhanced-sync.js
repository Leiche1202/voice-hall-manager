/**
 * 增强版GitHub自动同步脚本
 * 用于可靠地将本地更改推送到GitHub仓库
 * 
 * 特点：
 * - 详细的日志输出
 * - 完善的错误处理
 * - 自动重试机制
 * - 支持自定义分支
 * - 状态检查和验证
 */

import simpleGit from 'simple-git';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// 配置选项
const CONFIG = {
  maxRetries: 3,           // 最大重试次数
  retryDelay: 2000,        // 重试间隔(毫秒)
  defaultBranch: 'main',   // 默认分支
  timeout: 30000,          // Git操作超时时间(毫秒)
  debugMode: true          // 是否输出详细日志
};

// 获取当前文件的目录路径（ES模块中没有__dirname）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 项目根目录
const rootDir = path.resolve(__dirname, '..');

// 创建git实例，增加超时设置和调试输出
const git = simpleGit({
  baseDir: rootDir,
  binary: 'git',
  maxConcurrentProcesses: 1,
  trimmed: false,
  timeout: {
    block: CONFIG.timeout
  }
});

// 获取当前时间作为提交信息
const getCommitMessage = () => {
  const now = new Date();
  return `自动同步更新 - ${now.toLocaleString('zh-CN')}`;
};

// 日志函数
const logger = {
  info: (message) => {
    console.log(`[INFO] ${message}`);
  },
  success: (message) => {
    console.log(`[成功] ${message}`);
  },
  warn: (message) => {
    console.warn(`[警告] ${message}`);
  },
  error: (message, error) => {
    console.error(`[错误] ${message}`);
    if (error && CONFIG.debugMode) {
      if (error.git) {
        console.error('Git错误详情:');
        console.error(`命令: ${error.git.command}`);
        console.error(`错误码: ${error.git.exitCode}`);
        console.error(`标准输出: ${error.git.stdout}`);
        console.error(`标准错误: ${error.git.stderr}`);
      } else {
        console.error(error);
      }
    }
  },
  debug: (message) => {
    if (CONFIG.debugMode) {
      console.log(`[调试] ${message}`);
    }
  }
};

// 重试函数封装
async function withRetry(operation, description, maxRetries = CONFIG.maxRetries) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        logger.info(`${description} - 第${attempt}次尝试...`);
      }
      
      return await operation();
    } catch (error) {
      lastError = error;
      logger.warn(`${description} - 尝试${attempt}/${maxRetries}失败`);
      
      if (attempt < maxRetries) {
        logger.info(`等待${CONFIG.retryDelay/1000}秒后重试...`);
        await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay));
      }
    }
  }
  
  throw lastError;
}

// 检查Git仓库状态
async function checkRepository() {
  logger.info('检查Git仓库状态...');
  
  // 检查是否是Git仓库
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    logger.error('当前目录不是Git仓库');
    return false;
  }
  
  // 检查远程仓库配置
  logger.info('检查远程仓库配置...');
  const remotes = await git.getRemotes(true);
  if (!remotes.find(remote => remote.name === 'origin')) {
    logger.error('未找到名为origin的远程仓库');
    return false;
  }
  
  return true;
}

// 获取当前分支
async function getCurrentBranch() {
  try {
    const branchSummary = await git.branch();
    const currentBranch = branchSummary.current;
    logger.info(`当前分支: ${currentBranch}`);
    return currentBranch;
  } catch (error) {
    logger.error('获取当前分支失败', error);
    return CONFIG.defaultBranch; // 返回默认分支
  }
}

// 检查文件更改
async function checkChanges() {
  logger.info('检查文件更改状态...');
  const status = await git.status();
  
  if (status.files.length === 0) {
    logger.info('没有检测到更改，无需同步');
    return { hasChanges: false };
  }
  
  logger.info(`检测到 ${status.files.length} 个文件更改:`);
  status.files.forEach(file => {
    logger.debug(` - ${file.path} (${file.working_dir})`);
  });
  
  return { hasChanges: true, status };
}

// 提交更改
async function commitChanges() {
  // 添加所有更改
  logger.info('添加所有更改到暂存区...');
  await withRetry(
    () => git.add('.'),
    '添加更改'
  );
  logger.success('已成功添加所有更改');
  
  // 提交更改
  const commitMessage = getCommitMessage();
  logger.info(`创建提交: "${commitMessage}"`);
  
  const commitResult = await withRetry(
    () => git.commit(commitMessage),
    '提交更改'
  );
  
  logger.success(`已成功提交更改: ${commitResult.commit} (${commitResult.summary.changes} 个文件更改)`);
  return commitResult;
}

// 推送到远程仓库
async function pushToRemote(branch) {
  logger.info(`推送到远程仓库 origin/${branch}...`);
  
  const pushResult = await withRetry(
    () => git.push('origin', branch),
    '推送到远程仓库'
  );
  
  logger.debug('推送结果:');
  logger.debug(JSON.stringify(pushResult, null, 2));
  logger.success('已成功推送到GitHub');
  
  return pushResult;
}

// 主函数
async function syncToGitHub() {
  logger.info('开始同步到GitHub...');
  
  try {
    // 检查仓库状态
    const repoOk = await checkRepository();
    if (!repoOk) return false;
    
    // 获取当前分支
    const currentBranch = await getCurrentBranch();
    
    // 检查是否有更改
    const { hasChanges } = await checkChanges();
    if (!hasChanges) return true;
    
    // 提交更改
    await commitChanges();
    
    // 推送到远程仓库
    await pushToRemote(currentBranch);
    
    logger.success('同步操作成功完成');
    return true;
  } catch (error) {
    logger.error('同步过程中出错', error);
    return false;
  }
}

// 执行同步并处理结果
syncToGitHub()
  .then(success => {
    if (success) {
      logger.success('同步操作完成');
      process.exit(0); // 成功退出
    } else {
      logger.error('同步操作失败');
      process.exit(1); // 失败退出
    }
  })
  .catch(err => {
    logger.error('执行同步时发生未捕获的错误', err);
    process.exit(1); // 失败退出
  });

// 导出函数以便其他脚本使用
export { syncToGitHub };