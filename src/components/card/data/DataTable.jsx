import React from "react";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import Card from "components/card/Card";

export default function DataTable({ name, data, columns }) {
  const tableInstance = useTable(
    {
      columns: columns || [],
      data: data || [],
      initialState: { pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = tableInstance;

  return (
    <Card className="w-full px-0! overflow-x-auto">
      <span className="block ml-4 md:ml-5 text-(--text-primary) text-lg font-bold leading-none">
        {name}
      </span>
      <table {...getTableProps()} className="w-full mb-4">
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, i) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={i}
                  className="pr-2.5 cursor-pointer select-none"
                  style={{
                    borderColor: "var(--border-subtle)",
                    background: "var(--surface-secondary)",
                  }}
                >
                  <div className="flex justify-between items-center text-[10px] lg:text-xs text-gray-400 font-bold">
                    {column.render("header")}
                    {column.isSorted &&
                      (column.isSortedDesc ? (
                        <ArrowDown className="h-3 w-3 ml-1" />
                      ) : (
                        <ArrowUp className="h-3 w-3 ml-1" />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="border-none">
                <div className="flex justify-center py-8">
                  <span className="text-muted-foreground text-base">
                    No data available
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            page.map((row, index) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  key={index}
                  style={{ background: index % 2 === 1 ? "var(--surface-secondary)" : "transparent" }}
                >
                  {row.cells.map((cell, i) => (
                    <td
                      {...cell.getCellProps()}
                      key={i}
                      className="text-(--text-primary) text-sm min-w-24 border-none"
                    >
                      {cell.column.wrapper ? (
                        cell.column.wrapper(cell.value)
                      ) : (
                        <span className="text-base font-bold">
                          {cell.value}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      {pageCount > 1 && (
        <div className="flex justify-between items-center px-4 md:px-6.25 py-3">
          <span className="text-sm text-(--text-muted)">
            Page {pageIndex + 1} of {pageCount}
          </span>
          <div className="flex items-center gap-1">
            <button
              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
              disabled={!canPreviousPage}
              onClick={() => previousPage()}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
              disabled={!canNextPage}
              onClick={() => nextPage()}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
