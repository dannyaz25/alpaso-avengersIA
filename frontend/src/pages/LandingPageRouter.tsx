import React from 'react';
import { useParams } from 'react-router-dom';
import BaristaLandingPage from '../components/BaristaLandingPage';

const LandingPageRouter: React.FC = () => {
  const { etapa = 'descubrimiento', userId } = useParams();

  return <BaristaLandingPage etapa={etapa} userId={userId} />;
};

export default LandingPageRouter;
