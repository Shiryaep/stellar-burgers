import { clearOrderByNumber, getOrderByNumber } from '@/services/slices/ordersSlice';
import { useDispatch, useSelector } from '@/services/store';
import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);

  const openedInModal = !!(location.state as { background?: Location } | null)
    ?.background;

  const orderByNumber = useSelector((state) => state.orders.orderByNumber);
  const userOrders = useSelector((state) => state.orders.userOrders);
  const feedOrders = useSelector((state) => state.orders.feedOrders);
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  const cachedOrder = useMemo(
    () =>
      [...feedOrders, ...userOrders].find((order) => order.number === orderNumber) ??
      null,
    [feedOrders, userOrders, orderNumber]
  );

  useEffect(() => {
    if (!number) return;

    if (cachedOrder) {
      dispatch(clearOrderByNumber());
      return;
    }

    dispatch(clearOrderByNumber());
    void dispatch(getOrderByNumber(Number(number)));
  }, [dispatch, number, orderNumber, cachedOrder]);

  const orderData = cachedOrder ?? orderByNumber;

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} openedInModal={openedInModal} />;
};
