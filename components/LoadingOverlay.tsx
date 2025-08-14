
import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-gray-200"></div>
        <span className="text-lg text-gray-700 font-medium">AI 助手正在努力思考中...</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
