import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">MR Institute</h2>
        </div>
        <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};
