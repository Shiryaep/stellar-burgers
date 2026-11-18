import { useDispatch, useSelector } from '@/services/store';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const _dispatch = useDispatch();
  /** TODO: Взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector((store) => store.constructor);
  const orderRequest = useSelector((store) => store.orders.isCreating);
  const orderModalData = useSelector((store) => store.orders.orderModalData);
  const _user = useSelector((store) => store.user.user);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    // TODO: Оформить заказ
  };

  const closeOrderModal = (): void => {
    // TODO: Закрыть модальное окно и сбросить заказ
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

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
