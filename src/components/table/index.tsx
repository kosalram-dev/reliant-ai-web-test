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
};

const Table = <T,>({ rows, cols, onGridReady }: TableProps<T>) => {
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

  const gridOptions = useMemo<GridOptions>(() => {
    return {
      rowHeight: 64,
    };
  }, []);

  const autoSizeStrategy = useMemo<SizeColumnsToContentStrategy>(
    () => ({
      type: "fitCellContents",
    }),
    []
  );

  return (
    <div className="ag-theme-quartz h-full">
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
  );
};

export default Table;
