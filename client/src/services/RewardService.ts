import { APP_CONFIG } from '../config/app-config';
import { User, AdView } from '../types';

export class RewardService {
  static calculateDailyReward(user: User, adViews: AdView[]): number {
    const baseReward = APP_CONFIG.BASE_REWARD;
    
    // Tính multiplier từ quảng cáo
    const todayAdViews = adViews.filter(view => 
      view.date.toDateString() === new Date().toDateString()
    );
    const adMultiplier = Math.min(
      1 + (todayAdViews.length * APP_CONFIG.AD_REWARD_MULTIPLIER),
      APP_CONFIG.MAX_AD_MULTIPLIER
    );

    // Tính multiplier từ referrals
    const referralMultiplier = Math.min(
      user.referralMultiplier,
      APP_CONFIG.MAX_REFERRAL_MULTIPLIER
    );

    // Tính tổng phần thưởng
    const finalReward = baseReward * adMultiplier * referralMultiplier;

    return Number(finalReward.toFixed(4)); // Làm tròn đến 4 chữ số thập phân
  }

  static isEligibleForDailyReward(lastClaimTime?: Date): boolean {
    if (!lastClaimTime) return true;

    const now = new Date().getTime();
    const lastClaim = lastClaimTime.getTime();
    const timeDiff = now - lastClaim;

    return timeDiff >= APP_CONFIG.DAILY_REWARD_COOLDOWN;
  }

  static getTimeUntilNextReward(lastClaimTime?: Date): number {
    if (!lastClaimTime) return 0;

    const now = new Date().getTime();
    const lastClaim = lastClaimTime.getTime();
    const nextClaim = lastClaim + APP_CONFIG.DAILY_REWARD_COOLDOWN;
    const timeLeft = nextClaim - now;

    return Math.max(0, timeLeft);
  }

  static formatTimeLeft(milliseconds: number): string {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  static calculateReferralMultiplier(referralCount: number): number {
    const multiplierPerReferral = APP_CONFIG.AD_REWARD_MULTIPLIER;
    const maxMultiplier = APP_CONFIG.MAX_REFERRAL_MULTIPLIER;
    const calculatedMultiplier = 1 + (referralCount * multiplierPerReferral);
    
    return Math.min(calculatedMultiplier, maxMultiplier);
  }
} 