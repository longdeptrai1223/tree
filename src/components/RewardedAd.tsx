import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { APP_CONFIG } from '../config/app-config';
import { RewardService } from '../services/RewardService';
import { useAuth } from '../contexts/AuthContext';

declare global {
  interface Window {
    adsbygoogle: any[];
    AdMob: {
      initialize: (config: any) => Promise<void>;
      prepareRewardVideoAd: (config: any) => Promise<void>;
      showRewardVideoAd: () => Promise<any>;
    };
  }
}

const AdContainer = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const AdButton = styled.button`
  background: #4CAF50;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  min-height: 48px;
  width: 100%;
  max-width: 300px;
  margin: 10px auto;
  display: block;

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }

  &::before {
    content: "Ad";
    position: absolute;
    top: -8px;
    right: -8px;
    background: #FFC107;
    color: #000;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
  }
`;

const InfoText = styled.p`
  color: #666;
  font-size: 14px;
  text-align: center;
  margin: 8px 0;
`;

const DisclaimerText = styled.p`
  color: #999;
  font-size: 12px;
  text-align: center;
  margin: 4px 0;
`;

const MultiplierText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #2196F3;
  text-align: center;
  margin: 10px 0;
`;

interface RewardedAdProps {
  onAdCompleted: (reward: number) => void;
}

const RewardedAd: React.FC<RewardedAdProps> = ({ onAdCompleted }) => {
  const { userData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [adViews, setAdViews] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [isAdMobInitialized, setIsAdMobInitialized] = useState(false);

  useEffect(() => {
    initializeAdMob();
  }, []);

  useEffect(() => {
    const timer = cooldown > 0 ? setInterval(() => {
      setCooldown(prev => prev - 1);
    }, 1000) : undefined;
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  const initializeAdMob = async () => {
    if (window.AdMob) {
      try {
        await window.AdMob.initialize({
          appId: APP_CONFIG.ADMOB.APP_ID,
          testDevices: APP_CONFIG.ADMOB.TEST_DEVICES,
        });
        setIsAdMobInitialized(true);
      } catch (error) {
        console.error('Error initializing AdMob:', error);
      }
    }
  };

  const prepareRewardedAd = async () => {
    if (!window.AdMob) return;

    try {
      await window.AdMob.prepareRewardVideoAd({
        adId: APP_CONFIG.ADMOB.REWARDED_ID,
        isTesting: APP_CONFIG.ADMOB.IS_TEST_MODE,
      });
    } catch (error) {
      console.error('Error preparing rewarded ad:', error);
      throw error;
    }
  };

  const loadAndShowAd = async () => {
    if (!isAdMobInitialized) {
      alert('AdMob is not initialized. Please try again later.');
      return;
    }

    if (adViews >= 10) {
      alert('Daily ad limit reached. Please come back tomorrow!');
      return;
    }

    setIsLoading(true);
    try {
      await prepareRewardedAd();
      const result = await window.AdMob.showRewardVideoAd();
      
      if (result.rewarded) {
        const newAdViews = adViews + 1;
        setAdViews(newAdViews);
        
        const reward = RewardService.calculateDailyReward(userData!, [{
          id: 'admob_reward',
          userId: userData!.id,
          date: new Date(),
          count: newAdViews,
          multiplier: APP_CONFIG.AD_REWARD_MULTIPLIER
        }]);
        
        onAdCompleted(reward);
        setCooldown(30);
      }
    } catch (error) {
      console.error('Error showing ad:', error);
      alert('Error loading ad. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentMultiplier = Math.min(
    1 + (adViews * APP_CONFIG.AD_REWARD_MULTIPLIER),
    APP_CONFIG.MAX_AD_MULTIPLIER
  );

  const isDisabled = isLoading || cooldown > 0 || currentMultiplier >= APP_CONFIG.MAX_AD_MULTIPLIER;

  return (
    <AdContainer>
      <MultiplierText>
        Current Multiplier: {currentMultiplier.toFixed(1)}x
        {currentMultiplier >= APP_CONFIG.MAX_AD_MULTIPLIER && " (MAX)"}
      </MultiplierText>
      
      <InfoText>
        Watch ads to increase your daily rewards!
        {currentMultiplier < APP_CONFIG.MAX_AD_MULTIPLIER && 
          ` Next ad will give you ${((currentMultiplier + APP_CONFIG.AD_REWARD_MULTIPLIER) * APP_CONFIG.BASE_REWARD).toFixed(3)} AU`
        }
      </InfoText>

      <AdButton
        onClick={loadAndShowAd}
        disabled={isDisabled || !isAdMobInitialized}
      >
        {isLoading ? 'Loading Ad...' :
         !isAdMobInitialized ? 'Initializing...' :
         cooldown > 0 ? `Wait ${cooldown}s` :
         currentMultiplier >= APP_CONFIG.MAX_AD_MULTIPLIER ? 'Max Multiplier Reached' :
         'Watch Ad for Bonus'}
      </AdButton>

      <InfoText>
        {adViews} / {Math.ceil(APP_CONFIG.MAX_AD_MULTIPLIER / APP_CONFIG.AD_REWARD_MULTIPLIER)} ads watched today
      </InfoText>

      <DisclaimerText>
        * Ads provided by Google AdMob. 
        See <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer">privacy policy</a> for details.
      </DisclaimerText>
    </AdContainer>
  );
};

export default RewardedAd; 