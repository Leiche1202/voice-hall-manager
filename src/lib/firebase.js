import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// 您需要将下面的配置替换为您在Firebase控制台获取的实际配置
// 这些信息可以在Firebase项目设置中的"您的应用"部分找到
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 初始化Firebase
const app = initializeApp(firebaseConfig);

// 初始化服务
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };