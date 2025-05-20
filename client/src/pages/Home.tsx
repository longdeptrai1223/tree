import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import RewardedAd from '../components/RewardedAd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RewardService } from '../services/RewardService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #232526 0%, #414345 100%);
  padding: 2rem;
`;

const Card = styled.div`
  background: rgba(24, 24, 24, 0.95);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  margin: 0 auto 2rem auto;
`;

const Title = styled.h1`
  color: #FFD600;
  font-size: 2.2rem;
  font-weight: bold;
  text-align: left;
  margin-bottom: 1.5rem;
`;

const Label = styled.div`
  color: #fff;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const AU = styled.div`
  color: #FFD600;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const SubLabel = styled.div`
  color: #90caf9;
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  background: #FFD600;
  color: #232526;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  width: 100%;
  transition: all 0.2s;
  &:hover {
    background: #ffe066;
    color: #232526;
  }
  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #FFD600;
  color: #232526;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  z-index: 1000;
`;

const FloatingRefButton = styled.button`
  position: fixed;
  bottom: 24px;
  left: 24px;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  z-index: 1000;
`;

const CountdownText = styled.div`
  color: #90caf9;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  margin: 1rem 0;
`;

function Home() {
  const { t } = useTranslation();
  const { userData } = useAuth();
  const [au, setAu] = useState(0);
  const [todayAu, setTodayAu] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [adViews, setAdViews] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [canClaim, setCanClaim] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setAu(userData.currentAu);
      checkRewardEligibility();
    }
  }, [userData]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (userData?.lastRewardClaim) {
        const remainingTime = RewardService.getTimeUntilNextReward(userData.lastRewardClaim);
        setTimeLeft(remainingTime);
        setCanClaim(remainingTime <= 0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [userData?.lastRewardClaim]);

  const checkRewardEligibility = () => {
    if (!userData?.lastRewardClaim) {
      setCanClaim(true);
      return;
    }

    const remainingTime = RewardService.getTimeUntilNextReward(userData.lastRewardClaim);
    setTimeLeft(remainingTime);
    setCanClaim(remainingTime <= 0);
  };

  const handleClaim = async () => {
    if (!userData || !canClaim) return;

    try {
      const reward = RewardService.calculateDailyReward(userData, [{
        id: 'daily_reward',
        userId: userData.id,
        date: new Date(),
        count: adViews,
        multiplier: multiplier
      }]);

      const newAu = userData.currentAu + reward;
      
      // Update user data in Firestore
      const userRef = doc(db, 'users', userData.id);
      await updateDoc(userRef, {
        currentAu: newAu,
        lastRewardClaim: new Date()
      });

      setAu(newAu);
      setTodayAu(reward);
      setMultiplier(1);
      setCanClaim(false);
      setTimeLeft(24 * 60 * 60 * 1000); // Reset timer to 24 hours
    } catch (error) {
      console.error(t('errors.claimReward'), error);
    }
  };

  const handleAdReward = () => {
    setMultiplier(m => Math.min(m + 0.2, 2));
  };

  return (
    <AppContainer>
      <LanguageSwitcher />
      <Card>
        <Title>{t('wallet.title')}</Title>
        <AU>{au.toFixed(2)} AU</AU>
        <SubLabel>+{todayAu.toFixed(2)} {t('wallet.todayEarnings')}</SubLabel>
        <div>{t('wallet.currentMultiplier')}: x{multiplier.toFixed(1)}</div>
        <div style={{color:'#90caf9', fontSize:'1rem', marginBottom:8}}>
          {t('wallet.adViews')}: {adViews}/10
        </div>
        {timeLeft > 0 && (
          <CountdownText>
            {t('wallet.waitingTime')}: {RewardService.formatTimeLeft(timeLeft)}
          </CountdownText>
        )}
        <Button onClick={handleClaim} disabled={!canClaim}>
          {canClaim ? t('wallet.claimButton.ready') : t('wallet.claimButton.waiting')}
        </Button>
      </Card>
      <FloatingButton title={t('common.adButton.title')} aria-label={t('common.adButton.title')}>
        <RewardedAd onAdCompleted={handleAdReward} iconOnly onAdViewsChange={setAdViews} />
      </FloatingButton>
      <FloatingRefButton 
        title={t('common.referralButton.title')} 
        aria-label={t('common.referralButton.title')} 
        onClick={() => navigate('/referrals')}
      >
        <span role="img" aria-label="ref">🤝</span>
      </FloatingRefButton>
    </AppContainer>
  );
}

export default Home; 