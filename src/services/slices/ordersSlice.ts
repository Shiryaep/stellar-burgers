import {
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi,
} from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@/utils/types';

type TOrdersState = {
  feedOrders: TOrder[];
  userOrders: TOrder[];
  total: number;
  totalToday: number;

  isCreating: boolean;
  orderModalData: TOrder | null;

  orderByNumber: TOrder | null;
  isGettingByNumber: boolean;

  isLoading: boolean;
  errors: string | null;
};

const staticCreateOrderErrorMessage = 'Произошла ошибка при попытке оформить заказ';
const staticGetFeedsErrorMessage = 'Произошла ошибка при загрузке ленты заказов';
const staticGetUserOrdersErrorMessage = 'Произошла ошибка при загрузке заказов клиента';
const staticGetOrderByNumberErrorMessage = 'Произошла ошибка при загрузке заказа по ID';

const initState: TOrdersState = {
  feedOrders: [],
  userOrders: [],
  total: 0,
  totalToday: 0,

  isCreating: false,
  orderModalData: null,

  orderByNumber: null,
  isGettingByNumber: false,

  isLoading: false,
  errors: null,
};

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredientIds: string[]) => {
    const data = await orderBurgerApi(ingredientIds);
    return data.order;
  }
);

export const getFeeds = createAsyncThunk('orders/getFeeds', async () => {
  return await getFeedsApi();
});

export const getUserOrders = createAsyncThunk('orders/getUserOrders', async () => {
  return await getOrdersApi();
});

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number) => await getOrderByNumberApi(number)
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: initState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.isCreating = false;
    },
    clearOrderByNumber: (state) => {
      state.orderByNumber = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isCreating = true;
        state.errors = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isCreating = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isCreating = false;
        state.errors = action.error.message ?? staticCreateOrderErrorMessage;
      });

    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.feedOrders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.error.message ?? staticGetFeedsErrorMessage;
      });

    builder
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        state.isLoading = false;
        state.errors = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.error.message ?? staticGetUserOrdersErrorMessage;
      });

    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.isGettingByNumber = true;
        state.errors = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isGettingByNumber = false;
        state.orderByNumber = action.payload.orders[0];
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isGettingByNumber = false;
        state.errors = action.error.message ?? staticGetOrderByNumberErrorMessage;
      });
  },
});

export const { clearOrderModal, clearOrderByNumber } = ordersSlice.actions;
export default ordersSlice.reducer;
