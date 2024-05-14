import { AgGridReact } from "ag-grid-react";
import { type GridOptions, type ColDef } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMemo } from "react";

type TableProps<T> = {
  rows: T[];
  cols: ColDef<T>[];
};

const Table = <T,>({ rows, cols }: TableProps<T>) => {
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
    };
  }, []);

  return (
    <div className="ag-theme-quartz h-full">
      <AgGridReact<T>
        rowData={rows}
        columnDefs={cols}
        defaultColDef={defaultColDef}
      />
    </div>
  );
};

export default Table;
