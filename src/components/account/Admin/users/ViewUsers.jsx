import React from 'react';

const ViewUsers = ({ usersData }) => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedDepartment, setSelectedDepartment] = React.useState('');
  const [selectedGroup, setSelectedGroup] = React.useState('');
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [groups, setGroups] = React.useState([]);

  React.useEffect(() => {
    setUsers(usersData);
    setLoading(false);
  }, [usersData]);

  React.useEffect(() => {
    if (users && users?.length > 0) {
      // Filter users based on search term, department, and group
      const filtered = users.filter((user) => {
        const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = selectedDepartment ? user?.department?.name === selectedDepartment : true;
        const matchesGroup = selectedGroup ? user?.group?.some((group) => group.name === selectedGroup) : true;
        return matchesSearch && matchesDepartment && matchesGroup;
      });
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm, selectedDepartment, selectedGroup]);

  // Extract unique departments and groups from users
  React.useEffect(() => {
    if (users && users.length > 0) {
      const uniqueDepartments = Array.from(new Set(users.map((user) => user?.department?.name))).filter(Boolean);
      const uniqueGroups = Array.from(new Set(users.flatMap((user) => user?.group?.map((g) => g.name)))).filter(Boolean);
      setDepartments(uniqueDepartments);
      setGroups(uniqueGroups);
    }
  }, [users]);

  return (
    <div className="w-full  bg-white">
      {/* Filters */}
      <div className="flex items-center gap-1 lg:gap-5 mb-4 w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search user by name or email"
          className="border rounded py-1 px-3 w-full lg:w-[400px] focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <select onChange={(e) => setSelectedDepartment(e.target.value)} className="border rounded px-3 py-1 text-text-gray focus:outline-none focus:ring-1 focus:ring-primary">
          <option value="">All Departments</option>
          {departments?.length === 0 ? (
            <option value="" disabled>
              No Departments
            </option>
          ) : (
            departments?.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))
          )}
        </select>
        <select onChange={(e) => setSelectedGroup(e.target.value)} className="border rounded px-3 py-1 text-text-gray focus:outline-none focus:ring-1 focus:ring-primary">
          <option value="">All Groups</option>
          {groups?.length === 0 ? (
            <option value="" disabled>
              No Groups
            </option>
          ) : (
            groups?.map((group, index) => (
              <option key={index} value={group}>
                {group}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-thin">
        <table className="w-full bg-white">
          <thead className="bg-secondary text-white sticky top-0 z-5">
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">S/No</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Full Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Group</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-red-500">
                  {error}
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-2 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-2 whitespace-nowrap">{user.fullName}</td>
                  <td className="px-6 py-2 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-2 whitespace-nowrap">{user?.department?.name || 'N/A'}</td>
                  <td className="px-6 py-2 whitespace-nowrap">{user?.group?.map((g) => g.name).join(', ') || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewUsers;
