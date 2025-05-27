import { useEffect, useState } from "react";
import axios from "axios";

const UserAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/announcements');
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Announcements</h2>
      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div key={announcement._id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{announcement.title}</h3>
              <p className="text-gray-700">{announcement.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(announcement.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No announcements available.</p>
        )}
      </div>
    </div>
  );
};

export default UserAnnouncements;