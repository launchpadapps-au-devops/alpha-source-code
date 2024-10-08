import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ToggleContainer = styled.div<{ isOn: boolean }>`
  width: 50px;
  height: 25px;
  border-radius: 25px;
  background-color: ${(props) => (props.isOn ? "#007BFF" : "#ccc")};
  display: flex;
  align-items: center;
  padding: 2px;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const ToggleCircle = styled.div<{ isOn: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.isOn ? "translateX(24px)" : "translateX(0)")};
`;

interface ToggleSwitchProps {
  isPublished: boolean;  // Accept isPublished as a prop
  onToggle: (e: any) => void;  // Prop for handling toggle changes
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isPublished, onToggle }) => {
  const [isOn, setIsOn] = useState(isPublished);

  useEffect(() => {
    setIsOn(isPublished);  // Update the toggle state based on the prop
  }, [isPublished]);

  const toggleSwitch = (event: React.MouseEvent) => {
    setIsOn(!isOn);
    onToggle(event);  // Ensure the event is passed when calling the parent function
};

  return (
    <ToggleContainer isOn={isOn} onClick={toggleSwitch}>
      <ToggleCircle isOn={isOn} />
    </ToggleContainer>
  );
};

export default ToggleSwitch;
