import React, { useState } from 'react';
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
  max-width: 400px;
  width: 90%;
`;

const Title = styled.h1`
  color: #FFD600;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const GoogleButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? '#666' : '#4285F4'};
  color: #fff;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.disabled ? '#666' : '#357ae8'};
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background: rgba(255, 107, 107, 0.1);
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Login: React.FC = () => {
  const { signInWithGoogle, error } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Đăng nhập để sử dụng ứng dụng</Title>
        <GoogleButton onClick={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <>
              <LoadingSpinner />
              Đang đăng nhập...
            </>
          ) : (
            <>
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                style={{ width: '20px', height: '20px' }} 
              />
              Đăng nhập với Google
            </>
          )}
        </GoogleButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Card>
    </Container>
  );
};

export default Login; 