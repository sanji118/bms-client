const StatCard = ({ icon, title, value, change, color }) => {
  const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
    green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100' }
  };

  return (
    <div className={`${colorMap[color].bg} ${colorMap[color].border} p-5 rounded-xl border`}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${colorMap[color].text}`}>{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${colorMap[color].bg} bg-opacity-70`}>
          {icon}
        </div>
      </div>
      {change && (
        <p className="text-xs mt-2">
          <span className={change > 0 ? 'text-green-500' : 'text-red-500'}>
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>{' '}
          vs last period
        </p>
      )}
    </div>
  );
};
export default StatCard;