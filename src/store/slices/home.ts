/*
  This module defines a slice of state and related actions for managing home-related data in the Redux store.
*/

import { createSlice } from '@reduxjs/toolkit';
import { homeService } from '@/store/services';
import { AppDispatch } from '..';
import { TProduct } from '@/types';
import { REVIEW_COUNTS } from '@/helpers/constants';

type TCellToReview = {
  rowIndex: number;
  colKey: string;
};

export interface THomeState {
    loading: boolean;
    products: TProduct[];
    cellToReview: TCellToReview;
}

const initialState: THomeState = {
    loading: true,
    products:  [],
    cellToReview: {
      rowIndex: -1,
      colKey: "rating.count"
    }
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
      /**
       * The snippet below identifies the first unreviewed cell's rowIndex
       * For demo purposes, the colKey is hardcoded to 'rating.count', so this logic of review will 
       * always happens in "Total Reviews Count" column
       */
      const unreviewedCellRowIndex = action.payload.findIndex(
        (product: TProduct) => !REVIEW_COUNTS.includes(product.rating.count)
      );

      return {
        ...state,
        products: action.payload,
        loading: false,
        cellToReview: {
          ...state.cellToReview,
          rowIndex: unreviewedCellRowIndex,
        }
      };
    },
    getAllProductsFail: (state) => {
      return {
        ...state,
        loading: false,
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
  const { getAllProductsSuccess } = slice.actions;
  dispatch(getAllProductsSuccess(data));
};