import React from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #232526 0%, #414345 100%);
`;

const Card = styled.div`
  background: rgba(24, 24, 24, 0.95);
  border-radius: 1rem;
  padding: 2rem 3rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const Title = styled.h1`
  color: #FFD600;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const GoogleButton = styled.button`
  background: #4285F4;
  color: #fff;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #357ae8;
  }
`;

const Login: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await signInWithGoogle();
    navigate('/');
  };

  return (
    <Container>
      <Card>
        <Title>Đăng nhập để sử dụng ứng dụng</Title>
        <GoogleButton onClick={handleLogin}>
          Đăng nhập với Google
        </GoogleButton>
      </Card>
    </Container>
  );
};

export default Login; 