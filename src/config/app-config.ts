export const APP_CONFIG = {
  // Rewards Configuration
  BASE_REWARD: 0.1,
  MAX_AD_MULTIPLIER: 2,
  MAX_REFERRAL_MULTIPLIER: 5,
  MAX_REFERRALS: 10,
  AD_REWARD_MULTIPLIER: 0.2,

  // Time Configuration
  DAILY_REWARD_COOLDOWN: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  AD_COOLDOWN: 30 * 1000, // 30 seconds in milliseconds

  // AdMob Configuration
  ADMOB: {
    APP_ID: process.env.REACT_APP_ADMOB_APP_ID,
    REWARDED_ID: process.env.REACT_APP_ADMOB_REWARDED_ID,
  },

  // API Configuration
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',

  // Firebase Configuration
  FIREBASE: {
    API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
    AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    APP_ID: process.env.REACT_APP_FIREBASE_APP_ID,
    MEASUREMENT_ID: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  },
}; 