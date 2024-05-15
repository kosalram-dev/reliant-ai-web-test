/**
 * Table Component
 *
 * This component renders a table using the Ag-Grid library with React.
 * It allows customization of column definitions, row data, and various grid options.
 * The table can be easily integrated into NextJs applications for displaying tabular data.
 */

import { useMemo } from "react";

import { AgGridReact } from "ag-grid-react";
import {
  type ColDef,
  type GridOptions,
  type SizeColumnsToContentStrategy,
} from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

type TableProps<T> = {
  rows: T[];
  cols: ColDef<T>[];
  onGridReady?: (params: any) => void;
  title: string;
  children: React.ReactNode;
};

const Table = <T,>({
  rows,
  cols,
  onGridReady,
  title,
  children,
}: TableProps<T>) => {
  // Memoizing default column definition to prevent unnecessary re-renders
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    };
  }, []);

  // Memoizing grid options to prevent unnecessary re-renders
  const gridOptions = useMemo<GridOptions>(() => {
    return {
      rowHeight: 64,
    };
  }, []);

  // Memoizing auto size strategy to prevent unnecessary re-renders
  const autoSizeStrategy = useMemo<SizeColumnsToContentStrategy>(
    () => ({
      type: "fitCellContents",
    }),
    []
  );

  return (
    <div className="flex flex-col h-full card reliant-border">
      <div className="px-8 py-5 flex flex-row items-center justify-between">
        <h4 className="text-lg font-semibold text-black">{title}</h4>
        {children}
      </div>
      <div className="ag-theme-quartz h-full px-8 pb-8">
        <AgGridReact<T>
          rowData={rows}
          columnDefs={cols}
          defaultColDef={defaultColDef}
          gridOptions={gridOptions}
          onGridReady={(params) => {
            onGridReady?.(params);
          }}
          autoSizeStrategy={autoSizeStrategy}
        />
      </div>
    </div>
  );
};

export default Table;
