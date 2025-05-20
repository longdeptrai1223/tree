import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
`;

const Button = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
  };

  return (
    <Container>
      <Button onClick={toggleLanguage}>
        {i18n.language === 'vi' ? 'EN' : 'VI'}
      </Button>
    </Container>
  );
};

export default LanguageSwitcher; 