import React, { useState } from 'react';
import { TasksHistory } from '../types';
import { getTodayDateString, getMonthName, getDaysInMonth, getFirstDayOfMonth } from '../utils/dateUtils';

interface CalendarProps {
  tasksHistory: TasksHistory;
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ tasksHistory, selectedDate, onDateSelect }) => {
  const [displayDate, setDisplayDate] = useState(new Date(selectedDate));
  const todayString = getTodayDateString();

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const changeMonth = (offset: number) => {
    setDisplayDate(new Date(year, month + offset, 1));
  };

  const renderDays = () => {
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-1"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = dateString === selectedDate;
      const isToday = dateString === todayString;
      const hasTasks = tasksHistory[dateString]?.length > 0;
      const hasCompletedTasks = hasTasks && tasksHistory[dateString].every(t => t.completed);

      const dayClasses = `
        w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer relative
        ${isSelected ? 'bg-blue-500 text-white' : ''}
        ${!isSelected && isToday ? 'bg-blue-200 text-blue-800' : ''}
        ${!isSelected && !isToday ? 'hover:bg-gray-200' : ''}
      `;

      days.push(
        <div key={day} className="p-1 flex justify-center">
          <button onClick={() => onDateSelect(dateString)} className={dayClasses} aria-label={`Select date ${dateString}`}>
            {day}
            {hasTasks && (
              <span className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${hasCompletedTasks ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            )}
          </button>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-gray-50 p-4 rounded-2xl shadow-inner mb-8">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => changeMonth(-1)} className="px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">&lt;</button>
        <h3 className="text-lg font-bold text-gray-700">{year}年 {getMonthName(month)}</h3>
        <button onClick={() => changeMonth(1)} className="px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">&gt;</button>
      </div>
      <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
        {['日', '一', '二', '三', '四', '五', '六'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
