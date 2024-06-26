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

// Function to format review counts for display in the table
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

  // Callback function for cell value change
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

  // Define column definitions for the table
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

  const handleSplitRow = useCallback(() => {
    const selectedRow = rowData[cellToReview.rowIndex];
    if (!selectedRow || !selectedRow.rating || !selectedRow.rating.count)
      return;

    // Get the available alternate values
    const alternateValues = REVIEW_COUNTS.filter(
      (count) => count !== selectedRow.rating.count
    );

    // Create a new row for each alternate value
    const updatedData: TProduct[] = alternateValues.map((count) => ({
      ...selectedRow,
      rating: { ...selectedRow.rating, count: count },
    }));

    // Insert the new rows by replacing the selected row
    const index = cellToReview.rowIndex + 1;
    const updatedRowData = [
      ...rowData.slice(0, index - 1),
      ...updatedData,
      ...rowData.slice(index),
    ];

    dispatch(updateProductsAction(updatedRowData));
  }, [cellToReview.rowIndex, dispatch, rowData]);

  return (
    <section className=" h-[600px] m-4">
      <Table<TProduct>
        rows={rowData}
        cols={cols}
        onGridReady={handleGridReady}
        title="Products"
      >
        <button
          type="button"
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          onClick={handleSplitRow}
        >
          Split Row
        </button>
      </Table>
    </section>
  );
};

export default Home;
