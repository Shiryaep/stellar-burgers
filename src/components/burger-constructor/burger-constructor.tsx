import { clearConstructor } from '@/services/slices/constructorSlice';
import { clearOrderModal, createOrder } from '@/services/slices/ordersSlice';
import { useDispatch, useSelector } from '@/services/store';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(
    (state) =>
      state.constructor ?? {
        bun: null,
        ingredients: [],
      }
  );
  const orderRequest = useSelector((store) => store.orders.isCreating);
  const orderModalData = useSelector((store) => store.orders.orderModalData);
  const user = useSelector((store) => store.user.user);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      // TODO нужно сделать редирект - чекнуть доки
      return;
    }
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id,
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch((error) => {
        console.log('Ошибка при создании заказа:', error);
      });
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsList = Array.isArray(constructorItems.ingredients)
      ? constructorItems.ingredients
      : [];

    const ingredientsPrice = ingredientsList.reduce(
      (s: number, v: TConstructorIngredient) => s + v.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
