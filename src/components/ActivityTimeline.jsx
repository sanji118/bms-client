import { FiAlertCircle, FiCheckCircle, FiDollarSign, FiUserPlus } from 'react-icons/fi';

const ActivityTimeline = ({ activities }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'announcement': return <FiAlertCircle className="text-yellow-500" />;
      case 'payment': return <FiDollarSign className="text-green-500" />;
      case 'agreement': return <FiCheckCircle className="text-blue-500" />;
      default: return <FiUserPlus className="text-purple-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="mt-1 p-1.5 rounded-full bg-gray-50">
            {getIcon(activity.type)}
          </div>
          <div className="flex-1">
            <p className="font-medium">{activity.title}</p>
            <p className="text-sm text-gray-500">
              {new Date(activity.date).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ActivityTimeline;