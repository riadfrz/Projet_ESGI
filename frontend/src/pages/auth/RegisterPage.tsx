import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { authService } from '@/api/authServices';
import { UserRole } from '@/types';

const RegisterPage = () => {
  const [role, setRole] = useState<UserRole>('CLIENT');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gymName: '', // For Owner
    address: '', // For Owner
    secretCode: '', // For Admin
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      console.log('Registering as', role, formData);
      
      const response = await authService.register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: role,
          // Add other fields as needed based on DTO
          gymName: formData.gymName,
          address: formData.address,
          secretCode: formData.secretCode
      });

      if (response && (response.status === 200 || response.status === 201)) {
          navigate('/login');
      } else {
          throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4 relative overflow-hidden py-12">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

      <Card className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-3xl font-bold font-display bg-clip-text text-transparent bg-linear-to-r from-neon-blue to-neon-purple mb-2">
            NEOFIT
          </Link>
          <h2 className="text-xl text-gray-400">Create an Account</h2>
        </div>

        <div className="flex p-1 bg-dark-bg rounded-xl mb-8 border border-white/5">
          {(['CLIENT', 'GYM_OWNER', 'ADMIN'] as UserRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                role === r 
                  ? 'bg-dark-surface text-white shadow-lg border border-white/10' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {r === 'CLIENT' ? 'Client' : r === 'GYM_OWNER' ? 'Gym Owner' : 'Super Admin'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role specific fields */}
          {role === 'GYM_OWNER' && (
            <div className="space-y-6 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-lg font-medium text-neon-purple">Gym Details</h3>
              <Input
                label="Gym Name"
                name="gymName"
                 value={formData.gymName}
                onChange={handleChange}
                required
              />
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {role === 'ADMIN' && (
            <div className="space-y-6 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-300">
               <h3 className="text-lg font-medium text-neon-cyan">Admin Verification</h3>
               <Input
                label="Secret Access Code"
                type="password"
                name="secretCode"
                value={formData.secretCode}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <Button 
            type="submit" 
            fullWidth 
            size="lg" 
            isLoading={loading}
            className="mt-8"
            variant={role === 'CLIENT' ? 'primary' : role === 'GYM_OWNER' ? 'secondary' : 'ghost'} // Just utilizing variants for fun, typically keep primary
          >
             {role === 'CLIENT' ? 'Join Challenge' : role === 'GYM_OWNER' ? 'Register Gym' : 'Access Admin'}
          </Button>
        </form>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-neon-blue hover:text-neon-accent hover:underline transition-all">
            Log in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
