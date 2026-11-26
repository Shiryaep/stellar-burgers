import { getErrorsSelector, registerUser } from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';

import type { AppLocationState } from '@/utils/types';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const location = useLocation();

  const from = (location.state as AppLocationState | null)?.from;
  const error = useSelector((state) => getErrorsSelector(state));

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (email && password && userName) {
      void dispatch(registerUser({ email, password, name: userName }))
        .unwrap()
        .catch();
    } else return;
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
      from={from}
    />
  );
};
