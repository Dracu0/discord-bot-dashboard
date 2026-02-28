import { Flex, SimpleGrid, Text, Transition } from "@mantine/core";
import Feature from "components/card/Feature";
import { useContext } from "react";

import { FeaturesContext } from "contexts/FeaturesContext";
import { config } from "../../../../config/config";
import { Locale } from "../../../../utils/Language";
import { useTextColor } from "../../../../utils/colors";

export default function FeatureGrid() {
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
                <Locale zh="功能列表" en="Features List" />
            </Text>
            <SimpleGrid cols={{ base: 1, md: 2, xl: 2, "2xl": 3 }} spacing={20}>
                <Features />
            </SimpleGrid>
        </Flex>
    );
}

function Features() {
    const { enabled } = useContext(FeaturesContext);

    return Object.entries(config.features).map(([id, feature], index) => (
        <Transition key={id} mounted={true} transition="slide-up" duration={300} timingFunction="ease"
            enterDelay={index * 60}>
            {(styles) => (
                <div style={styles}>
                    <Feature {...feature} id={id} enabled={enabled.includes(id)} />
                </div>
            )}
        </Transition>
    ));
}