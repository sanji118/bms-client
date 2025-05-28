import { useState } from "react";
import Swal from "sweetalert2";
import { createAnnouncement } from "../utils"; 

const MakeAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      Swal.fire(
        'Validation Error!',
        'Please fill in all fields.',
        'warning'
      );
      return;
    }

    setLoading(true);

    try {
      await createAnnouncement({ title, description });
      
      Swal.fire(
        'Success!',
        'Announcement has been published.',
        'success'
      );
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error('Failed to create announcement:', error);
      Swal.fire(
        'Error!',
        error.response?.data?.message || 'Failed to publish announcement.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Make Announcement</h2>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Title:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
              placeholder="Enter announcement title (max 100 characters)"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Description:</label>
            <textarea
              className="w-full p-2 border rounded min-h-[150px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              maxLength={500}
              placeholder="Enter announcement details (max 500 characters)"
            />
            <p className="text-sm text-gray-500 mt-1">
              {description.length}/500 characters
            </p>
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:bg-yellow-300 transition-colors"
            disabled={loading || !title.trim() || !description.trim()}
          >
            {loading ? 'Publishing...' : 'Publish Announcement'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MakeAnnouncement;