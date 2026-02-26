import {Flex, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, Icon, Center} from "@chakra-ui/react";
import React from "react";
import {useGlobalFilter, usePagination, useSortBy, useTable,} from "react-table";
import {IoArrowUp, IoArrowDown} from "react-icons/io5";

// Custom components
import Card from "components/card/Card";
import {useTextColor} from "../../../utils/colors";

export default function DataTable({name, data, columns}) {

  const tableInstance = useTable(
    {
      columns,
      data
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
    initialState,
  } = tableInstance;
  initialState.pageSize = 11;

  const textColor = useTextColor();
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const headerBg = useColorModeValue("gray.50", "navy.700");
  const stripeBg = useColorModeValue("gray.50", "whiteAlpha.50");
  return (
    <Card
      direction='column'
      w='100%'
      px='0px'
      overflowX='auto'>
        <Text
            ml="25px"
            color={textColor}
            fontSize='22px'
            fontWeight='700'
            lineHeight='100%'
        >
            {name}
        </Text>
      <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe='10px'
                  key={index}
                  borderColor={borderColor}
                  bg={headerBg}
                  cursor="pointer"
                  userSelect="none">
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color='gray.400'
                    fontWeight='700'>
                    {column.render("header")}
                    {column.isSorted && (
                      <Icon as={column.isSortedDesc ? IoArrowDown : IoArrowUp} ml={1} w={3} h={3} />
                    )}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.length === 0 ? (
            <Tr>
              <Td colSpan={columns.length} borderColor="transparent">
                <Center py={8}>
                  <Text color="gray.400" fontSize="md">No data available</Text>
                </Center>
              </Td>
            </Tr>
          ) : page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index} bg={index % 2 === 1 ? stripeBg : "transparent"}>
                {row.cells.map((cell, index) => {

                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      color={textColor}
                      fontSize={{ sm: "14px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      borderColor='transparent'>
                      {
                          cell.column.wrapper?
                              cell.column.wrapper(cell.value) :
                              <Text fontSize='md' fontWeight='700'>
                                  {cell.value}
                              </Text>
                      }
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Card>
  );
}
