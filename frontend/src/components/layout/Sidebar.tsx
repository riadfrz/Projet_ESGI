import { NavLink } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';

const Sidebar = () => {
  const { user } = useAuthStore();
  const role = (user?.role || 'CLIENT') as string;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Challenges', path: '/dashboard/challenges', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { name: 'Workouts', path: '/dashboard/workouts', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064' },
    { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  const adminItems = [
    { name: 'Gyms', path: '/dashboard/admin/gyms', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { name: 'Users', path: '/dashboard/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  const ownerItems = [
    { name: 'My Gym', path: '/dashboard/owner/gym', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-dark-bg border-r border-white/5 overflow-y-auto hidden md:block">
      <div className="p-4 space-y-8">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Menu</h3>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {role === 'ADMIN' && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Admin</h3>
            <ul className="space-y-2">
              {adminItems.map((item) => (
                <li key={item.name}>
                 <NavLink
                  to={item.path}
                   className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                    <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        {role === 'OWNER' && (
           <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Management</h3>
            <ul className="space-y-2">
              {ownerItems.map((item) => (
                <li key={item.name}>
                 <NavLink
                  to={item.path}
                   className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                    <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
