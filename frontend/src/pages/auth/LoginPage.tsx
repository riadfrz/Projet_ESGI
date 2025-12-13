import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

import { authService } from '@/api/authServices';
import { useAuthStore } from '@/stores/authStore';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });
      
      // Force status update (although checkAuth might be enough, usually login returns user or token)
      // If login returns tokens, we might need to fetch user separately or authService handles it.
      // Assuming login sets cookies, we just need to fetch user state.
      if (response && response.status === 200) {
        await checkAuth(); // Updates store state
        navigate('/dashboard');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <Card className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-3xl font-bold font-display bg-clip-text text-transparent bg-linear-to-r from-neon-blue to-neon-purple mb-2">
            NEOFIT
          </Link>
          <h2 className="text-xl text-gray-400">Welcome Back</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            fullWidth 
            size="lg" 
            isLoading={loading}
            className="shadow-lg shadow-neon-blue/20"
          >
            Log In
          </Button>
        </form>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-neon-blue hover:text-neon-accent hover:underline transition-all">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
