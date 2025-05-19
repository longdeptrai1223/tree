import React from 'react';
import styled from '@emotion/styled';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #1a202c;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background: #667eea;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #5a67d8;
    transform: translateY(-1px);
  }
`;

function Home() {
  const [count, setCount] = React.useState(0);

  return (
    <AppContainer>
      <Card>
        <Title>Welcome to My Modern Web App</Title>
        <div className="text-center">
          <p className="text-gray-700 text-lg mb-4">
            This is a beautiful and modern React application with TypeScript.
          </p>
          <p className="text-gray-600 mb-6">
            Click count: {count}
          </p>
          <Button onClick={() => setCount(count + 1)}>
            Click me!
          </Button>
        </div>
      </Card>
    </AppContainer>
  );
}

export default Home; 