import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { getUsers, updateUserRole, promoteToAdmin, demoteToUser } from "../utils/useUser";
import { User, Mail, Trash2, ArrowUp, ArrowDown } from "lucide-react";

const ManageMembers = () => {
  const [loading, setLoading] = useState(true);

  
  const { data: allUsers = [], isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

 
  const members = allUsers.filter(user => user.role === "member");

  const handleRemoveMember = async (userId) => {
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
        await demoteToUser(userId);
        refetch(); 
        Swal.fire("Removed!", "The member has been demoted to user.", "success");
      } catch (error) {
        // //console.error("Failed to update user role:", error);
        Swal.fire("Error!", error.response?.data?.message || "Failed to remove member.", "error");
      }
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    const result = await Swal.fire({
      title: "Promote to Admin?",
      text: "This user will have admin privileges.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, promote!",
    });

    if (result.isConfirmed) {
      try {
        await promoteToAdmin(userId);
        refetch();
        Swal.fire("Promoted!", "The member has been promoted to admin.", "success");
      } catch (error) {
        // //console.error("Failed to promote user:", error);
        Swal.fire("Error!", error.response?.data?.message || "Failed to promote member.", "error");
      }
    }
  };

  // Function to get display name - use email if name is not available
  const getDisplayName = (user) => {
    return user.name || user.email.split('@')[0]; // Use first part of email if name doesn't exist
  };

  return (
    <div className="p-6 border-l border-l-gray-200">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <User className="text-blue-500" />
        Manage Members
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.length > 0 ? (
                  members.map((member) => (
                    <tr key={member._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {member.photoURL ? (
                              <img className="h-10 w-10 rounded-full" src={member.photoURL} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {getDisplayName(member)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handlePromoteToAdmin(member._id)}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1 px-3 py-1 border border-green-200 rounded"
                          title="Promote to Admin"
                        >
                          <ArrowUp className="w-4 h-4" />
                          Promote
                        </button>
                        <button
                          onClick={() => handleRemoveMember(member._id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1 px-3 py-1 border border-red-200 rounded"
                          title="Demote to User"
                        >
                          <ArrowDown className="w-4 h-4" />
                          Demote
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                      No members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMembers;