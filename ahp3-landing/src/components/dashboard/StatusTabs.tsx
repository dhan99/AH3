import React from 'react';

interface StatusTabProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const StatusTab: React.FC<StatusTabProps> = ({ label, count, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg flex-1 px-4 py-3 shadow flex flex-col items-center justify-center transition-colors ${
        isActive 
          ? 'bg-[#007B87] text-white' 
          : 'bg-white hover:bg-gray-50'
      }`}
    >
      <span className={`text-xl font-bold ${isActive ? 'text-white' : 'text-[#007B87]'}`}>{count}</span>
      <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-700'}`}>{label}</span>
    </button>
  );
};

export interface StatusTabData {
  id: string;
  label: string;
  count: number;
}

interface StatusTabsProps {
  tabs: StatusTabData[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const StatusTabs: React.FC<StatusTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="w-full flex gap-2 mb-6">
      {tabs.map((tab) => (
        <StatusTab
          key={tab.id}
          label={tab.label}
          count={tab.count}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  );
};

export default StatusTabs;
