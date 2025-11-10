
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Tabs, Tab } from './components/Tabs';
import VisionChat from './components/VisionChat';
import ReminderAgent from './components/ReminderAgent';
import RAGSystem from './components/RAGSystem';
import FineTuning from './components/FineTuning';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.VISION);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.VISION:
        return <VisionChat />;
      case Tab.AGENT:
        return <ReminderAgent />;
      case Tab.RAG:
        return <RAGSystem />;
      case Tab.FINETUNING:
        return <FineTuning />;
      default:
        return <VisionChat />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>
        <div className="w-full md:w-3/4 lg:w-4/5 bg-gray-800/50 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
