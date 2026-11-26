import { createSlice, nanoid } from '@reduxjs/toolkit';

import { createOrder } from './ordersSlice';

import type {
  TConstructorIngredient,
  TIngredient,
  TConstructorState,
} from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

const initState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const resetConstructorState = (state: TConstructorState): void => {
  state.bun = null;
  state.ingredients = [];
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: initState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        return { payload: { ...ingredient, id: nanoid() } };
      },
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ indexFrom: number; indexTo: number }>
    ) => {
      const { indexFrom, indexTo } = action.payload;
      if (indexTo < 0 || indexTo > state.ingredients.length - 1) return;
      const movingIngredient = state.ingredients.splice(indexFrom, 1)[0];
      state.ingredients.splice(indexTo, 0, movingIngredient);
    },
    clearConstructor: resetConstructorState,
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.fulfilled, resetConstructorState);
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } =
  constructorSlice.actions;
export default constructorSlice.reducer;
