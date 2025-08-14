import React from 'react';
import { Task } from '../types';
import { getMonthName } from '../utils/dateUtils';

interface MonthlySummaryProps {
  tasks: Task[];
  year: number;
  month: number;
  onClose: () => void;
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ tasks, year, month, onClose }) => {
    const completedTasks = tasks.filter(t => t.completed);
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="summary-title">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all scale-100 opacity-100">
                <div className="text-center">
                    <span className="text-5xl mb-4 inline-block">🏆</span>
                    <h2 id="summary-title" className="text-2xl font-bold text-gray-800 mb-2">
                        {year}年 {getMonthName(month)} 任務總結
                    </h2>
                    <p className="text-gray-500 mb-6">回顧上個月的努力成果！</p>
                </div>

                <div className="space-y-4 text-lg">
                    <div className="flex justify-between bg-blue-50 p-4 rounded-lg">
                        <span className="font-semibold text-blue-800">總任務數:</span>
                        <span className="font-bold text-blue-800">{totalTasks} 項</span>
                    </div>
                    <div className="flex justify-between bg-green-50 p-4 rounded-lg">
                        <span className="font-semibold text-green-800">已完成任務:</span>
                        <span className="font-bold text-green-800">{completedTasks.length} 項</span>
                    </div>
                     <div className="flex justify-between bg-yellow-50 p-4 rounded-lg">
                        <span className="font-semibold text-yellow-800">完成率:</span>
                        <span className="font-bold text-yellow-800">{completionRate}%</span>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        繼續加油！
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MonthlySummary;