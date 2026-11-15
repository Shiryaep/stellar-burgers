import { getIngredientsApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  errors: string | null;
};

const staticErrorMessage = 'Произошла ошибка при загрузке ингредиентов';

const initState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  errors: null,
};

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async () => {
    return await getIngredientsApi();
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.error.message ?? staticErrorMessage;
      });
  },
});
