import React from 'react';

export interface ActivityItem {
  id: string;
  content: string;
  secondaryContent?: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, className = '' }) => {
  return (
    <div className={`bg-white border border-[#E6EEEF] rounded-lg overflow-hidden shadow-sm ${className}`}>
      <div className="p-4 overflow-y-auto max-h-[320px]">
        {activities.map((activity) => (
          <div key={activity.id} className="mb-4 last:mb-0">
            <div className="flex flex-col gap-1">
              <div className="text-sm text-[#000000]">{activity.content}</div>
              {activity.secondaryContent && (
                <div className="text-sm text-[#000000]">{activity.secondaryContent}</div>
              )}
              <div className="text-xs text-[#757575]">{activity.timestamp}</div>
            </div>
            <div className="border-b border-gray-100 mt-3"></div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center text-gray-500 py-4">No recent activity</div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
