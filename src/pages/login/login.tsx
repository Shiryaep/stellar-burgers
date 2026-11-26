import { getErrorsSelector, loginUser } from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';

import type { AppLocationState } from '@/utils/types';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const location = useLocation();

  const from = (location.state as AppLocationState | null)?.from;
  const error = useSelector(getErrorsSelector);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (email && password) {
      void dispatch(loginUser({ email, password })).unwrap().catch();
    } else return;
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      from={from}
    />
  );
};
