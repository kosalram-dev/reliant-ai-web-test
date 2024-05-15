import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Table from ".";
import { ColDef } from "ag-grid-community";

describe("Table", () => {
  test("renders correctly", () => {
    // Example data for testing
    const rows = [
      { id: 1, name: "John", age: 30 },
      { id: 2, name: "Jane", age: 25 },
    ];
    const columns: ColDef[] = [
      { field: "id", headerName: "ID" },
      { field: "name", headerName: "Name" },
      { field: "age", headerName: "Age" },
    ];
    const title = "Test Table";

    render(<Table rows={rows} cols={columns} title={title} />);

    // Check if the title is rendered correctly
    const tableTitle = screen.getByText(title);
    expect(tableTitle).toBeTruthy();

    // Check if column headers are rendered correctly
    const columnHeaderIDs = columns.map((col) => col.headerName);
    columnHeaderIDs.forEach((headerName) => {
      const columnHeader = screen.getByText(headerName);
      expect(columnHeader).toBeTruthy();
    });

    // Check if row data is rendered correctly
    rows.forEach((row) => {
      Object.values(row).forEach((value) => {
        const cellData = screen.getByText(value.toString());
        expect(cellData).toBeTruthy();
      });
    });
  });
});
