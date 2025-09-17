import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, TrendingUp, Users, Clock, MapPin, Award, ArrowRight } from 'lucide-react';

const CalculatorContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const CalculatorTitle = styled.h2`
  color: #ffffff;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #ffffff;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: #ffffff;
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }

  option {
    background: #1a1a3e;
    color: #ffffff;
  }
`;

const ResultsContainer = styled(motion.div)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
  text-align: center;
`;

const MainResult = styled.div`
  margin-bottom: 2rem;
`;

const ResultAmount = styled.h3`
  font-size: 3rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-weight: 800;
`;

const ResultLabel = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
`;

const ResultRange = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const BreakdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BreakdownItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const BreakdownLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
`;

const BreakdownValue = styled.div`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
`;

const NextStepsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
`;

const NextStepItem = styled.li`
  color: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  &:before {
    content: "✅";
    color: #ffffff;
  }
`;

const CTAButton = styled(motion.button)`
  background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
  border: none;
  color: #1a1a1a;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(255, 215, 0, 0.3);
  }
`;

interface ROICalculatorProps {
  onComplete?: (results: any) => void;
}

const ROICalculator: React.FC<ROICalculatorProps> = ({ onComplete }) => {
  const [inputs, setInputs] = useState({
    experiencia: '',
    horas: '',
    ubicacion: '',
    especialidad: ''
  });

  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const options = {
    experiencia: [
      { value: 'Principiante', label: 'Principiante (menos de 1 año)' },
      { value: 'Intermedio', label: 'Intermedio (1-3 años)' },
      { value: 'Avanzado', label: 'Avanzado (3-5 años)' },
      { value: 'Profesional', label: 'Profesional (5+ años)' }
    ],
    horas: [
      { value: '5-10h', label: '5-10 horas por semana' },
      { value: '10-20h', label: '10-20 horas por semana' },
      { value: '20-30h', label: '20-30 horas por semana' },
      { value: '30h+', label: 'Más de 30 horas por semana' }
    ],
    ubicacion: [
      { value: 'México', label: 'México' },
      { value: 'Colombia', label: 'Colombia' },
      { value: 'España', label: 'España' },
      { value: 'Argentina', label: 'Argentina' },
      { value: 'Estados Unidos', label: 'Estados Unidos' },
      { value: 'Otro', label: 'Otro país' }
    ],
    especialidad: [
      { value: 'Espresso', label: 'Técnicas de Espresso' },
      { value: 'Latte Art', label: 'Latte Art y Arte en Café' },
      { value: 'Cata', label: 'Cata y Análisis Sensorial' },
      { value: 'Tostado', label: 'Tostado y Procesamiento' }
    ]
  };

  const calculateROI = async () => {
    // Validar que todos los campos estén llenos
    if (!inputs.experiencia || !inputs.horas || !inputs.ubicacion || !inputs.especialidad) {
      alert('Por favor completa todos los campos para calcular tu potencial');
      return;
    }

    setIsCalculating(true);

    try {
      // Simular llamada al backend para cálculo
      const response = await fetch('http://localhost:5004/api/automation/calculate-roi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs)
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
        if (onComplete) {
          onComplete(data.results);
        }
      } else {
        // Fallback a cálculo local si el backend no responde
        const localResults = calculateLocalROI();
        setResults(localResults);
      }
    } catch (error) {
      console.error('Error calculando ROI:', error);
      // Fallback a cálculo local
      const localResults = calculateLocalROI();
      setResults(localResults);
    } finally {
      setIsCalculating(false);
    }
  };

  const calculateLocalROI = () => {
    const multipliers = {
      experiencia: {
        "Principiante": 0.7,
        "Intermedio": 1.0,
        "Avanzado": 1.3,
        "Profesional": 1.6
      },
      horas: {
        "5-10h": 0.5,
        "10-20h": 1.0,
        "20-30h": 1.5,
        "30h+": 2.0
      },
      ubicacion: {
        "Estados Unidos": 1.5,
        "España": 1.2,
        "México": 1.0,
        "Colombia": 0.8,
        "Argentina": 0.9,
        "Otro": 1.0
      },
      especialidad: {
        "Latte Art": 1.3,
        "Cata": 1.2,
        "Espresso": 1.1,
        "Tostado": 1.4
      }
    };

    const baseIncome = 400;
    const totalMultiplier =
      multipliers.experiencia[inputs.experiencia] *
      multipliers.horas[inputs.horas] *
      multipliers.ubicacion[inputs.ubicacion] *
      multipliers.especialidad[inputs.especialidad];

    const estimated = Math.round(baseIncome * totalMultiplier);
    const range = {
      min: Math.round(estimated * 0.7),
      max: Math.round(estimated * 1.4)
    };

    return {
      estimated,
      range,
      breakdown: {
        transmisiones: Math.round(estimated * 0.5),
        regalos: Math.round(estimated * 0.3),
        pedidos: Math.round(estimated * 0.2)
      },
      comparison: {
        vs_traditional: estimated > 500 ? "Superior al trabajo tradicional" : "Ingreso complementario ideal",
        vs_platforms: "25% más que otras plataformas de streaming"
      },
      confidence: totalMultiplier > 1.2 ? "Alta" : totalMultiplier > 0.8 ? "Media" : "Conservadora"
    };
  };

  const getCurrencySymbol = () => {
    const symbols = {
      "México": "MX$",
      "Colombia": "COL$",
      "España": "€",
      "Argentina": "AR$",
      "Estados Unidos": "USD$"
    };
    return symbols[inputs.ubicacion] || "USD$";
  };

  return (
    <CalculatorContainer>
      <CalculatorTitle>
        <Calculator size={32} />
        Calculadora de Ingresos para Baristas
      </CalculatorTitle>

      <FormGrid>
        <FormGroup>
          <Label>
            <Award size={16} />
            Nivel de experiencia
          </Label>
          <Select
            value={inputs.experiencia}
            onChange={(e) => setInputs(prev => ({ ...prev, experiencia: e.target.value }))}
          >
            <option value="">Selecciona tu experiencia</option>
            {options.experiencia.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>
            <Clock size={16} />
            Tiempo disponible
          </Label>
          <Select
            value={inputs.horas}
            onChange={(e) => setInputs(prev => ({ ...prev, horas: e.target.value }))}
          >
            <option value="">¿Cuánto tiempo puedes dedicar?</option>
            {options.horas.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>
            <MapPin size={16} />
            Ubicación
          </Label>
          <Select
            value={inputs.ubicacion}
            onChange={(e) => setInputs(prev => ({ ...prev, ubicacion: e.target.value }))}
          >
            <option value="">¿Desde dónde transmitirías?</option>
            {options.ubicacion.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>
            <Users size={16} />
            Especialidad
          </Label>
          <Select
            value={inputs.especialidad}
            onChange={(e) => setInputs(prev => ({ ...prev, especialidad: e.target.value }))}
          >
            <option value="">¿Cuál es tu fuerte?</option>
            {options.especialidad.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        </FormGroup>
      </FormGrid>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <CTAButton
          onClick={calculateROI}
          disabled={isCalculating || !inputs.experiencia || !inputs.horas || !inputs.ubicacion || !inputs.especialidad}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Calculator size={20} />
          {isCalculating ? 'Calculando...' : 'Calcular mi potencial'}
          <ArrowRight size={20} />
        </CTAButton>
      </div>

      {results && (
        <ResultsContainer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MainResult>
            <ResultAmount>
              {getCurrencySymbol()}{results.estimated.toLocaleString()}
            </ResultAmount>
            <ResultLabel>Ingreso mensual estimado</ResultLabel>
            <ResultRange>
              Rango realista: {getCurrencySymbol()}{results.range.min.toLocaleString()} - {getCurrencySymbol()}{results.range.max.toLocaleString()}
            </ResultRange>
          </MainResult>

          <BreakdownGrid>
            <BreakdownItem>
              <BreakdownLabel>Transmisiones en vivo</BreakdownLabel>
              <BreakdownValue>{getCurrencySymbol()}{results.breakdown.transmisiones.toLocaleString()}</BreakdownValue>
            </BreakdownItem>
            <BreakdownItem>
              <BreakdownLabel>Regalos virtuales</BreakdownLabel>
              <BreakdownValue>{getCurrencySymbol()}{results.breakdown.regalos.toLocaleString()}</BreakdownValue>
            </BreakdownItem>
            <BreakdownItem>
              <BreakdownLabel>Pedidos directos</BreakdownLabel>
              <BreakdownValue>{getCurrencySymbol()}{results.breakdown.pedidos.toLocaleString()}</BreakdownValue>
            </BreakdownItem>
          </BreakdownGrid>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>📈 Análisis de tu potencial:</h4>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem' }}>
              <strong>Comparación:</strong> {results.comparison.vs_traditional}
            </p>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '1rem' }}>
              <strong>Vs otras plataformas:</strong> {results.comparison.vs_platforms}
            </p>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              <strong>Nivel de confianza:</strong> {results.confidence}
            </p>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>🎯 Tus próximos pasos:</h4>
            <NextStepsList>
              <NextStepItem>Registrarte gratis en Alpaso</NextStepItem>
              <NextStepItem>Configurar tu perfil de barista</NextStepItem>
              <NextStepItem>Hacer tu primera transmisión de prueba</NextStepItem>
              <NextStepItem>Comenzar a recibir regalos y pedidos</NextStepItem>
            </NextStepsList>
          </div>

          <CTAButton
            style={{ backgroundColor: '#ffffff', color: '#10b981' }}
            onClick={() => window.location.href = '/cap'} // Derivar a Cap para registro
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users size={20} />
            Quiero empezar ahora
            <ArrowRight size={20} />
          </CTAButton>
        </ResultsContainer>
      )}
    </CalculatorContainer>
  );
};

const CTAButton = styled(motion.button)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: white;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultsContainer = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
  text-align: center;
`;

export default ROICalculator;
