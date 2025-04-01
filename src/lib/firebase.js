import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// 您需要将下面的配置替换为您在Firebase控制台获取的实际配置
// 这些信息可以在Firebase项目设置中的"您的应用"部分找到
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY || 'mock-api-key',
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || 'mock-auth-domain',
  projectId: import.meta.env.VITE_PROJECT_ID || 'mock-project-id',
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET || 'mock-storage-bucket',
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID || 'mock-sender-id',
  appId: import.meta.env.VITE_APP_ID || 'mock-app-id',
  measurementId: import.meta.env.VITE_MEASUREMENT_ID || 'mock-measurement-id'
};

// 开发环境下使用模拟配置
if (import.meta.env.DEV && (!import.meta.env.VITE_API_KEY || import.meta.env.VITE_API_KEY === 'your-api-key')) {
  console.warn('使用模拟Firebase配置，请在生产环境中替换为实际配置');
}

// 初始化Firebase
const app = initializeApp(firebaseConfig);

// 初始化服务
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };