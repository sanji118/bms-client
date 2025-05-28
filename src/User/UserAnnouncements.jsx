import { useEffect, useState } from 'react';
import { formatDate, getAnnouncements } from '../utils';
import { Megaphone } from 'lucide-react';

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-40 text-yellow-600 font-semibold animate-pulse">
        Loading announcements...
      </div>
    );

  return (
    <div className="bg-yellow-50 p-6 md:p-8 rounded-2xl shadow-lg border border-yellow-200">
      <div className="flex items-center gap-3 mb-6">
        <Megaphone className="text-yellow-600" size={28} />
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-700">
          Latest Announcements
        </h2>
      </div>

      {announcements.length === 0 ? (
        <div className="text-gray-600 italic">No announcements available.</div>
      ) : (
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-white border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm transition-all hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-yellow-800">
                {announcement.title}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
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
