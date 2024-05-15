"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type ICellRendererParams,
  type ISelectCellEditorParams,
  type ColDef,
  type ValueFormatterParams,
} from "ag-grid-community";

import { Rating, Table } from "@/components";
import { RootState, useAppDispatch, useSelector } from "@/store";
import {
  getAllProductsAction,
  updateProductsAction,
} from "@/store/slices/home";

import { type TProduct } from "@/types";
import { REVIEW_COUNTS } from "@/helpers/constants";

const reviewCountFormatter = (params: ValueFormatterParams) => {
  return params.value ? params.value : "";
};

const Home = () => {
  const dispatch = useAppDispatch();
  const { products, cellToReview } = useSelector(
    (state: RootState) => state.home
  );
  const [rowData, setRowData] = useState<TProduct[]>([]);

  useEffect(() => {
    const newData = JSON.parse(JSON.stringify(products));
    setRowData(newData);
  }, [products]);

  const handleCellValueChanged = useCallback(
    (e: any) => {
      const { data, newValue } = e;
      const updatedData: TProduct[] = rowData.map((product: TProduct) =>
        product.id === data.id
          ? { ...product, rating: { ...product.rating, count: newValue } }
          : product
      );
      dispatch(updateProductsAction(updatedData));
    },
    [dispatch, rowData]
  );

  const cols: ColDef<TProduct>[] = useMemo(
    () => [
      {
        colId: "1",
        field: "title",
        headerName: "Product Title",
        editable: false,
        flex: 1,
        cellRenderer: (params: ICellRendererParams<TProduct>) => {
          return params.data ? (
            <div className="flex flex-row items-center min-h-16">
              <img
                src={params.data?.image}
                alt={params.data?.title}
                className=" w-12 h-12"
              />
              <div className="flex flex-col mx-2 items-start justify-center">
                <span className="text-md font-semibold">
                  {params.data?.title}
                </span>
              </div>
            </div>
          ) : null;
        },
      },
      {
        colId: "2",
        field: "price",
        editable: true,
        headerName: "Price",
        width: 100,
      },
      {
        colId: "3",
        field: "category",
        editable: false,
        headerName: "Category",
        width: 200,
      },
      {
        colId: "4",
        field: "rating",
        headerName: "Rating",
        editable: false,
        cellRenderer: (params: ICellRendererParams<TProduct>) => {
          return params.data ? (
            <Rating
              count={params.data.rating.count}
              rate={params.data.rating.rate}
            />
          ) : null;
        },
      },
      {
        colId: "5",
        field: "rating.count",
        headerName: "Total Reviews Count",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: REVIEW_COUNTS,
        } as ISelectCellEditorParams,
        valueFormatter: reviewCountFormatter,
        onCellValueChanged: handleCellValueChanged,
        cellStyle: (params) => {
          const defaultCellStyle = {
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
          };
          if (params.rowIndex === cellToReview.rowIndex) {
            return {
              ...defaultCellStyle,
              border: "2px solid red",
            };
          }
          if (params.value && !REVIEW_COUNTS.includes(params.value)) {
            return {
              ...defaultCellStyle,
              backgroundColor: "#ffcc",
            };
          }
          return defaultCellStyle;
        },
      },
    ],
    [handleCellValueChanged, cellToReview.rowIndex]
  );

  useEffect(() => {
    dispatch(getAllProductsAction());
  }, [dispatch]);

  /**
   * On Grid Ready, the first cell that needs to be reviewed will be focused
   */
  const handleGridReady = useCallback(
    (params: any) => {
      // Find the first unreviewed cell and focus it
      if (cellToReview.rowIndex !== -1) {
        params.api.startEditingCell({
          rowIndex: cellToReview.rowIndex,
          colKey: cellToReview.colKey,
        });
      }
    },
    [cellToReview.colKey, cellToReview.rowIndex]
  );

  return (
    <section className=" h-[600px] m-4">
      <Table<TProduct>
        rows={rowData}
        cols={cols}
        onGridReady={handleGridReady}
      />
    </section>
  );
};

export default Home;
