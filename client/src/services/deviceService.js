import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const db = getFirestore();
const auth = getAuth();

// Khởi tạo FingerprintJS
const fp = await FingerprintJS.load();

// Lấy Device ID
export const getDeviceId = async () => {
  const result = await fp.get();
  return result.visitorId;
};

// Lấy thông tin thiết bị
const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    deviceMemory: navigator.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  };
};

// Kiểm tra xem thiết bị đã được liên kết với tài khoản khác chưa
export const checkDeviceAvailability = async (deviceId) => {
  const deviceRef = doc(db, 'devices', deviceId);
  const deviceDoc = await getDoc(deviceRef);
  
  if (deviceDoc.exists()) {
    const deviceData = deviceDoc.data();
    // Nếu thiết bị đã được liên kết với tài khoản khác
    if (deviceData.userId && deviceData.userId !== auth.currentUser?.uid) {
      throw new Error('This device is already associated with another account');
    }
  }
  return true;
};

// Liên kết thiết bị với tài khoản
export const linkDeviceToUser = async (deviceId, userId) => {
  const deviceRef = doc(db, 'devices', deviceId);
  const deviceInfo = getDeviceInfo();
  
  await setDoc(deviceRef, {
    userId,
    deviceInfo,
    status: 'active',
    linkedAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    loginCount: 1,
    lastLogin: new Date().toISOString(),
    isTrusted: true,
    location: {
      country: deviceInfo.language.split('-')[1] || 'Unknown',
      timezone: deviceInfo.timezone
    }
  });
};

// Cập nhật thời gian hoạt động cuối cùng của thiết bị
export const updateDeviceLastActive = async (deviceId) => {
  const deviceRef = doc(db, 'devices', deviceId);
  const deviceInfo = getDeviceInfo();
  
  await setDoc(deviceRef, {
    lastActive: new Date().toISOString(),
    deviceInfo,
    status: 'active'
  }, { merge: true });
};

// Cập nhật số lần đăng nhập
export const updateLoginCount = async (deviceId) => {
  const deviceRef = doc(db, 'devices', deviceId);
  const deviceDoc = await getDoc(deviceRef);
  
  if (deviceDoc.exists()) {
    const currentCount = deviceDoc.data().loginCount || 0;
    await setDoc(deviceRef, {
      loginCount: currentCount + 1,
      lastLogin: new Date().toISOString()
    }, { merge: true });
  }
}; 