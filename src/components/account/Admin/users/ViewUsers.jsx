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
    <div className="w-full">
      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Users</h3>
        <div className="space-y-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select 
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm appearance-none bg-white bg-no-repeat bg-right bg-[length:1rem] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23374151%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] pr-10"
              >
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
              <select 
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm appearance-none bg-white bg-no-repeat bg-right bg-[length:1rem] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23374151%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] pr-10"
              >
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
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-secondary text-white">
              <tr>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">S/No</th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Department</th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Groups</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
                      <span className="text-gray-600 font-medium">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mx-4">
                      <div className="text-red-600 font-medium text-lg mb-2">Error Loading Users</div>
                      <p className="text-red-700">{error}</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mx-4">
                      <div className="text-gray-600 font-medium text-lg mb-2">No users found</div>
                      <p className="text-gray-500">Try adjusting your search criteria or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-sm text-gray-500 sm:hidden mt-1">{user.email}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{user?.department?.name || 'N/A'}</div>
                      <div className="text-xs text-gray-500 lg:hidden mt-1">
                        {user?.group?.length > 0 ? user.group.map((g) => g.name).join(', ') : 'No Groups'}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 hidden lg:table-cell">
                      {user?.group?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.group.map((g, idx) => (
                            <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              {g.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No Groups</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results summary */}
      {!loading && !error && filteredUsers.length > 0 && (
        <div className="mt-4 px-4 py-3 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
