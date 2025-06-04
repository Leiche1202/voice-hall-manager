/**
 * 本地数据库服务 - 使用IndexedDB作为本地存储
 * 在开发环境中用于模拟数据库操作，保存测试中的实际更改
 */

// 请勿随意修改数据库名称或版本，否则可能导致已保存的数据丢失
const DB_NAME = 'testUiLocalDb';
const DB_VERSION = 1;
const BACKUP_KEY = 'schedule_backup';
export const SCHEDULES_STORE = 'schedules';

// 初始化数据库
export const initDb = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = async (event) => {
      const db = event.target.result;
      await restoreBackup(db);
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // 创建档表存储对象
      if (!db.objectStoreNames.contains(SCHEDULES_STORE)) {
        const store = db.createObjectStore(SCHEDULES_STORE, { keyPath: 'id', autoIncrement: true });
        // 创建日期索引用于按日期查询
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('dateStr', 'dateStr', { unique: true });
      }
    };
  });
};

// 添加档表
export const addScheduleLocal = async (scheduleData) => {
  try {
    const db = await initDb();
    
    return new Promise((resolve, reject) => {
      // 准备数据
      const date = new Date(scheduleData.date);
      const dateStr = date.toISOString().split('T')[0];
      
      const key = `${dateStr}-${scheduleData.hall || ''}`;
      const data = {
        ...scheduleData,
        date: date,
        dateStr: key,
        createdAt: new Date(),
        updatedAt: new Date(),
        dateOnly: dateStr,
      };
      
      const transaction = db.transaction([SCHEDULES_STORE], 'readwrite');
      const store = transaction.objectStore(SCHEDULES_STORE);
      
      const request = store.add(data);
      
      request.onsuccess = (event) => {
        resolve(event.target.result); // 返回新创建的ID
      };
      
      request.onerror = (event) => {
        console.error('Error adding schedule to IndexedDB:', event.target.error);
        reject(event.target.error);
      };
      
      transaction.oncomplete = async () => {
        await backupSchedules();
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in addScheduleLocal:', error);
    throw error;
  }
};

// 获取指定日期的档表
export const getScheduleByDateLocal = async (dateString, hall = '') => {
  try {
    const db = await initDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SCHEDULES_STORE], 'readonly');
      const store = transaction.objectStore(SCHEDULES_STORE);
      const index = store.index('dateStr');

      const key = `${dateString}-${hall}`;
      let request = index.get(key);

      request.onsuccess = (event) => {
        const result = event.target.result;
        if (result) {
          resolve(result);
        } else if (hall) {
          // 向后兼容旧数据
          request = index.get(dateString);
          request.onsuccess = (e) => {
            resolve(e.target.result || null);
          };
          request.onerror = (e) => {
            reject(e.target.error);
          };
        } else {
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        console.error('Error getting schedule from IndexedDB:', event.target.error);
        reject(event.target.error);
      };
      
      transaction.oncomplete = async () => {
        await backupSchedules();
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in getScheduleByDateLocal:', error);
    throw error;
  }
};

// 更新档表
export const updateScheduleLocal = async (id, scheduleData) => {
  try {
    const db = await initDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SCHEDULES_STORE], 'readwrite');
      const store = transaction.objectStore(SCHEDULES_STORE);
      
      // 先获取现有数据
      const getRequest = store.get(id);
      
      getRequest.onsuccess = (event) => {
        const existingData = event.target.result;
        if (!existingData) {
          reject(new Error('找不到要更新的档表'));
          return;
        }
        
        // 准备更新数据
        const date = new Date(scheduleData.date);
        const dateStr = date.toISOString().split('T')[0];
        const key = `${dateStr}-${scheduleData.hall || ''}`;

        const updatedData = {
          ...existingData,
          ...scheduleData,
          date: date,
          dateStr: key,
          dateOnly: dateStr,
          updatedAt: new Date()
        };
        
        // 执行更新
        const updateRequest = store.put(updatedData);
        
        updateRequest.onsuccess = () => {
          resolve(true);
        };
        
        updateRequest.onerror = (event) => {
          console.error('Error updating schedule in IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      };
      
      getRequest.onerror = (event) => {
        console.error('Error getting schedule for update:', event.target.error);
        reject(event.target.error);
      };
      
      transaction.oncomplete = async () => {
        await backupSchedules();
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in updateScheduleLocal:', error);
    throw error;
  }
};

// 删除档表
export const deleteScheduleLocal = async (id) => {
  try {
    const db = await initDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SCHEDULES_STORE], 'readwrite');
      const store = transaction.objectStore(SCHEDULES_STORE);
      
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error('Error deleting schedule from IndexedDB:', event.target.error);
        reject(event.target.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in deleteScheduleLocal:', error);
    throw error;
  }
};

// 清空所有数据（用于测试）
export const clearLocalDb = async () => {
  try {
    const db = await initDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SCHEDULES_STORE], 'readwrite');
      const store = transaction.objectStore(SCHEDULES_STORE);
      
      const request = store.clear();
      
      request.onsuccess = () => {
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error('Error clearing IndexedDB:', event.target.error);
        reject(event.target.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in clearLocalDb:', error);
    throw error;
  }
};

// === 数据备份与恢复 ===
function exportAll(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction([SCHEDULES_STORE], 'readonly');
    const store = tx.objectStore(SCHEDULES_STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

function importAll(db, data) {
  return new Promise((resolve) => {
    if (!data.length) return resolve();
    const tx = db.transaction([SCHEDULES_STORE], 'readwrite');
    const store = tx.objectStore(SCHEDULES_STORE);
    data.forEach((d) => store.put(d));
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

export async function backupSchedules() {
  const db = await initDb();
  const data = await exportAll(db);
  localStorage.setItem(BACKUP_KEY, JSON.stringify(data));
  db.close();
}

export async function restoreBackup(db) {
  const tx = db.transaction([SCHEDULES_STORE], 'readonly');
  const store = tx.objectStore(SCHEDULES_STORE);
  const countReq = store.count();
  return new Promise((resolve) => {
    countReq.onsuccess = async () => {
      if (countReq.result === 0) {
        const saved = localStorage.getItem(BACKUP_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          await importAll(db, data);
        }
      }
      resolve();
    };
    countReq.onerror = () => resolve();
  });
}
