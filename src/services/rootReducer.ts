import { combineReducers } from '@reduxjs/toolkit';

import constructorReducer from './slices/constructorSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import ordersReducer from './slices/ordersSlice';
import userReducer from './slices/userSlice';

export const rootReducer = combineReducers({
  constructorButNotOOPConstructorLikeInCSharpFiveDaysOnErrorSearchSpentAAAAAAAAAAA:
    constructorReducer,
  ingredients: ingredientsReducer,
  orders: ordersReducer,
  user: userReducer,
});
