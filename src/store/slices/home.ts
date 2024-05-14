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
    products:  [],
};

const slice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    getAllProductsRequest: (state) => {
      return {
        ...state,
        loading: true,
      }
    },
    getAllProductsSuccess: (state, action) => {
      return {
        ...state,
        products: action.payload,
        loading: false,
      };
    },
    getAllProductsFail: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    updateProducts: (state, action) => {
      const data = action.payload;

      return {
        ...state,
        products: data,
      };
    },
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

export const updateProductsAction = (data: TProduct[]) => async (dispatch: AppDispatch) => {
  const { updateProducts } = slice.actions;
  dispatch(updateProducts(data));
};