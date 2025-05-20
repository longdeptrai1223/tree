import React from 'react';
import styled from '@emotion/styled';
import RewardedAd from '../components/RewardedAd';

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
`;

function Home() {
  const BASE_REWARD = 0.1;
  const MAX_MULTIPLIER = 2;
  const MULTIPLIER_STEP = 0.2;

  const [au, setAu] = React.useState(0);
  const [todayAu, setTodayAu] = React.useState(0);
  const [multiplier, setMultiplier] = React.useState(1);

  const handleClaim = () => {
    const reward = BASE_REWARD * multiplier;
    setAu(au + reward);
    setTodayAu(reward);
    setMultiplier(1); // reset multiplier sau khi claim
  };

  const handleAdReward = () => {
    setMultiplier(m => Math.min(m + MULTIPLIER_STEP, MAX_MULTIPLIER));
  };

  return (
    <AppContainer>
      <Card>
        <Title>My Wallet</Title>
        <AU>{au.toFixed(2)} AU</AU>
        <SubLabel>+{todayAu.toFixed(2)} hôm nay</SubLabel>
        <div>Hệ số thưởng hiện tại: x{multiplier.toFixed(1)}</div>
        <Button onClick={handleClaim}>CLAIM DAILY AU</Button>
      </Card>
      <Card>
        <Title>Bắt đầu</Title>
        <Label>Phần thưởng quảng cáo</Label>
        <RewardedAd onAdCompleted={handleAdReward} />
      </Card>
    </AppContainer>
  );
}

export default Home; 