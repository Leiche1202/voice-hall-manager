/**
 * GitHub自动同步脚本
 * 用于自动将本地更改推送到GitHub仓库
 * 
 * 使用方法：
 * 1. 确保已安装Node.js
 * 2. 运行 npm install simple-git --save-dev 安装依赖
 * 3. 在package.json中添加脚本: "sync-github": "node scripts/sync-github.js"
 * 4. 运行 npm run sync-github 执行同步
 */

const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');

// 项目根目录
const rootDir = path.resolve(__dirname, '..');

// 创建git实例，增加超时设置和调试输出
const git = simpleGit({
  baseDir: rootDir,
  binary: 'git',
  maxConcurrentProcesses: 1,
  trimmed: false,
  timeout: {
    block: 10000 // 10秒超时
  }
});

// 获取当前时间作为提交信息
const getCommitMessage = () => {
  const now = new Date();
  return `自动同步更新 - ${now.toLocaleString('zh-CN')}`;
};

// 主函数
async function syncToGitHub() {
  try {
    console.log('开始同步到GitHub...');
    
    // 检查是否有Git仓库
    console.log('检查Git仓库状态...');
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      console.error('错误: 当前目录不是Git仓库');
      return false;
    }
    
    // 检查远程仓库配置
    console.log('检查远程仓库配置...');
    const remotes = await git.getRemotes(true);
    if (!remotes.find(remote => remote.name === 'origin')) {
      console.error('错误: 未找到名为origin的远程仓库');
      return false;
    }
    
    // 获取当前分支
    console.log('获取当前分支...');
    const branchSummary = await git.branch();
    const currentBranch = branchSummary.current;
    console.log(`当前分支: ${currentBranch}`);
    
    // 获取当前状态
    console.log('检查文件更改状态...');
    const status = await git.status();
    
    // 如果没有更改，则退出
    if (status.files.length === 0) {
      console.log('没有检测到更改，无需同步');
      return true; // 成功完成，但没有需要同步的内容
    }
    
    console.log(`检测到 ${status.files.length} 个文件更改:`);
    status.files.forEach(file => {
      console.log(` - ${file.path} (${file.working_dir})`);
    });
    
    // 添加所有更改
    console.log('添加所有更改到暂存区...');
    await git.add('.');
    console.log('已成功添加所有更改');
    
    // 提交更改
    const commitMessage = getCommitMessage();
    console.log(`创建提交: "${commitMessage}"`);
    const commitResult = await git.commit(commitMessage);
    console.log(`已成功提交更改: ${commitResult.commit} (${commitResult.summary.changes} 个文件更改)`);
    
    // 推送到远程仓库
    console.log(`推送到远程仓库 origin/${currentBranch}...`);
    const pushResult = await git.push('origin', currentBranch);
    console.log('推送结果:', pushResult);
    console.log('已成功推送到GitHub');
    
    return true;
  } catch (error) {
    console.error('同步过程中出错:');
    console.error(error);
    
    // 尝试获取更详细的错误信息
    if (error.git) {
      console.error('Git错误详情:');
      console.error(`命令: ${error.git.command}`);
      console.error(`错误码: ${error.git.exitCode}`);
      console.error(`标准输出: ${error.git.stdout}`);
      console.error(`标准错误: ${error.git.stderr}`);
    }
    
    return false;
  }
}

// 执行同步并处理结果
syncToGitHub()
  .then(success => {
    if (success) {
      console.log('同步操作完成');
      process.exit(0); // 成功退出
    } else {
      console.error('同步操作失败');
      process.exit(1); // 失败退出
    }
  })
  .catch(err => {
    console.error('执行同步时发生未捕获的错误:', err);
    process.exit(1); // 失败退出
  });

// 导出函数以便其他脚本使用
module.exports = { syncToGitHub };