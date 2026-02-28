import { Flex, Stack, Text, Transition } from "@mantine/core";

import { Action } from "components/card/Action";
import { config } from "config/config";
import { Locale } from "utils/Language";

export default function ActionsList() {
    return (
        <Flex direction="column" gap={20}>
            <Text
                c="var(--text-primary)"
                fz="2xl"
                fw={700}
                ff="'Space Grotesk', sans-serif"
                ms={24}
                mt={45}
            >
                <Locale zh="動作列表" en="Actions List" />
            </Text>
            <Stack gap={12}>
                <Actions />
            </Stack>
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
