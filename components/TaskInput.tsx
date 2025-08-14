
import React, { useState } from 'react';

interface TaskInputProps {
  onAddTask: (taskText: string) => void;
  isToday: boolean;
  selectedDate: string;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask, isToday, selectedDate }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTaskClick = () => {
    if (inputValue.trim()) {
      onAddTask(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddTaskClick();
    }
  };

  return (
    <div className="bg-blue-100 p-6 rounded-2xl shadow-inner mb-8">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">
        {isToday ? "新增今日任務" : `為 ${selectedDate} 新增任務`}
      </h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="例如: 閱讀故事書30分鐘"
          className="flex-grow p-3 rounded-xl border-2 border-blue-300 focus:outline-none focus:border-blue-500 shadow-sm transition-colors duration-200"
        />
        <button
          onClick={handleAddTaskClick}
          className="bg-blue-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-600 transition-colors duration-200"
        >
          新增任務
        </button>
      </div>
    </div>
  );
};

export default TaskInput;
