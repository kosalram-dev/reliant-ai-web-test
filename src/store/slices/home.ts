import { createSlice } from '@reduxjs/toolkit';
import { homeService } from '@/store/services';
import { AppDispatch } from '..';
import { TProduct } from '@/types';

export interface THomeState {
    loading: boolean;
    products: TProduct[];
}

const initialState: THomeState = {
    loading: true,
    products:  []
};

const slice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    getAllProductsRequest: (state) => state,
    getAllProductsSuccess: (state) => state,
    getAllProductsFail: (state) => state,
  },
});

export const { reducer } = slice;

export const getAllProductsAction = () => async (dispatch: AppDispatch) => {
  const { getAllProductsRequest, getAllProductsSuccess, getAllProductsFail } =
    slice.actions;
  try {
    dispatch(getAllProductsRequest());
    const response = await homeService.getAllProducts();
    dispatch(getAllProductsSuccess(response.data));
  } catch (err) {
    dispatch(getAllProductsFail());
  }
};


