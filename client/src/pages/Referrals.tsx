import React from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Container = styled.div`
  max-width: 400px;
  margin: 40px auto;
  background: rgba(24, 24, 24, 0.95);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  color: #fff;
  text-align: center;
`;

const Title = styled.h2`
  color: #FFD600;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const CodeBox = styled.div`
  background: #222;
  color: #FFD600;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 8px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const CopyButton = styled.button`
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const Desc = styled.p`
  color: #90caf9;
  margin-bottom: 1rem;
`;

const Referrals: React.FC = () => {
  const { userData } = useAuth();
  const [copied, setCopied] = React.useState(false);
  const [invitedCount, setInvitedCount] = React.useState(0);

  React.useEffect(() => {
    const fetchInvitedCount = async () => {
      if (userData?.id) {
        const q = query(
          collection(db, 'referrals'),
          where('referrerId', '==', userData.id),
          where('status', '==', 'completed')
        );
        const snapshot = await getDocs(q);
        setInvitedCount(snapshot.size);
      }
    };
    fetchInvitedCount();
  }, [userData]);

  const handleCopy = () => {
    if (userData?.referralCode) {
      navigator.clipboard.writeText(userData.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Container>
      <Title>Mời bạn bè</Title>
      <Desc>Chia sẻ mã giới thiệu bên dưới cho bạn bè. Khi bạn bè đăng ký và nhập mã này, cả hai sẽ nhận được thưởng!</Desc>
      <CodeBox>
        {userData?.referralCode || 'Đang tải...'}
        <CopyButton onClick={handleCopy}>{copied ? 'Đã sao chép!' : 'Sao chép'}</CopyButton>
      </CodeBox>
      <Desc>Bạn đã mời được <b>{invitedCount}</b> bạn bè.</Desc>
      <Desc>Hãy mời thật nhiều bạn để tăng hệ số thưởng và nhận nhiều AU hơn mỗi ngày!</Desc>
    </Container>
  );
};

export default Referrals; 