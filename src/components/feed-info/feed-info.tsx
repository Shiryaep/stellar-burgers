import { getFeeds } from '@/services/slices/ordersSlice';
import { useDispatch, useSelector } from '@/services/store';
import { FeedInfoUI } from '@ui';
import { useEffect } from 'react';

import type { TFeedState, TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    void dispatch(getFeeds());
  }, [dispatch]);

  const ordersState = useSelector((state) => state.orders);
  const { feedOrders, total, totalToday, isLoading, errors } = ordersState;

  const feed: TFeedState = {
    orders: feedOrders,
    total,
    totalToday,
    isLoading,
    error: errors,
  };

  const readyOrders = getOrders(feedOrders, 'done');
  const pendingOrders = getOrders(feedOrders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
