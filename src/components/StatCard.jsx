import React from 'react'

const StatCard = ({ title, value, icon, color = 'primary' }) => {
  return (
    <div className={`card bg-${color} text-${color}-content shadow-md hover:shadow-lg transition-shadow`}>
      <div className="card-body">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{icon}</div>
          <div>
            <h3 className="text-sm font-semibold opacity-80">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCard