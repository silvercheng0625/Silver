
import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  index: number;
  isToday: boolean;
  isEditable: boolean;
  onCompleteTask: (id: number) => void;
  onEditTask: (id: number, newText: string) => void;
  onDeleteTask: (id: number) => void;
  onCopyTask: (id: number) => void;
  onReorderTasks: (dragIndex: number, hoverIndex: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, isToday, isEditable, onCompleteTask, onEditTask, onDeleteTask, onCopyTask, onReorderTasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);
  
  const handleSave = () => {
    if (editText.trim() && editText.trim() !== task.text) {
      onEditTask(task.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("dragIndex", String(index));
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData("dragIndex"));
    onReorderTasks(dragIndex, index);
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const cardClasses = `bg-gray-50 p-4 rounded-2xl shadow-md transition-all duration-300 flex flex-col justify-between min-h-[160px] relative
    ${task.completed ? 'bg-green-50' : (isEditable ? 'hover:shadow-lg' : '')}
    ${isDragging ? 'opacity-50 ring-2 ring-blue-500' : ''}
    ${isEditable && !task.completed ? 'cursor-grab' : ''}
  `;

  return (
    <div 
        className={cardClasses}
        draggable={isEditable && !task.completed}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
    >
      {isEditable && !task.completed && <DragHandleIcon />}
      {isEditing ? (
        <div className="flex-grow">
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="w-full p-2 rounded-md border-2 border-blue-300"
          />
        </div>
      ) : (
        <div className="flex items-start flex-grow">
            <span className="text-3xl mr-3 mt-1 select-none">{task.icon || '✏️'}</span>
            <p className="text-lg font-medium text-gray-700 break-words flex-1">{task.text}</p>
        </div>
      )}

      {task.completed ? (
        <div className="mt-4 text-center border-t-2 border-green-200 pt-3">
          <p className="text-base font-semibold text-green-800 italic mb-1" role="status">
            "{task.encouragement || '做得好！'}"
          </p>
          <span className="text-lg text-green-600 font-bold">太棒了！🎉</span>
        </div>
      ) : (
        <div className="mt-4 flex justify-end items-center gap-2">
            {isEditable && !isEditing && (
                <>
                    <button onClick={() => setIsEditing(true)} className="p-2 text-gray-500 hover:text-blue-600" aria-label="編輯任務"><PencilIcon /></button>
                    <button onClick={() => onCopyTask(task.id)} className="p-2 text-gray-500 hover:text-green-600" aria-label="複製任務"><CopyIcon /></button>
                    <button onClick={() => onDeleteTask(task.id)} className="p-2 text-gray-500 hover:text-red-600" aria-label="刪除任務"><TrashIcon /></button>
                </>
            )}
            {isEditing ? (
                 <button onClick={handleSave} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-xl shadow-md hover:bg-blue-600">儲存</button>
            ) : (
                 <button
                    onClick={() => onCompleteTask(task.id)}
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    aria-label={`完成任務: ${task.text}`}
                    disabled={!isToday}
                    title={!isToday ? "任務只能在排定的當天完成喔！" : "完成任務"}
                 >
                    完成
                 </button>
            )}
        </div>
      )}
    </div>
  );
};

const DragHandleIcon = () => (
    <div className="absolute top-2 left-2 text-gray-300 cursor-grab" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="6" r="1.5" fill="currentColor"/>
            <circle cx="15" cy="6" r="1.5" fill="currentColor"/>
            <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="9" cy="18" r="1.5" fill="currentColor"/>
            <circle cx="15" cy="18" r="1.5" fill="currentColor"/>
        </svg>
    </div>
);

const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
    </svg>
);


export default TaskCard;
