import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Shield, Zap, Wifi } from 'lucide-react';

const NavContainer = styled(motion.nav)`
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(20px);
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;

  span {
    background: linear-gradient(135deg, #00d4ff, #ffd700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: ${props => props.$isActive ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.8)'};
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;

  &:hover {
    color: ${props => props.theme.colors.primary};
    background: rgba(0, 212, 255, 0.1);
    transform: translateY(-2px);
  }

  ${props => props.$isActive && `
    background: rgba(0, 212, 255, 0.15);
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  `}
`;

const AssistantIcons = {
  stark: Zap,
  cap: Shield,
  spidey: Wifi
};

const assistants = [
  { id: 'stark', name: 'Stark', path: '/stark' },
  { id: 'cap', name: 'Cap', path: '/cap' },
  { id: 'spidey', name: 'Spidey', path: '/spidey' }
];

function Navigation() {
  const location = useLocation();

  return (
    <NavContainer
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavContent>
        <Logo
          as={Link}
          to="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Shield size={24} />
          <span>Alpaso AvengersIA</span>
        </Logo>

        <NavLinks>
          <NavLink
            to="/"
            $isActive={location.pathname === '/'}
          >
            Home
          </NavLink>

          {assistants.map(assistant => {
            const Icon = AssistantIcons[assistant.id as keyof typeof AssistantIcons];
            const isActive = location.pathname === assistant.path;

            return (
              <NavLink
                key={assistant.id}
                to={assistant.path}
                $isActive={isActive}
              >
                <Icon size={18} />
                {assistant.name}
              </NavLink>
            );
          })}
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
}

export default Navigation;
