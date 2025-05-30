import { useEffect, useState } from 'react';
import { getAnnouncements, updateAnnouncement, deleteAnnouncement } from '../utils/useAnnouncements';
import{ formatDate,} from '../utils'
import { Megaphone, Trash2, Pencil } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);

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

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the announcement.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteAnnouncement(id);
        fetchAnnouncements();
        Swal.fire('Deleted!', 'The announcement has been removed.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete announcement.', 'error');
      }
    }
  };

  const handleEdit = async () => {
    const { _id, title, description } = editData;
    try {
      await updateAnnouncement(_id, { title, description });
      setEditData(null);
      fetchAnnouncements();
      Swal.fire('Updated!', 'Announcement updated successfully.', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to update announcement.', 'error');
    }
  };

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
          Manage Announcements
        </h2>
      </div>

      {announcements.length === 0 ? (
        <div className="text-gray-600 italic">No announcements available.</div>
      ) : (
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-white border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm hover:shadow-md transition-all relative"
            >
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => setEditData({ ...announcement })}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(announcement._id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>

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

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[95%] max-w-md shadow-lg">
            <h2 className="text-xl font-semibold text-yellow-700 mb-4">Edit Announcement</h2>
            <input
              type="text"
              className="w-full mb-3 input input-bordered"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Title"
            />
            <textarea
              className="w-full textarea textarea-bordered"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Description"
              rows={4}
            ></textarea>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setEditData(null)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleEdit} className="btn btn-warning">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
