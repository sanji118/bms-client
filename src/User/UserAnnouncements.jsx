import { useEffect, useState } from 'react';
import { formatDate, getAnnouncements } from '../utils';

const UserAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) return <div>Loading announcements...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Announcements</h2>
      
      {announcements.length === 0 ? (
        <p>No announcements available.</p>
      ) : (
        <div className="space-y-6">
          {announcements.map(announcement => (
            <div key={announcement._id} className="border-b pb-4 last:border-b-0">
              <h3 className="text-lg font-semibold">{announcement.title}</h3>
              <p className="text-gray-500 text-sm mb-2">
                Posted on {formatDate(announcement.createdAt)}
              </p>
              <p className="text-gray-700">{announcement.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAnnouncements;