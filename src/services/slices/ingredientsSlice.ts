import { getIngredientsApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice, type SerializedError } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  errors: SerializedError | null;
};

const staticErrorMessage = 'Произошла ошибка при загрузке ингредиентов';

const initState: TIngredientsState = {
  ingredients: [],
  isLoading: true,
  errors: null,
};

export const getIngredients = createAsyncThunk('ingredients/getIngredients', async () =>
  getIngredientsApi()
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
        state.errors = null;
        state.ingredients = action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.error ?? staticErrorMessage;
      });
  },
});

export default ingredientsSlice.reducer;
