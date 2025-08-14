
import React from 'react';
import { Task } from '../types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  isToday: boolean;
  isEditable: boolean;
  onCompleteTask: (id: number) => void;
  onEditTask: (id: number, newText: string) => void;
  onDeleteTask: (id: number) => void;
  onCopyTask: (id: number) => void;
  onReorderTasks: (dragIndex: number, hoverIndex: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, isToday, isEditable, onCompleteTask, onEditTask, onDeleteTask, onCopyTask, onReorderTasks }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-400 col-span-full py-10">
        <p>{isToday ? '今天還沒有任務喔，快來新增吧！' : '這一天沒有記錄任何任務。'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task, index) => (
        <TaskCard 
            key={task.id} 
            task={task}
            index={index}
            isToday={isToday} 
            isEditable={isEditable}
            onCompleteTask={onCompleteTask} 
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onCopyTask={onCopyTask}
            onReorderTasks={onReorderTasks}
        />
      ))}
    </div>
  );
};

export default TaskList;
