/**
 * Example: Login Page Component
 * 
 * Shows different login options: Development login and Google OAuth.
 * In production, you would hide the dev login option.
 */

import { useDevLogin, useGoogleLogin } from '@/api/queries';
import { useAuthStore } from '@/stores';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    
    const { mutate: devLogin, isPending: isDevLoginPending } = useDevLogin();
    const { mutate: googleLogin } = useGoogleLogin();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleDevLogin = (role: 'CLIENT' | 'ADMIN' | 'GYM_OWNER') => {
        devLogin(
            {
                email: `${role.toLowerCase()}@test.com`,
                role,
                firstName: 'Test',
                lastName: role,
            },
            {
                onSuccess: () => {
                    navigate('/dashboard');
                },
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="space-y-4">
                    {/* Google OAuth Login */}
                    <button
                        onClick={() => googleLogin()}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Development Login Section */}
                    {process.env.NODE_ENV === 'development' && (
                        <>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Or for testing
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-gray-600 text-center">
                                    Quick Dev Login:
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => handleDevLogin('CLIENT')}
                                        disabled={isDevLoginPending}
                                        className="px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                                    >
                                        Client
                                    </button>
                                    <button
                                        onClick={() => handleDevLogin('GYM_OWNER')}
                                        disabled={isDevLoginPending}
                                        className="px-4 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-50"
                                    >
                                        Gym Owner
                                    </button>
                                    <button
                                        onClick={() => handleDevLogin('ADMIN')}
                                        disabled={isDevLoginPending}
                                        className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                                    >
                                        Admin
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Example Usage in Router:
 * 
 * import { LoginPage } from '@/pages/LoginPage';
 * 
 * <Route path="/login" element={<LoginPage />} />
 */
