import { useAuth } from '../contexts/AuthContext';
import type { Role } from '../types';
import { hasPermission } from '../utils';

export const usePermissions = () => {
  const { user } = useAuth();

  const checkPermission = (requiredRole: Role) => {
    if (!user) return false;
    return hasPermission(user.role, requiredRole);
  };

  const isDeveloper = checkPermission('DEVELOPER');
  const isOfficeAdmin = checkPermission('OFFICE_ADMIN');

  return {
    isDeveloper,
    isOfficeAdmin,
    checkPermission,
  };
};
