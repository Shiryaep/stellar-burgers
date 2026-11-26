import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  type TLoginData,
  type TRegisterData,
} from '@/utils/burger-api';
import { deleteCookie, setCookie } from '@/utils/cookie';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TUser } from '@/utils/types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  errors: string | null;
};

const staticLoginUserErrorMessage = 'Произошла ошибка при попытке входа';
const staticRegisterUserErrorMessage = 'Произошла ошибка при попытке регистрации';
const staticLogoutUserErrorMessage = 'Произошла ошибка при попытке выхода из профиля';
const staticUpdateUserErrorMessage = 'Произошла ошибка при попытке обновить профиль';

const initState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  errors: null,
};

export const getUser = createAsyncThunk('user/getUser', async () => {
  const data = await getUserApi();
  return data.user;
});

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const result = await registerUserApi(data);
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    return result.user;
  }
);

export const loginUser = createAsyncThunk('user/login', async (data: TLoginData) => {
  const result = await loginUserApi(data);
  setCookie('accessToken', result.accessToken);
  localStorage.setItem('refreshToken', result.refreshToken);
  return result.user;
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const result = await updateUserApi(data);
    return result.user;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState: initState,
  reducers: {},
  selectors: {
    getUserSelector: (state) => state.user,
    getIsAuthCheckedSelector: (state) => state.isAuthChecked,
    getErrorsSelector: (state) => state.errors,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.user = null;
        state.isLoading = false;
        state.isAuthChecked = true;
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.error.message ?? staticLoginUserErrorMessage;
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.error.message ?? staticRegisterUserErrorMessage;
      })

      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.errors = action.error.message ?? staticLogoutUserErrorMessage;
      })

      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.error.message ?? staticUpdateUserErrorMessage;
      });
  },
});

export const { getUserSelector, getIsAuthCheckedSelector, getErrorsSelector } =
  userSlice.selectors;
export default userSlice.reducer;
