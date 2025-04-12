import React, { useState } from 'react';
import TaskCard, { TaskCardProps } from './TaskCard';

interface TaskListProps {
  tasks: Omit<TaskCardProps, 'isSelected' | 'onClick'>[];
  onTaskSelect?: (taskIndex: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskSelect }) => {
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);

  const handleTaskClick = (index: number) => {
    setSelectedTaskIndex(index === selectedTaskIndex ? null : index);
    if (onTaskSelect) {
      onTaskSelect(index);
    }
  };

  return (
    <div className="bg-[#E6EEEF] rounded-lg overflow-hidden">
      <div className="bg-gradient-to-b from-[#F5F8FA] to-[#D3E3E5] py-2 px-4">
        <h3 className="font-semibold text-[#333333]">Tasks</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <TaskCard
              key={index}
              {...task}
              isSelected={selectedTaskIndex === index}
              onClick={() => handleTaskClick(index)}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No tasks available</div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
