import React, { useState } from 'react';
import { User } from '../types';

interface UserSelectorProps {
    users: User[];
    currentUserId: string | null;
    onAddUser: (name: string) => void;
    onSwitchUser: (userId: string) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ users, currentUserId, onAddUser, onSwitchUser }) => {
    const [newUserName, setNewUserName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddClick = () => {
        if (newUserName.trim()) {
            onAddUser(newUserName.trim());
            setNewUserName('');
            setIsAdding(false);
        }
    };

    if (users.length === 0) {
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-r-lg mb-6" role="alert">
                <p className="font-bold">歡迎來到小樂園！</p>
                <p>請先建立一位使用者來開始記錄任務吧。</p>
                <div className="flex gap-2 mt-2">
                    <input
                        type="text"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="請輸入使用者名稱"
                        className="p-2 rounded border border-yellow-300"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddClick()}
                    />
                    <button onClick={handleAddClick} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600">建立</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-end items-center gap-4 mb-6">
            <select
                value={currentUserId || ''}
                onChange={(e) => onSwitchUser(e.target.value)}
                className="p-2 rounded-lg border-2 border-gray-300 bg-white"
            >
                {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>
            {isAdding ? (
                 <div className="flex gap-2">
                    <input
                        type="text"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="新使用者名稱"
                        className="p-2 rounded border border-gray-300"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddClick()}
                        autoFocus
                    />
                    <button onClick={handleAddClick} className="bg-blue-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-blue-600">新增</button>
                    <button onClick={() => setIsAdding(false)} className="bg-gray-200 py-2 px-3 rounded-lg hover:bg-gray-300">取消</button>
                </div>
            ) : (
                <button onClick={() => setIsAdding(true)} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    + 新增使用者
                </button>
            )}
        </div>
    );
};

export default UserSelector;