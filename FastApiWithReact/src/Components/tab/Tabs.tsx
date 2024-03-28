import React, { useState } from 'react';
import './Tabs.css'

interface TabProps {
    children: React.ReactNode;
    title: string;
}

interface TabsProps {
    children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ children, title }) => {
    return (
        <div className="tab">
            <button><h3>{title}</h3></button>
            <div className="tab-content">{children}</div>
        </div>
    );
};

export const Tabs: React.FC<TabsProps> = ({ children }) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);

    const handleTabClick = (index: number) => {
        setSelectedTabIndex(index);
    };

    const tabs = React.Children.toArray(children) as JSX.Element[]; // Ensure children are JSX elements

    return (
        <div className="tabs">
            <ul className="tabs-nav">
                {tabs.map((tab, index) => (
                    <li key={index}>
                        <button
                            onClick={() => handleTabClick(index)}
                            className={selectedTabIndex === index ? 'active' : ''} // Add 'active' class conditionally
                        >
                            {tab.props.title}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="tabs-content">
                {tabs[selectedTabIndex].props.children}
            </div>
        </div>
    );
};

export default Tabs;