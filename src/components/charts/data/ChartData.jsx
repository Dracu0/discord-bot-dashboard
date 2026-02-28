import { Box, Button, Flex, Stack, Text } from "@mantine/core";
import { IconCalendar, IconChartBar, IconCircleCheck, IconAlertTriangle } from "@tabler/icons-react";
import Card from "components/card/Card";
import React from "react";
import ApexChart from "components/charts/ApexChart";
import { useColorValue, useIconColor, useNoteColor, useTextColor } from "../../../utils/colors";

export default function ChartData({ name, description, value, time_unit, status, options, chartType }) {
    const textColor = useTextColor();
    const textColorSecondary = useNoteColor();
    const boxBg = useColorValue("var(--mantine-color-gray-2)", "rgba(255,255,255,0.06)");
    const iconColor = useIconColor();
    const bgButton = useColorValue("var(--mantine-color-gray-2)", "rgba(255,255,255,0.06)");

    return (
        <Card
            style={{ flexDirection: "column" }}
            w="100%"
            mb={0}
        >
            <Flex justify="space-between" ps={0} pe={20} pt={5}>
                <Flex align="center" w="100%">
                    {time_unit && (
                        <Button
                            variant="default"
                            style={{ backgroundColor: boxBg }}
                            fz="sm"
                            fw={500}
                            c={textColor}
                            radius={7}
                            leftSection={<IconCalendar size={16} color={textColor} />}
                        >
                            {time_unit}
                        </Button>
                    )}

                    <Button
                        ms="auto"
                        variant="default"
                        style={{ backgroundColor: bgButton }}
                        w={37}
                        h={37}
                        p={0}
                        radius={10}
                    >
                        <IconChartBar size={24} color={iconColor} />
                    </Button>
                </Flex>
            </Flex>
            <Flex w="100%" h="100%" direction={{ base: "column", "2xl": "row" }}>
                <Stack align="flex-start" ta="start" me={20} mt={28} gap={0}>
                    <Text
                        c={textColor}
                        fz={name.length <= 5 ? 34 : 20}
                        fw={700}
                        lh={1}
                    >
                        {name}
                    </Text>
                    <Text c={textColorSecondary} fz="sm" fw={500} mt={4} mb={30}>
                        {description}
                    </Text>

                    {status && (
                        <Flex align="center">
                            {status.success ? (
                                <>
                                    <IconCircleCheck size={18} color="var(--mantine-color-green-5)" style={{ marginRight: 4 }} />
                                    <Text c="green.5" fz="md" fw={700}>
                                        {status.text}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <IconAlertTriangle size={18} color="var(--mantine-color-red-5)" style={{ marginRight: 4 }} />
                                    <Text c="red.5" fz="md" fw={700}>
                                        {status.text}
                                    </Text>
                                </>
                            )}
                        </Flex>
                    )}
                </Stack>
                <Box mih={260} miw="75%" mt="auto">
                    <ApexChart
                        chartOptions={options}
                        chartData={value}
                        chartType={chartType}
                    />
                </Box>
            </Flex>
        </Card>
    );
}