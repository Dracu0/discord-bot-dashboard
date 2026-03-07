import React from "react";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight, TableProperties } from "lucide-react";
import Card from "components/card/Card";
import { CardSectionHeader } from "components/card/primitives";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { useTranslation } from "utils/Language";

export default function DataTable({ name, data, columns, description }) {
  const { t } = useTranslation();
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
    nextPage,
    previousPage,
    state: { pageIndex },
  } = tableInstance;

  return (
    <Card className="w-full px-0! overflow-hidden">
      <CardSectionHeader
        className="border-b border-(--border-subtle) px-5 pb-4"
        title={name}
        description={description}
        action={<Badge variant="secondary">{(data || []).length} {t("common.rows")}</Badge>}
      />

      <div className="px-3 py-4 md:hidden">
        {page.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <div className="rounded-full bg-(--surface-secondary) p-3">
              <TableProperties className="h-5 w-5 text-(--accent-primary)" />
            </div>
            <span className="text-(--text-primary) text-base font-semibold">
              {t("common.noData")}
            </span>
            <span className="text-sm text-(--text-muted)">
              {t("common.tableEmptyHint")}
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <div
                  key={row.id || index}
                  className="rounded-2xl border border-(--border-subtle) bg-(--surface-primary) p-4 shadow-(--shadow-xs)"
                  style={{ background: index % 2 === 1 ? "color-mix(in srgb, var(--surface-secondary) 28%, var(--surface-primary))" : "var(--surface-primary)" }}
                >
                  <div className="space-y-3">
                    {row.cells.map((cell, i) => (
                      <div key={cell.column.id || i} className="space-y-1.5 rounded-xl bg-(--surface-secondary)/45 px-3 py-2.5">
                        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-(--text-muted)">
                          {cell.column.render("header")}
                        </div>
                        <div className="min-w-0 text-(--text-primary)">
                          {cell.column.wrapper ? (
                            cell.column.wrapper(cell.value)
                          ) : (
                            <span className="text-sm font-semibold leading-6 wrap-break-word">
                              {cell.value || "—"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="hidden overflow-x-auto px-3 py-4 md:block md:px-4">
      <table {...getTableProps()} className="w-full min-w-160 border-separate border-spacing-0">
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, i) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={i}
                  className="cursor-pointer select-none border-y border-(--border-subtle) bg-(--surface-secondary) px-3 py-3 text-left first:rounded-s-xl first:border-s last:rounded-e-xl last:border-e md:px-4"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-(--text-muted) lg:text-xs">
                    <span>{column.render("header")}</span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <ArrowDown className="h-3.5 w-3.5 shrink-0" />
                      ) : (
                        <ArrowUp className="h-3.5 w-3.5 shrink-0" />
                      )
                    ) : null}
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
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <div className="rounded-full bg-(--surface-secondary) p-3">
                    <TableProperties className="h-5 w-5 text-(--accent-primary)" />
                  </div>
                  <span className="text-(--text-primary) text-base font-semibold">
                    {t("common.noData")}
                  </span>
                  <span className="text-sm text-(--text-muted)">
                    {t("common.tableEmptyHint")}
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
                  className="transition-colors hover:bg-(--surface-secondary)/70"
                  style={{ background: index % 2 === 1 ? "color-mix(in srgb, var(--surface-secondary) 70%, transparent)" : "transparent" }}
                >
                  {row.cells.map((cell, i) => (
                    <td
                      {...cell.getCellProps()}
                      key={i}
                      className="min-w-24 border-b border-(--border-subtle) px-3 py-4 align-top text-sm text-(--text-primary) md:px-4"
                    >
                      {cell.column.wrapper ? (
                        cell.column.wrapper(cell.value)
                      ) : (
                        <span className="text-sm font-semibold leading-6 md:text-[15px]">
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
      </div>

      {/* Pagination controls */}
      {pageCount > 1 && (
        <div className="flex justify-between items-center px-5 py-4 border-t border-(--border-subtle)">
          <span className="text-sm text-(--text-muted)">
            {t("common.pageOf", { page: pageIndex + 1, total: pageCount })}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!canPreviousPage}
              onClick={() => previousPage()}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!canNextPage}
              onClick={() => nextPage()}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
