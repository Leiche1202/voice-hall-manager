import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  addScheduleLocal, 
  getScheduleByDateLocal, 
  updateScheduleLocal, 
  deleteScheduleLocal, 
  clearLocalDb,
  initDb,
  SCHEDULES_STORE
} from '../lib/localDb';

// 判断是否使用本地数据库
// 当未提供有效的 Firebase 配置或连接失败时，回退到本地存储
let useLocalDb = !import.meta.env.VITE_API_KEY || !import.meta.env.VITE_PROJECT_ID;

// 如果使用本地数据库，输出提示信息
if (useLocalDb) {
  console.info('使用本地IndexedDB存储数据，所有更改将保存在浏览器中');
}

// 添加档表
export async function addSchedule(scheduleData) {
  try {
    if (useLocalDb) {
      return await addScheduleLocal(scheduleData);
    }

      const data = {
        ...scheduleData,
        date: Timestamp.fromDate(new Date(scheduleData.date)),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

    const docRef = await addDoc(collection(db, "schedules"), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding schedule: ", error);
    if (!useLocalDb) {
      // 尝试回退到本地存储
      useLocalDb = true;
      return addScheduleLocal(scheduleData);
    }
    throw error;
  }
}

// 获取指定日期的档表
export async function getScheduleByDate(dateString, hall = '') {
  try {
    if (useLocalDb) {
      return await getScheduleByDateLocal(dateString, hall);
    }
    
    // 生产环境使用Firebase
    const date = new Date(dateString);
    // 创建日期范围（当天开始到结束）
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const q = query(
      collection(db, "schedules"),
      where("date", ">", Timestamp.fromDate(startOfDay)),
      where("date", "<", Timestamp.fromDate(endOfDay)),
      where("hall", "==", hall)
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    
    // 通常一天只有一个档表，取第一个
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    };
  } catch (error) {
    console.error("Error getting schedule: ", error);
    if (!useLocalDb) {
      useLocalDb = true;
      return getScheduleByDateLocal(dateString, hall);
    }
    throw error;
  }
}

// 更新档表
export async function updateSchedule(id, scheduleData) {
  try {
    if (useLocalDb) {
      return await updateScheduleLocal(id, scheduleData);
    }
    
    // 生产环境使用Firebase
    const scheduleRef = doc(db, "schedules", id);
    
    // 处理日期字段，确保它是Timestamp类型
    let updateData = { ...scheduleData, updatedAt: Timestamp.now() };
    
    // 如果scheduleData包含date字段且它是Date对象或字符串，转换为Timestamp
    if (scheduleData.date && !(scheduleData.date instanceof Timestamp)) {
      updateData.date = Timestamp.fromDate(
        typeof scheduleData.date === 'string' 
          ? new Date(scheduleData.date) 
          : scheduleData.date
      );
    }
    
    // 添加重试逻辑
    let retries = 3;
    let success = false;
    let lastError;
    
    while (retries > 0 && !success) {
      try {
        await updateDoc(scheduleRef, updateData);
        success = true;
      } catch (error) {
        lastError = error;
        retries--;
        // 等待一段时间后重试
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    if (!success) {
      throw lastError || new Error('更新失败，请重试');
    }
    
    // 添加短暂延迟以确保Firestore同步完成
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error("Error updating schedule: ", error);
    if (!useLocalDb) {
      useLocalDb = true;
      return updateScheduleLocal(id, scheduleData);
    }
    throw error;
  }
}

// 删除档表
export async function deleteSchedule(id) {
  try {
    if (useLocalDb) {
      return await deleteScheduleLocal(id);
    }
    
    // 生产环境使用Firebase
    await deleteDoc(doc(db, "schedules", id));
    return true;
  } catch (error) {
    console.error("Error deleting schedule: ", error);
    if (!useLocalDb) {
      useLocalDb = true;
      return deleteScheduleLocal(id);
    }
    throw error;
  }
}

// 获取所有档表
export async function getAllSchedules() {
  try {
    if (useLocalDb) {
      const db = await initDb();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([SCHEDULES_STORE], 'readonly');
        const store = transaction.objectStore(SCHEDULES_STORE);
        const request = store.getAll();
        
        request.onsuccess = (event) => {
          resolve(event.target.result || []);
        };
        
        request.onerror = (event) => {
          console.error('Error getting all schedules from IndexedDB:', event.target.error);
          reject(event.target.error);
        };
        
        transaction.oncomplete = () => {
          db.close();
        };
      });
    }
    
    // 生产环境使用Firebase
    const querySnapshot = await getDocs(collection(db, "schedules"));
    const schedules = [];
    querySnapshot.forEach((doc) => {
      schedules.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });
    return schedules;
  } catch (error) {
    console.error("Error getting all schedules: ", error);
    if (!useLocalDb) {
      useLocalDb = true;
      return getAllSchedules();
    }
    throw error;
  }
}