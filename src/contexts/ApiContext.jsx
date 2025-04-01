import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockLogin } from '../services/authService';
import { getScheduleByDate, addSchedule, updateSchedule } from '../services/scheduleService';

const ApiContext = createContext();

export function useApi() {
  return useContext(ApiContext);
}

export function ApiProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 检查本地存储的用户信息
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  // 登录函数
  const login = async (username, password) => {
    try {
      // 使用模拟登录（开发阶段）
      const result = await mockLogin(username, password);
      setCurrentUser(result.user);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      return result.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  
  // 退出登录
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };
  
  // 获取档表
  const getSchedule = async (date) => {
    try {
      const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
      const schedule = await getScheduleByDate(dateStr);
      
      // 如果没有找到档表，创建一个空的
      if (!schedule) {
        return {
          date: new Date(dateStr),
          details: Array.from({ length: 24 }, () => ({ 备档: '', 主档: '', 陪档: '' }))
        };
      }
      
      return schedule;
    } catch (error) {
      console.error("Get schedule error:", error);
      throw error;
    }
  };
  
  // 保存档表
  const saveSchedule = async (scheduleData) => {
    try {
      let result;
      if (scheduleData.id) {
        // 更新现有档表
        result = await updateSchedule(scheduleData.id, scheduleData);
      } else {
        // 创建新档表
        result = await addSchedule(scheduleData);
      }
      
      // 添加短暂延迟以确保数据已同步
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return result;
    } catch (error) {
      console.error("Save schedule error:", error);
      throw error;
    }
  };
  
  const value = {
    currentUser,
    login,
    logout,
    getSchedule,
    saveSchedule
  };
  
  return (
    <ApiContext.Provider value={value}>
      {!loading && children}
    </ApiContext.Provider>
  );
}