"use client";

import { useEffect, useMemo, useState } from "react";
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
import { AgGridReact } from "ag-grid-react";

const reviewCounts = [100, 200, 122, 270];

const reviewCountFormatter = (params: ValueFormatterParams) => {
  return params.value ? params.value : "";
};

const Home = () => {
  const dispatch = useAppDispatch();
  const { products } = useSelector((state: RootState) => state.home);
  const [rowData, setRowData] = useState<TProduct[]>([]);

  useEffect(() => {
    const newData = JSON.parse(JSON.stringify(products));
    setRowData(newData);
  }, [products]);

  const handleCellValueChanged = (e: any) => {
    const { data, newValue } = e;
    const updatedData: TProduct[] = rowData.map((product: TProduct) =>
      product.id === data.id
        ? { ...product, rating: { ...product.rating, count: newValue } }
        : product
    );
    dispatch(updateProductsAction(updatedData));
  };

  const cols: ColDef<TProduct>[] = [
    {
      colId: "1",
      field: "title",
      headerName: "Product Title",
      autoHeight: true,
      flex: 1,
      cellRenderer: (params: ICellRendererParams<TProduct>) => {
        return params.data ? (
          <div className="flex flex-row items-center h-16">
            <img
              src={params.data?.image}
              alt={params.data?.title}
              className=" w-12 h-12"
            />
            <div className="flex flex-col mx-2 items-start justify-center">
              <span className="text-md font-semibold">
                {params.data?.title}
              </span>
              <span className="text-sm font-normal">{params.data?.id}</span>
            </div>
          </div>
        ) : null;
      },
    },
    {
      colId: "2",
      field: "price",
      headerName: "Price",
      width: 100,
    },
    {
      colId: "3",
      field: "category",
      headerName: "Category",
      width: 200,
    },
    {
      colId: "4",
      field: "rating",
      headerName: "Rating",
      flex: 1,
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
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: reviewCounts,
      } as ISelectCellEditorParams,
      valueFormatter: reviewCountFormatter,
      onCellValueChanged: handleCellValueChanged,
    },
  ];

  useEffect(() => {
    dispatch(getAllProductsAction());
  }, [dispatch]);

  return (
    <section className=" h-[600px] m-4">
      <Table<TProduct> rows={rowData} cols={cols} />
    </section>
  );
};

export default Home;
