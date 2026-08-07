import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../../hooks';
import type { Role } from '../../types';
import { ROUTES } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { PageLoader } from '../ui/Loaders';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const { user, loading } = useAuth();
  const { checkPermission } = usePermissions();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  const hasAccess = allowedRoles.some(role => checkPermission(role));

  if (!hasAccess) {
    return <Navigate to={ROUTES.ERROR.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};
