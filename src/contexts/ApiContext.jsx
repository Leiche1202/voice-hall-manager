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
      
      // 使用缓存机制提高加载速度
      const cacheKey = `schedule_${dateStr}`;
      const cachedData = sessionStorage.getItem(cacheKey);
      
      // 如果有缓存数据，直接返回
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      const schedule = await getScheduleByDate(dateStr);
      
      // 如果没有找到档表，创建一个空的
      if (!schedule) {
        const emptySchedule = {
          date: new Date(dateStr),
          details: Array.from({ length: 24 }, () => ({ 备档: '', 主档: '', 陪档: '' }))
        };
        // 缓存空档表
        sessionStorage.setItem(cacheKey, JSON.stringify(emptySchedule));
        return emptySchedule;
      }
      
      // 缓存获取到的档表
      sessionStorage.setItem(cacheKey, JSON.stringify(schedule));
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
      // 确保数据格式正确
      const validatedData = {
        ...scheduleData,
        // 确保日期格式正确
        date: scheduleData.date instanceof Date ? scheduleData.date : new Date(scheduleData.date)
      };
      
      if (scheduleData.id) {
        // 更新现有档表
        result = await updateSchedule(scheduleData.id, validatedData);
      } else {
        // 创建新档表
        result = await addSchedule(validatedData);
      }
      
      // 减少延迟时间，提高响应速度
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return result;
    } catch (error) {
      console.error("Save schedule error:", error);
      // 重新抛出错误，以便UI层可以处理
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