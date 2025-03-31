import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

// 添加档表
export async function addSchedule(scheduleData) {
  try {
    // 转换日期为Firestore Timestamp
    const data = {
      ...scheduleData,
      date: Timestamp.fromDate(new Date(scheduleData.date)),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, "schedules"), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding schedule: ", error);
    throw error;
  }
}

// 获取指定日期的档表
export async function getScheduleByDate(dateString) {
  try {
    const date = new Date(dateString);
    // 创建日期范围（当天开始到结束）
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const q = query(
      collection(db, "schedules"),
      where("date", ">", Timestamp.fromDate(startOfDay)),
      where("date", "<", Timestamp.fromDate(endOfDay))
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
      // 转换Timestamp为JS Date
      date: doc.data().date.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    };
  } catch (error) {
    console.error("Error getting schedule: ", error);
    throw error;
  }
}

// 更新档表
export async function updateSchedule(id, scheduleData) {
  try {
    const scheduleRef = doc(db, "schedules", id);
    await updateDoc(scheduleRef, {
      ...scheduleData,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error("Error updating schedule: ", error);
    throw error;
  }
}

// 删除档表
export async function deleteSchedule(id) {
  try {
    await deleteDoc(doc(db, "schedules", id));
    return true;
  } catch (error) {
    console.error("Error deleting schedule: ", error);
    throw error;
  }
}

// 获取所有档表
export async function getAllSchedules() {
  try {
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
    throw error;
  }
}