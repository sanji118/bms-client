import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const MakeAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/announcements', {
        title,
        description
      });
      
      Swal.fire(
        'Success!',
        'Announcement has been published.',
        'success'
      );
      setTitle("");
      setDescription("");
    } catch (error) {
      Swal.fire(
        'Error!',
        'Failed to publish announcement.',
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
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Description:</label>
            <textarea
              className="w-full p-2 border rounded min-h-[150px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish Announcement'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MakeAnnouncement;