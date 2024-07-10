import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const calculateDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const interpolateColor = (color1, color2, factor) => {
  const result = color1.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
  }
  return `rgb(${result.join(',')})`;
};

const Button = styled(motion.button)`
  padding: 12px 24px;
  font-size: 16px;
  color: ${({ glowIntensity }) => {
    const white = [255, 255, 255];
    const gray = [169, 169, 169];
    const black = [0, 0, 0];
    let color;
    if (glowIntensity > 0.5) {
      color = interpolateColor(gray, black, (glowIntensity - 0.5) * 2);
    } else {
      color = interpolateColor(white, gray, glowIntensity * 2);
    }
    return color;
  }};
  background: ${({ glowIntensity }) => {
    const darkBlue = [4, 59, 92];
    const lightBlue = [173, 216, 230];
    const backgroundColor = interpolateColor(lightBlue, darkBlue, glowIntensity);
    return backgroundColor;
  }};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  outline: none;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: ${({ glowIntensity }) => `0px 0px ${glowIntensity * 50}px rgba(173, 216, 230, ${glowIntensity})`};

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background: ${({ glowIntensity }) =>
      `radial-gradient(circle, rgba(173, 216, 230, ${glowIntensity}) 0%, rgba(255, 255, 255, ${1 - glowIntensity}) 100%)`};
    transform: translate(-50%, -50%);
    border-radius: 50%;
    pointer-events: none;
    z-index: -1;
  }

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${({ glowIntensity }) => 500 + glowIntensity * 600}%;
    height: ${({ glowIntensity }) => 500 + glowIntensity * 600}%;
    background: radial-gradient(circle, rgba(173, 216, 230, 0.5) 0%, rgba(255, 255, 255, 0) 100%);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    filter: blur(30px);
    pointer-events: none;
    z-index: -3;
    transition: width 0.2s, height 0.2s;
  }
`;

const Overlay = styled.div`
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ glowIntensity }) => 
    `linear-gradient(to top, rgba(4, 59, 92, ${1 - glowIntensity}), rgba(4, 59, 92, 0))`};
  z-index: -2;
  transition: background 0.2s;
`;

const GlowButton = () => {
  const buttonRef = useRef();
  const [glowIntensity, setGlowIntensity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const rect = buttonRef.current.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;
      const distance = calculateDistance(event.clientX, event.clientY, buttonCenterX, buttonCenterY);
      const maxDistance = Math.sqrt(Math.pow(window.innerWidth / 2, 2) + Math.pow(window.innerHeight / 2, 2));
      const intensity = 1 - Math.min(distance / maxDistance, 1);
      setGlowIntensity(intensity);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <Button
      ref={buttonRef}
      glowIntensity={glowIntensity}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Overlay glowIntensity={glowIntensity} />
      Glow Button
    </Button>
  );
};

export default GlowButton;
