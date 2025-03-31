import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// 模拟登录（开发阶段使用）
export async function mockLogin(username, password) {
  if (username === '1' && password === '111') {
    return {
      user: {
        id: '1',
        username: username,
        role: 'admin',
        displayName: '系统管理员'
      },
      token: 'mock-token-admin'
    };
  } else if (username === '2' && password === '111') {
    return {
      user: {
        id: '2',
        username: username,
        role: 'host',
        displayName: '主持人'
      },
      token: 'mock-token-host'
    };
  } else {
    throw new Error('用户名或密码错误');
  }
}

// 实际登录（生产环境使用）
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 获取用户附加信息
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      return {
        user: {
          id: user.uid,
          email: user.email,
          ...userDoc.data()
        },
        token: await user.getIdToken()
      };
    } else {
      throw new Error('用户信息不存在');
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

// 退出登录
export async function logout() {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}