import { getUserSelector } from '@/services/slices/userSlice';
import { AppHeaderUI } from '@ui';

import { useSelector } from '../../services/store';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector((state) => getUserSelector(state));
  const userName = user?.name;

  return <AppHeaderUI userName={userName} />;
};
