import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users?role=member');
        setMembers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching members:', error);
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleRemoveMember = async (userId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will demote the member to a regular user.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`http://localhost:5000/users/${userId}`, { role: 'user' });
        setMembers(members.filter(member => member._id !== userId));
        Swal.fire(
          'Removed!',
          'The member has been demoted to user.',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Error!',
          'Failed to remove member.',
          'error'
        );
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Members</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((member) => (
                  <tr key={member._id} className="border-t">
                    <td className="py-3 px-4">{member.name}</td>
                    <td className="py-3 px-4">{member.email}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                    No members found
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