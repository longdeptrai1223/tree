import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #1a202c;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
`;

function About() {
  return (
    <Container>
      <Card>
        <Title>About Us</Title>
        <div className="space-y-6">
          <p className="text-gray-700 text-lg">
            Welcome to our modern web application! We are dedicated to creating beautiful and functional web experiences using the latest technologies.
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Our Tech Stack</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>React with TypeScript</li>
              <li>Emotion for styled components</li>
              <li>Tailwind CSS for utility classes</li>
              <li>React Router for navigation</li>
            </ul>
          </div>
        </div>
      </Card>
    </Container>
  );
}

export default About; 