
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TasksHistory, AppData, User } from './types';
import { getTodayDateString, getPreviousMonthInfo } from './utils/dateUtils';
import { generateTaskIcon } from './services/geminiService';
import UserSelector from './components/UserSelector';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import Calendar from './components/Calendar';
import MonthlySummary from './components/MonthlySummary';
import LoadingOverlay from './components/LoadingOverlay';

const ENCOURAGEMENT_MESSAGES = [
    "你太棒了，像個超級英雄！", "哇！又完成一項，你真是個小天才！", "好厲害！繼續加油，你是最棒的！",
    "做得真好，給你一個大大的讚！", "任務完成！你解鎖了新的成就！"
];
const LOCAL_STORAGE_KEY = 'multiUserTaskApp';

const App: React.FC = () => {
    const [appData, setAppData] = useState<AppData>({ users: [], currentUserId: null });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
    const [summaryInfo, setSummaryInfo] = useState<{tasks: Task[], year: number, month: number} | null>(null);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedData) setAppData(JSON.parse(storedData));
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
            } catch (error) {
                console.error("Failed to save to localStorage", error);
            }
        }
    }, [appData, isLoading]);

    const { users, currentUserId } = appData;
    const currentUser = useMemo(() => users.find(u => u.id === currentUserId), [users, currentUserId]);

    const updateUserData = useCallback((updateFn: (user: User) => User) => {
        setAppData(prev => {
            if (!prev.currentUserId) return prev;
            return {
                ...prev,
                users: prev.users.map(user => 
                    user.id === prev.currentUserId ? updateFn(user) : user
                ),
            };
        });
    }, []);

    const updateLastSeenSummaryMonth = useCallback(() => {
        const today = new Date();
        const currentMonthKey = `${today.getFullYear()}-${today.getMonth()}`;
        updateUserData(user => ({ ...user, lastSeenSummaryMonth: currentMonthKey }));
    }, [updateUserData]);

    useEffect(() => {
        if (!currentUser) return;

        const today = new Date();
        const currentMonthKey = `${today.getFullYear()}-${today.getMonth()}`;
        
        if (currentUser.lastSeenSummaryMonth === currentMonthKey) {
            return; 
        }

        const { year, month } = getPreviousMonthInfo(today);
        
        const lastMonthTasks = Object.entries(currentUser.tasksHistory)
            .filter(([dateStr]) => {
                const taskDate = new Date(dateStr);
                if (isNaN(taskDate.getTime())) return false;
                return taskDate.getFullYear() === year && taskDate.getMonth() === month;
            })
            .flatMap(([, tasks]) => tasks);

        if (lastMonthTasks.length > 0) {
            setSummaryInfo({ tasks: lastMonthTasks, year, month });
        } else {
            updateLastSeenSummaryMonth();
        }
    }, [currentUser?.id, currentUser?.lastSeenSummaryMonth, currentUser?.tasksHistory, updateLastSeenSummaryMonth]);

    
    const handleAddUser = useCallback((name: string) => {
        const newUser: User = { id: uuidv4(), name, tasksHistory: {} };
        setAppData(prev => {
            const newUsers = [...prev.users, newUser];
            return { users: newUsers, currentUserId: newUser.id };
        });
    }, []);

    const handleSwitchUser = useCallback((userId: string) => {
        setAppData(prev => ({ ...prev, currentUserId: userId }));
        setSelectedDate(getTodayDateString());
    }, []);

    const handleAddTask = useCallback((taskText: string) => {
        const dateString = selectedDate;
        if (dateString < getTodayDateString()) return;

        const newTask: Task = { id: Date.now(), text: taskText, completed: false, icon: "⏳" };
        
        updateUserData(user => ({
            ...user,
            tasksHistory: {
                ...user.tasksHistory,
                [dateString]: [...(user.tasksHistory[dateString] || []), newTask],
            },
        }));

        generateTaskIcon(taskText).then(icon => {
            updateUserData(user => {
                const updatedTasks = (user.tasksHistory[dateString] || []).map(t => 
                    t.id === newTask.id ? { ...t, icon } : t
                );
                return {
                    ...user,
                    tasksHistory: { ...user.tasksHistory, [dateString]: updatedTasks },
                };
            });
        });
    }, [updateUserData, selectedDate]);

    const handleCompleteTask = useCallback((id: number) => {
        const randomMessage = ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)];
        const todayString = getTodayDateString();
        updateUserData(user => {
            const updatedTasks = (user.tasksHistory[todayString] || []).map(task =>
                task.id === id ? { ...task, completed: true, encouragement: randomMessage } : task
            );
            return { ...user, tasksHistory: { ...user.tasksHistory, [todayString]: updatedTasks }};
        });
    }, [updateUserData]);

    const handleEditTask = useCallback((id: number, newText: string) => {
        const dateString = selectedDate;
        updateUserData(user => {
             const updatedTasks = (user.tasksHistory[dateString] || []).map(task =>
                task.id === id ? { ...task, text: newText, icon: "⏳" } : task
            );
             return { ...user, tasksHistory: { ...user.tasksHistory, [dateString]: updatedTasks }};
        });
        
        generateTaskIcon(newText).then(icon => {
             updateUserData(user => {
                const updatedTasks = (user.tasksHistory[dateString] || []).map(t => 
                    t.id === id ? { ...t, icon } : t
                );
                return { ...user, tasksHistory: { ...user.tasksHistory, [dateString]: updatedTasks }};
            });
        });
    }, [updateUserData, selectedDate]);

    const handleDeleteTask = useCallback((id: number) => {
        if (!window.confirm("確定要刪除這個任務嗎？")) return;
        const dateString = selectedDate;
        updateUserData(user => {
            const updatedTasks = (user.tasksHistory[dateString] || []).filter(task => task.id !== id);
            return { ...user, tasksHistory: { ...user.tasksHistory, [dateString]: updatedTasks }};
        });
    }, [updateUserData, selectedDate]);

    const handleCopyTask = useCallback((id: number) => {
        const dateString = selectedDate;
        updateUserData(user => {
            const tasks = user.tasksHistory[dateString] || [];
            const taskToCopy = tasks.find(t => t.id === id);
            if (!taskToCopy) return user;

            const newTask: Task = {
                ...taskToCopy,
                id: Date.now(),
                completed: false,
                encouragement: undefined,
            };

            const updatedTasks = [...tasks, newTask];
            return {
                ...user,
                tasksHistory: { ...user.tasksHistory, [dateString]: updatedTasks },
            };
        });
    }, [updateUserData, selectedDate]);
    
    const handleReorderTasks = useCallback((dragIndex: number, hoverIndex: number) => {
        const dateString = selectedDate;
        updateUserData(user => {
            const currentTasks = [...(user.tasksHistory[dateString] || [])];
            const [draggedItem] = currentTasks.splice(dragIndex, 1);
            currentTasks.splice(hoverIndex, 0, draggedItem);
            return {
                ...user,
                tasksHistory: { ...user.tasksHistory, [dateString]: currentTasks },
            };
        });
    }, [updateUserData, selectedDate]);


    const handleCloseSummary = useCallback(() => {
        updateLastSeenSummaryMonth();
        setSummaryInfo(null);
    }, [updateLastSeenSummaryMonth]);

    const tasksForSelectedDate = useMemo(() => currentUser?.tasksHistory[selectedDate] || [], [currentUser, selectedDate]);
    const totalStars = useMemo(() => {
        if (!currentUser) return 0;
        return Object.values(currentUser.tasksHistory).flat().filter(task => task.completed).length;
    }, [currentUser]);

    if (isLoading) {
        return <LoadingOverlay isLoading={true} />;
    }

    return (
        <>
        {summaryInfo && (
            <MonthlySummary 
                tasks={summaryInfo.tasks} 
                year={summaryInfo.year}
                month={summaryInfo.month}
                onClose={handleCloseSummary} 
            />
        )}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-10">
            <UserSelector 
                users={appData.users} 
                currentUserId={appData.currentUserId} 
                onAddUser={handleAddUser}
                onSwitchUser={handleSwitchUser} 
            />

            <div className="text-center mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2 drop-shadow-md">
                    天天向上小樂園
                </h1>
                <p className="text-lg md:text-xl text-gray-500">
                    {currentUser ? `${currentUser.name}的專屬任務板！` : "請選擇或新增一位使用者"}
                </p>
                {currentUser && (
                    <p className="mt-4 text-3xl font-extrabold text-yellow-500" aria-label={`總計 ${totalStars} 顆星星`}>
                        ⭐ 總計: {totalStars}
                    </p>
                )}
            </div>

            {currentUser && (
                <>
                    <Calendar 
                        tasksHistory={currentUser.tasksHistory}
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                    />
                    
                    <h2 className="text-2xl font-bold text-blue-800 my-4">
                        {selectedDate === getTodayDateString() ? '今日任務' : `${selectedDate} 的任務記錄`}
                    </h2>

                    {selectedDate >= getTodayDateString() && (
                        <TaskInput 
                            onAddTask={handleAddTask}
                            isToday={selectedDate === getTodayDateString()}
                            selectedDate={selectedDate}
                        />
                    )}
                    
                    <TaskList 
                        tasks={tasksForSelectedDate} 
                        isToday={selectedDate === getTodayDateString()}
                        isEditable={selectedDate >= getTodayDateString()}
                        onCompleteTask={handleCompleteTask}
                        onEditTask={handleEditTask}
                        onDeleteTask={handleDeleteTask}
                        onCopyTask={handleCopyTask}
                        onReorderTasks={handleReorderTasks}
                    />
                </>
            )}
        </div>
        </>
    );
};

export default App;
