import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
   
  const colorClasses = {
    primary: 'bg-primary text-primary-content',
    secondary: 'bg-secondary text-secondary-content',
    accent: 'bg-accent text-accent-content',
    success: 'bg-success text-success-content',
    warning: 'bg-warning text-warning-content',
    error: 'bg-error text-error-content',
    info: 'bg-info text-info-content',
  };

  
  const classes = colorClasses[color] || 'bg-primary text-primary-content';

  return (
    <div className={`card ${classes} shadow-md hover:shadow-lg transition-shadow duration-300 group`}>
      <div className="card-body p-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
            {React.cloneElement(icon, { className: "w-6 h-6" })}
          </div>
          <div>
            <h3 className="text-sm font-semibold opacity-80">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;