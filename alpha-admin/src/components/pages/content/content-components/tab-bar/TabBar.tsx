import React from 'react';
import styles from './TabBar.module.scss';
import classNames from 'classnames';

interface TabBarProps {
    className?: string;
    tabs: string[];
    selectedTab: number;
    onTabChange: (newValue: number) => void;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, selectedTab, onTabChange, className }) => {
    const handleTabClick = (index: number) => {
        onTabChange(index);
    };

    return (
        <div className={classNames(styles.tabBar, className)}>
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
