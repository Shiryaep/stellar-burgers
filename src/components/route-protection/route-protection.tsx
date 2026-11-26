import { getIsAuthCheckedSelector, getUserSelector } from '@/services/slices/userSlice';
import { useSelector } from '@/services/store';
import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '../ui';

import type { AppLocationState } from '@/utils/types';
import type { ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: ProtectedRouteProps): React.JSX.Element => {
  const user = useSelector((state) => getUserSelector(state));
  const isAuthChecked = useSelector((state) => getIsAuthCheckedSelector(state));
  const location = useLocation();

  const state = location.state as AppLocationState | null | undefined;

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate state={{ from: location }} to="/login" replace />;
  }

  if (onlyUnAuth && user) {
    const from = state?.from ?? { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
