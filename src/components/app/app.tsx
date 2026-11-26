import { getIngredients } from '@/services/slices/ingredientsSlice';
import { getUser } from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import { AppHeader } from '@components';
import { useEffect } from 'react';

import { AppContent } from '../app-content/app-content';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const isIngredientsLoading = useSelector((state) => state.ingredients.isLoading);
  const ingredientsError = useSelector((state) => state.ingredients.errors);

  useEffect(() => {
    void dispatch(getIngredients());
    void dispatch(getUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;
