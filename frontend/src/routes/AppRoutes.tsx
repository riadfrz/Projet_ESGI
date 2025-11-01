
import PrivateRoutes from '@/routes/PrivateRoutes';
import PublicRoutes from '@/routes/PublicRoutes';

import { Navigate, Route, Routes } from 'react-router-dom';



const AppRoutes = () => {
    // const { isAuthenticated, user } = useAuthStore()
    // Only load application parameters after login

    const isAuthenticated = false;




    const isExpanded = true; // pour l'instant je met comme ca parce que je sais comment tu vas faire le frontend donc je te laisse gerer ca. @TODO Ryadh

    return (

        <div className="flex min-h-screen flex-col overflow-x-hidden">
            <main
                className={`min-h-[calc(100vh-10rem)] flex-1 transition-all duration-300 ${isAuthenticated ? `${isExpanded ? 'ml-80 max-w-[calc(100vw-23rem)]' : 'ml-20 max-w-[calc(100vw-5rem)]'}` : ''}`}
            >
                <Routes>
                    {/* Routes publiques */}
                    <Route element={<PublicRoutes />}>

                    </Route>

                    {/* Routes privées */}
                    <Route element={<PrivateRoutes />}>

                    </Route>

                    {/* Route par défaut */}
                    {isAuthenticated && (
                        <>
                            <Route path="/" element={<Navigate to="/folders" replace />} />
                            <Route path="*" element={<Navigate to="/folders" replace />} />

                        </>
                    )}
                    {!isAuthenticated && (
                        <>
                            <Route path="/" element={<Navigate to="/login" replace />} />
                            <Route path="*" element={<Navigate to="/login" replace />} />

                        </>
                    )}
                </Routes>
            </main>
        </div>
    );
};

export default AppRoutes;
