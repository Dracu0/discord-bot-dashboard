import { Box, Flex, SimpleGrid, Text } from "@mantine/core";
import Card from "components/card/Card";
import PieChart from "components/charts/PieChart";
import React from "react";
import { useNoteColor, useTextColor } from "utils/colors";

export default function PieChartData({ name, data, options, unit }) {
    const textColor = useTextColor();

    return (
        <Card p={20} style={{ alignItems: "center", flexDirection: "column" }} w="100%">
            <Flex mb="3rem">
                <Text c={textColor} fz="lg" fw="bold" mt={4}>
                    {name}
                </Text>
            </Flex>

            <Box maw={{ xl: "20rem" }} mx="auto">
                <PieChart chartData={data} chartOptions={options} />
            </Box>

            <SimpleGrid
                cols={{
                    base: Math.min(data.length, 2),
                    md: Math.min(data.length, 3),
                    "2xl": Math.min(data.length, 4),
                }}
                style={{ borderRadius: 8 }}
                w="100%"
                py={15}
                px={20}
                mt={15}
            >
                {data.map((v, i) => (
                    <FooterItem key={i} label={options.labels[i]} value={v} unit={unit} />
                ))}
            </SimpleGrid>
        </Card>
    );
}

function FooterItem({ label, value, unit }) {
    const textColor = useTextColor();
    const detailColor = useNoteColor();

    return (
        <Flex align="center" justify="center" direction="column" py={5}>
            <Flex>
                <Box
                    h={8}
                    w={8}
                    style={{ backgroundColor: "var(--mantine-color-brand-5)", borderRadius: "50%" }}
                    me={4}
                />
                <Text fz="xs" c={detailColor} fw={700} mb={5}>
                    {label}
                </Text>
            </Flex>
            <Text ta="start" fz="lg" c={textColor} fw={700}>
                {value}{unit}
            </Text>
        </Flex>
    );
}