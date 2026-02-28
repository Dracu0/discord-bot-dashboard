import { ActionIcon, Center, Flex, Group, Table, Text } from "@mantine/core";
import React from "react";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import { IconArrowUp, IconArrowDown, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import Card from "components/card/Card";

export default function DataTable({ name, data, columns }) {
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10 },
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
    <Card w="100%" px={0} style={{ overflowX: "auto" }}>
      <Text
        ml={{ base: 16, md: 25 }}
        c="var(--text-primary)"
        fz={22}
        fw={700}
        lh={1}
      >
        {name}
      </Text>
      <Table {...getTableProps()} mb={24}>
        <Table.Thead>
          {headerGroups.map((headerGroup, index) => (
            <Table.Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, i) => (
                <Table.Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={i}
                  style={{
                    paddingRight: 10,
                    borderColor: "var(--border-subtle)",
                    background: "var(--surface-secondary)",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <Flex justify="space-between" align="center" fz={{ sm: 10, lg: 12 }} c="gray.4" fw={700}>
                    {column.render("header")}
                    {column.isSorted &&
                      (column.isSortedDesc ? (
                        <IconArrowDown size={12} style={{ marginLeft: 4 }} />
                      ) : (
                        <IconArrowUp size={12} style={{ marginLeft: 4 }} />
                      ))}
                  </Flex>
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody {...getTableBodyProps()}>
          {page.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length} style={{ border: "none" }}>
                <Center py={32}>
                  <Text c="dimmed" fz="md">
                    No data available
                  </Text>
                </Center>
              </Table.Td>
            </Table.Tr>
          ) : (
            page.map((row, index) => {
              prepareRow(row);
              return (
                <Table.Tr
                  {...row.getRowProps()}
                  key={index}
                  style={{ background: index % 2 === 1 ? "var(--surface-secondary)" : "transparent" }}
                >
                  {row.cells.map((cell, i) => (
                    <Table.Td
                      {...cell.getCellProps()}
                      key={i}
                      style={{ color: "var(--text-primary)", fontSize: 14, minWidth: 150, border: "none" }}
                    >
                      {cell.column.wrapper ? (
                        cell.column.wrapper(cell.value)
                      ) : (
                        <Text fz="md" fw={700}>
                          {cell.value}
                        </Text>
                      )}
                    </Table.Td>
                  ))}
                </Table.Tr>
              );
            })
          )}
        </Table.Tbody>
      </Table>

      {/* Pagination controls */}
      {pageCount > 1 && (
        <Flex justify="space-between" align="center" px={{ base: 16, md: 25 }} py={12}>
          <Text fz="sm" c="var(--text-muted)">
            Page {pageIndex + 1} of {pageCount}
          </Text>
          <Group gap={4}>
            <ActionIcon
              variant="subtle"
              color="gray"
              disabled={!canPreviousPage}
              onClick={() => previousPage()}
              aria-label="Previous page"
            >
              <IconChevronLeft size={16} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="gray"
              disabled={!canNextPage}
              onClick={() => nextPage()}
              aria-label="Next page"
            >
              <IconChevronRight size={16} />
            </ActionIcon>
          </Group>
        </Flex>
      )}
    </Card>
  );
}
