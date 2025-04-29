import React from 'react';

const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="card p-8 text-center animate-fade-in">
      <div className="flex justify-center mb-4 text-gray-400 dark:text-gray-500">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{description}</p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary mx-auto"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState; 