import React, { useState, useEffect } from 'react';
import styles from './patient-analytics-dashboard.module.scss';

interface DropdownProps {
  options: string[];
  onSelect: (option: string) => void;
  label: string;
  selectedValue?: string; // Add selectedValue as an optional prop
}

export const DropdownPatientAnalytics: React.FC<DropdownProps> = ({ options, onSelect, label, selectedValue }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>(selectedValue || label);

  useEffect(() => {
    // Update the state when selectedValue prop changes
    if (selectedValue) {
      setSelectedOption(selectedValue);
    }
  }, [selectedValue]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={styles['dropdown-container']}>
      <div className={styles['dropdown-header']} onClick={handleToggle}>
        {selectedOption}
        <span className={styles['dropdown-arrow']}>&#x25BC;</span>
      </div>
      {isOpen && (
        <ul className={styles['dropdown-list']}>
          {options.map((option, index) => (
            <li
              key={index}
              className={styles['dropdown-item']}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
