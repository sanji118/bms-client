import { useState } from "react";
import Swal from "sweetalert2";
import { createAnnouncement } from "../utils";
import { MdCampaign } from "react-icons/md";

const MakeAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      Swal.fire("Validation Error!", "Please fill in all fields.", "warning");
      return;
    }

    setLoading(true);

    try {
      await createAnnouncement({ title, description });

      Swal.fire("Success!", "Announcement has been published.", "success");
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Failed to create announcement:", error);
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Failed to publish announcement.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-white p-4">
      <div className="bg-white shadow-2xl rounded-xl max-w-3xl w-full p-8">
        <div className="flex items-center mb-6">
          <MdCampaign className="text-3xl text-yellow-500 mr-2" />
          <h2 className="text-3xl font-extrabold text-gray-800">
            Make an Announcement
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-lg p-3 transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              placeholder="Enter a short title for your announcement"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-lg p-3 min-h-[150px] transition-all"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              placeholder="Write your announcement details here"
              required
            />
            <div className="text-sm text-gray-500 text-right">
              {description.length}/500 characters
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !title.trim() || !description.trim()}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md disabled:bg-yellow-300 transition-all w-full"
          >
            {loading ? "Publishing..." : " Publish Announcement"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MakeAnnouncement;
