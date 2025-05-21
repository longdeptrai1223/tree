import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const db = getFirestore();
const auth = getAuth();

// Khởi tạo FingerprintJS
let fpPromise = null;

const initializeFingerprint = async () => {
  if (!fpPromise) {
    fpPromise = FingerprintJS.load();
  }
  return fpPromise;
};

// Lấy Device ID
export const getDeviceId = async () => {
  try {
    const fp = await initializeFingerprint();
    const result = await fp.get();
    return result.visitorId;
  } catch (error) {
    console.error('Error getting device ID:', error);
    throw new Error('Failed to generate device ID. Please try again.');
  }
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
  if (!deviceId) {
    throw new Error('Device ID is not available');
  }

  try {
    const deviceRef = doc(db, 'devices', deviceId);
    const deviceDoc = await getDoc(deviceRef);
    
    if (deviceDoc.exists()) {
      const deviceData = deviceDoc.data();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      if (deviceData.userId && deviceData.userId !== currentUser.uid) {
        throw new Error('This device is already associated with another account. Please use a different device or contact support.');
      }
    }
    return true;
  } catch (error) {
    console.error('Device availability check failed:', error);
    throw error;
  }
};

// Liên kết thiết bị với tài khoản
export const linkDeviceToUser = async (deviceId, userId) => {
  try {
    if (!deviceId || !userId) {
      throw new Error('Thiếu thông tin thiết bị hoặc người dùng');
    }

    const deviceRef = doc(db, 'devices', deviceId);
    const deviceInfo = getDeviceInfo();
    
    // Kiểm tra xem thiết bị đã tồn tại chưa
    const deviceDoc = await getDoc(deviceRef);
    const existingData = deviceDoc.exists() ? deviceDoc.data() : null;
    
    await setDoc(deviceRef, {
      userId,
      deviceInfo,
      status: 'active',
      linkedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      loginCount: (existingData?.loginCount || 0) + 1,
      lastLogin: new Date().toISOString(),
      isTrusted: true,
      location: {
        country: deviceInfo.language.split('-')[1] || 'Unknown',
        timezone: deviceInfo.timezone
      },
      history: existingData ? [...(existingData.history || []), {
        action: 'login',
        timestamp: new Date().toISOString(),
        deviceInfo
      }] : [{
        action: 'first_login',
        timestamp: new Date().toISOString(),
        deviceInfo
      }]
    });
  } catch (error) {
    console.error('Lỗi khi liên kết thiết bị:', error);
    throw new Error('Không thể liên kết thiết bị. Vui lòng thử lại sau.');
  }
};

// Cập nhật thời gian hoạt động cuối cùng của thiết bị
export const updateDeviceLastActive = async (deviceId) => {
  try {
    if (!deviceId) {
      throw new Error('Không tìm thấy ID thiết bị');
    }

    const deviceRef = doc(db, 'devices', deviceId);
    const deviceInfo = getDeviceInfo();
    
    // Kiểm tra xem thiết bị có tồn tại không
    const deviceDoc = await getDoc(deviceRef);
    if (!deviceDoc.exists()) {
      throw new Error('Thiết bị không tồn tại trong hệ thống');
    }

    await setDoc(deviceRef, {
      lastActive: new Date().toISOString(),
      deviceInfo,
      status: 'active',
      lastUpdate: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái thiết bị:', error);
    throw new Error('Không thể cập nhật trạng thái thiết bị. Vui lòng thử lại sau.');
  }
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