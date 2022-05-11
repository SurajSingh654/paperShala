import React, { useMemo } from "react";
import { COLUMNS } from "./Columns.js";
import { useTable } from "react-table";
import "./BasicTable.css";
const BasicTable = (props) => {
  // We use memoization so that data is not re-created on every render!
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => props.users, [props.users]);
  const tableInstance = useTable({
    columns,
    data,
  });
  console.log(props.users);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default BasicTable;
