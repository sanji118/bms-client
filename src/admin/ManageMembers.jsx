import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getUsers, updateUserRole, formatDate } from "../utils";
import { User, Mail, Trash2 } from "lucide-react";

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const allUsers = await getUsers();
        const memberUsers = allUsers.filter(user => user.role === "member");
        setMembers(memberUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching members:", error);
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleRemoveMember = async (userId, email) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will demote the member to a regular user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove!",
    });

    if (result.isConfirmed) {
      try {
        await updateUserRole(email, "user");
        setMembers(members.filter((member) => member._id !== userId));
        Swal.fire("Removed!", "The member has been demoted to user.", "success");
      } catch (error) {
        console.error("Failed to update user role:", error);
        Swal.fire("Error!", "Failed to remove member.", "error");
      }
    }
  };

  return (
    <div className="p-6 border-l border-l-lime-300">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-lime-700">
        <User className="text-yellow-700" />
        Manage Members
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-lime-100 text-left text-sm text-gray-600">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((member) => (
                  <tr key={member._id} className="border-t border-t-lime-600 hover:bg-lime-50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        {member.name}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {member.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleRemoveMember(member._id, member.email)}
                        className="btn btn-sm bg-red-100 text-red-600 hover:bg-red-200 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageMembers;
