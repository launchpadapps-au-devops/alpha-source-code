import React from 'react';
import styles from './TabBar.module.scss';

interface TabBarProps {
  tabs: string[];
  selectedTab: number;
  onTabChange: (newValue: number) => void;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, selectedTab, onTabChange }) => {
  const handleTabClick = (index: number) => {
    onTabChange(index);
  };

  return (
    <div className={styles.tabBar}>
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={`${styles.tabItem} ${selectedTab === index ? styles.selected : ''}`}
          onClick={() => handleTabClick(index)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default TabBar;
