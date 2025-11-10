
import React from 'react';

export enum Tab {
  VISION = 'Vision Capability',
  AGENT = 'AI Reminder Agent',
  RAG = 'RAG System',
  FINETUNING = 'Fine-tuning',
}

interface TabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const tabItems = [
  { id: Tab.VISION, label: 'Vision Capability', icon: '👁️' },
  { id: Tab.AGENT, label: 'AI Reminder Agent', icon: '🤖' },
  { id: Tab.RAG, label: 'RAG System', icon: '📚' },
  { id: Tab.FINETUNING, label: 'Fine-tuning', icon: '🔧' },
];

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="flex flex-col space-y-2" aria-label="Tabs">
      {tabItems.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
            group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out
          `}
        >
          <span className="mr-3 text-lg">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};
