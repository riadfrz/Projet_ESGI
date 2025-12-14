import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';

// import { useAuthStore } from '@/stores/authStore';
import { useAuthStore } from '@/stores/authStore';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuthStore(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-dark-bg/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-neon-blue to-neon-purple font-display tracking-wider">
              NEO<span className="text-white">FIT</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Login</Link>
                <Button href="/register" size="sm">Get Started</Button>
              </>
            ) : (
              <>
                <Link to="/dashboard/profile" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-neon-blue to-neon-purple flex items-center justify-center text-xs font-bold text-white group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all">
                    {(user?.firstName?.[0] || 'U').toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden md:block">
                    {user?.firstName} {user?.lastName}
                  </span>
                </Link>
                <Button variant="secondary" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white">
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
