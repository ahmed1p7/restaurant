import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from './contexts/AuthContext';
import { OrdersProvider } from './contexts/OrdersContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import MainLayout from './components/MainLayout';
import KDS from './pages/KDS';
import Drinks from './pages/Drinks';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import Employees from './pages/Employees';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>جار التحميل...</p>
      </div>
    );
  }

  return (
    <OrdersProvider>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />

        <Route
          path="/kds"
          element={
            <ProtectedRoute allowedRoles={['kitchen']}>
              <KDS />
            </ProtectedRoute>
          }
        />

        <Route
          path="/drinks"
          element={
            <ProtectedRoute allowedRoles={['bar']}>
              <Drinks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute allowedRoles={['supervisor', 'waiter']}>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/pos" element={<POS />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* Fallback for unknown sub-paths */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </OrdersProvider>
  );
};

export default App;
