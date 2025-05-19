import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { APP_CONFIG } from '../config/app-config';
import { RewardService } from '../services/RewardService';
import { useAuth } from '../contexts/AuthContext';

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

  useEffect(() => {
    const timer = cooldown > 0 && setInterval(() => {
      setCooldown(prev => prev - 1);
    }, 1000);
    return () => timer && clearInterval(timer);
  }, [cooldown]);

  const loadAndShowAd = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual AdMob rewarded ad logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated ad loading
      
      // Simulate ad view completion
      const newAdViews = adViews + 1;
      setAdViews(newAdViews);
      
      // Calculate reward
      const reward = RewardService.calculateDailyReward(userData!, [{
        id: 'simulated',
        userId: userData!.id,
        date: new Date(),
        count: newAdViews,
        multiplier: APP_CONFIG.AD_REWARD_MULTIPLIER
      }]);
      
      onAdCompleted(reward);
      setCooldown(30); // 30 seconds cooldown
    } catch (error) {
      console.error('Error showing ad:', error);
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
        disabled={isDisabled}
      >
        {isLoading ? 'Loading Ad...' :
         cooldown > 0 ? `Wait ${cooldown}s` :
         currentMultiplier >= APP_CONFIG.MAX_AD_MULTIPLIER ? 'Max Multiplier Reached' :
         'Watch Ad for Bonus'}
      </AdButton>

      <InfoText>
        {adViews} / {Math.ceil(APP_CONFIG.MAX_AD_MULTIPLIER / APP_CONFIG.AD_REWARD_MULTIPLIER)} ads watched today
      </InfoText>
    </AdContainer>
  );
};

export default RewardedAd; 