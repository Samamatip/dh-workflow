import React from 'react';
import { useUndevelopedFunctionality } from '@/contexts/UndevelopedFunctionalityWarning';

const sampleDepartments = [
  {
    _id: 1,
    name: 'Arthurs',
  },
  {
    _id: 2,
    name: 'Transitions',
  },
  {
    _id: 3,
    name: 'Mews',
  },
];

const sampleGroups = [
  {
    _id: 1,
    name: 'Bank staff',
  },
  {
    _id: 2,
    name: 'Day staff',
  },
  {
    _id: 3,
    name: 'Night staff',
  },
  {
    _id: 4,
    name: 'Night bank staff',
  },
];

const Groups = ({ usersData }) => {
  const [departments, setDepartments] = React.useState([]);
  const [groups, setGroups] = React.useState([]);
  const [openstaffs, setOpenStaffs] = React.useState({});

  const {showWarning} = useUndevelopedFunctionality();

  React.useEffect(() => {
    setDepartments(sampleDepartments);
    setGroups(sampleGroups);
  }, []);

  const filterUsersByDepartment = (departmentName) => {
    if (!usersData || usersData.length === 0) return [];
    return usersData.filter((user) => user.department?.name === departmentName);
  };

  const filterUsersByGroup = (groupName) => {
    if (!usersData || usersData.length === 0) return [];
    return usersData.filter((user) => user.group?.some((group) => group.name === groupName));
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {/* departments side bar */}
      <div className="w-full rounded-sm bg-white flex flex-row gap-2 justify-between items-center h-fit border-1 pr-1">
        <h2 className="text-white text-base font-bold h-full lg:w-1/6 text-center bg-primary lg:py-5 py-6 w-fit px-1">Departments</h2>
        <ul className="flex justify-center lg:gap-5 gap-3 items-center overflow-x-auto scrollbar-thin flex-row bg-white lg:max-w-2/3 max-w-1/3 h-full py-2 rounded-b-sm">
          {departments && departments.length > 1 ? (
            departments.map((dept) => (
              <li key={dept._id} className="w-full text-center text-secondary rounded-md cursor-pointer font-semibold">
                {dept.name}
              </li>
            ))
          ) : (
            <li className="text-center text-text-gray py-1">No Departments found</li>
          )}
        </ul>
        <button onClick={showWarning} className="text-center text-white rounded-md cursor-pointer bg-secondary hover:scale-102 lg:py-3 py-3 px-1 shadow-md w-fit">Add new department</button>
      </div>

      {/* list groups and the staffs in the groups */}
      <div className="lg:w-full rounded-sm bg-white flex flex-col gap-2 justify-between items-center h-fit shadow-md pr-1">
        <ul className="flex justify-center lg:gap-5 gap-3 items-center overflow-x-auto scrollbar-thin flex-col bg-white lg:max-w-2/3 h-full py-2 rounded-b-sm w-full">
          {groups && groups.length > 1 ? (
            groups.map((group) => (
              <li key={group._id} className="w-full text-center text-secondary rounded-md cursor-pointer font-semibold">
                <span
                  onClick={() =>
                    setOpenStaffs((prev) => ({
                      ...prev,
                      [group.name]: !prev[group.name],
                    }))
                  }
                  className="flex items-center justify-between bg-gray-300 px-1 py-1 text-primary  rounded-sm"
                >
                  <span>{group.name}</span>
                  <span className="text-text-gray text-sm ml-2 cursor-pointer">
                    <span>({filterUsersByGroup(group.name).length} staff)</span>
                    <span className="px-1 py-1 bg-success rounded-sm mx-1 text-white cursor-pointer hover:bg-green-600 transition-colors" onClick={showWarning}> + Add a user</span>
                    {/* Toggle icon for showing/hiding staff */}
                    <span className="ml-5" title={`${openstaffs[group.name] ? 'Close list' : 'Open list'}`}>
                      {openstaffs[group.name] ? '▼' : '◀'}
                    </span>
                  </span>
                </span>
                {openstaffs[group.name] && (
                  <ul className="flex flex-col gap-1 mt-2">
                    {filterUsersByGroup(group.name).length > 0 ? (
                      filterUsersByGroup(group.name).map((user) => (
                        <li key={user._id} className="text-text-gray text-sm border-b border-gray-200 font-thin flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer">
                          <span>
                            {user.fullName} ({user.email}) {user?.department?.name ? `- ${user.department.name}` : ''}
                          </span>
                          <span title="Remove from group" className="bg-error p-1 text-white rounded-full px-2 cursor-pointer hover:bg-red-600 transition-colors" onClick={showWarning}>
                            X
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-text-gray text-sm">No staff in this group</li>
                    )}
                  </ul>
                )}
              </li>
            ))
          ) : (
            <li className="text-center text-text-gray py-10">No Groups found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Groups;
