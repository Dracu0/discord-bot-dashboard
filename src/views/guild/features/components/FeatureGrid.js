import {Flex, SimpleGrid, SlideFade, Text} from "@chakra-ui/react";
import Feature from "components/card/Feature";
import {useContext} from "react";

import {FeaturesContext} from "contexts/FeaturesContext";
import {config} from "../../../../config/config";
import {Locale} from "../../../../utils/Language";
import {useTextColor} from "../../../../utils/colors";

export default function FeatureGrid() {
    const textColor = useTextColor();

    return (
        <Flex direction="column" gap="20px">
            <Text
                color={textColor}
                fontSize="2xl"
                fontWeight="700"
                fontFamily="'Space Grotesk', sans-serif"
                ms="24px"
                mt="45px">
                <Locale zh="功能列表" en="Features List" />
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 2, "2xl": 3 }} gap="20px">
                <Features />
            </SimpleGrid>
        </Flex>
    );
}

function Features() {
    const {enabled} = useContext(FeaturesContext);

    return Object.entries(config.features).map(([id, feature], index) =>
        <SlideFade key={id} in={true} offsetY="16px"
            transition={{ enter: { duration: 0.3, delay: index * 0.06 } }}>
            <Feature
                {...feature}
                id={id}
                enabled={enabled.includes(id)}
            />
        </SlideFade>
    )
}