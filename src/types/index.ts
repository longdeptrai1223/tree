export interface User {
  id: string;
  email: string;
  currentAu: number;
  referralCode: string;
  referredBy?: string;
  referralMultiplier: number;
  lastRewardClaim?: Date;
  createdAt: Date;
}

export interface DailyReward {
  id: string;
  userId: string;
  baseAmount: number;
  adMultiplier: number;
  referralMultiplier: number;
  finalAmount: number;
  claimedAt: Date;
}

export interface AdView {
  id: string;
  userId: string;
  date: Date;
  count: number;
  multiplier: number;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  status: 'pending' | 'completed';
  createdAt: Date;
} 