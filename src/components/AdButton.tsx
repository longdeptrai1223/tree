import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const AdContainer = styled.div`
  margin: 20px 0;
  padding: 10px;
  text-align: center;
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
  margin: 20px 0;
  position: relative;
  min-height: 48px;
  min-width: 150px;

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
  margin: 8px 0;
`;

interface AdButtonProps {
  onWatchAd: () => Promise<void>;
  dailyViewCount: number;
  maxDailyViews: number;
  currentMultiplier: number;
  maxMultiplier: number;
}

const RewardAdButton: React.FC<AdButtonProps> = ({
  onWatchAd,
  dailyViewCount,
  maxDailyViews,
  currentMultiplier,
  maxMultiplier
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const timer = cooldown > 0 && setInterval(() => {
      setCooldown(prev => prev - 1);
    }, 1000);
    return () => timer && clearInterval(timer);
  }, [cooldown]);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onWatchAd();
      setCooldown(30); // 30 seconds cooldown between ads
    } catch (error) {
      console.error('Error showing ad:', error);
    }
    setIsLoading(false);
  };

  const isDisabled = isLoading || cooldown > 0 || dailyViewCount >= maxDailyViews;

  return (
    <AdContainer>
      <InfoText>
        Current Multiplier: {currentMultiplier}x (Max: {maxMultiplier}x)
      </InfoText>
      <InfoText>
        Daily Views: {dailyViewCount}/{maxDailyViews}
      </InfoText>
      <AdButton
        onClick={handleClick}
        disabled={isDisabled}
      >
        {isLoading ? 'Loading...' : 
         cooldown > 0 ? `Wait ${cooldown}s` :
         dailyViewCount >= maxDailyViews ? 'Max Views Reached' :
         'Watch Ad for Bonus'}
      </AdButton>
      <InfoText>
        Watch ads to increase your daily rewards!
      </InfoText>
    </AdContainer>
  );
};

export default RewardAdButton; 