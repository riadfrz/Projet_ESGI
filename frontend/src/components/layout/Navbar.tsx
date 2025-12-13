import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';

// import { useAuthStore } from '@/stores/authStore';
import { useAuthStore } from '@/stores/authStore';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore(); 
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
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">How it Works</a>
                <div className="flex items-center space-x-4 ml-4">
                  <Button variant="ghost" size="sm" href="/login">Login</Button>
                  <Button variant="primary" size="sm" href="/register">Get Started</Button>
                </div>
              </>
            ) : (
              <>
                 <Link to="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Dashboard</Link>
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
