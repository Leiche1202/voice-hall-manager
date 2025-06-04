import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../services/authService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getAccount } from '../services/accountService';
import { getScheduleByDate, addSchedule, updateSchedule } from '../services/scheduleService';

const ApiContext = createContext();

export function useApi() {
  return useContext(ApiContext);
}

export function ApiProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const acc = await getAccount(user.uid);
        const data = acc || { username: user.email };
        let role = '';
        if (data.groups?.includes('管理员')) {
          role = 'admin';
        } else if (data.groups?.includes('主持')) {
          role = 'host';
        } else if (data.groups?.some((g) => ['厅管', '预备厅管', '多厅厅管'].includes(g))) {
          role = 'manager';
        }
        setCurrentUser({ id: user.uid, ...data, role });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (phone, password) => {
    const result = await apiLogin(phone, password);
    return result.user;
  };

  const logout = async () => {
    await apiLogout();
  };

  const getSchedule = async (date, hall = '') => {
    const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
    const schedule = await getScheduleByDate(dateStr, hall);
    if (!schedule) {
      return {
        date: new Date(dateStr),
        details: Array.from({ length: 24 }, () => ({ 备档: '', 主档: '', 陪档: '' }))
      };
    }
    return schedule;
  };

  const saveSchedule = async (scheduleData, hall = '') => {
    const validatedData = {
      ...scheduleData,
      hall,
      date: scheduleData.date instanceof Date ? scheduleData.date : new Date(scheduleData.date)
    };
    if (scheduleData.id) {
      await updateSchedule(scheduleData.id, validatedData);
      return scheduleData.id;
    }
    return await addSchedule(validatedData);
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

