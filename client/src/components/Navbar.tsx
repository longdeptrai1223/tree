import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const Nav = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  text-decoration: none;
  
  &:hover {
    color: #5a67d8;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #667eea;
  }
`;

function Navbar() {
  return (
    <Nav>
      <NavContainer>
        <Logo to="/">Modern Web App</Logo>
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/referrals">Referrals</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
}

export default Navbar; 