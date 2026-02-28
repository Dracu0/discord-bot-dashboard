import { Flex, SimpleGrid, Text, Transition } from "@mantine/core";

import { Action } from "components/card/Action";
import { config } from "config/config";
import { Locale } from "utils/Language";
import { useTextColor } from "../../../../utils/colors";

export default function ActionsList() {
    const textColor = useTextColor();

    return (
        <Flex direction="column" gap={20}>
            <Text
                c={textColor}
                fz="2xl"
                fw={700}
                ff="'Space Grotesk', sans-serif"
                ms={24}
                mt={45}
            >
                <Locale zh="動作列表" en="Actions List" />
            </Text>
            <SimpleGrid cols={{ base: 1, md: 2, xl: 2, "2xl": 3 }} spacing={20}>
                <Actions />
            </SimpleGrid>
        </Flex>
    );
}

function Actions() {
    return Object.entries(config.actions).map(([id, action], index) => (
        <Transition key={id} mounted={true} transition="scale" duration={300} timingFunction="ease"
            enterDelay={index * 60}>
            {(styles) => (
                <div style={styles}>
                    <Action id={id} action={action} />
                </div>
            )}
        </Transition>
    ));
}
