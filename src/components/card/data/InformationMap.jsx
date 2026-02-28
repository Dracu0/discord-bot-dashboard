import { SimpleGrid, Text } from "@mantine/core";
import Card from "components/card/Card";
import { useDetailColor, useNoteColor, useTextColor, useColorValue } from "utils/colors";

export default function InformationMap({name, description, value, ...rest}) {
    // Chakra Color Mode
    const textColorPrimary = useTextColor();
    const textColorSecondary = useNoteColor();


    return (
        <Card {...rest}>
            <Text
                c={textColorPrimary}
                fw="bold"
                fz="xl"
                mt={10}
                mb={4}
            >
                {name}
            </Text>
            <Text c={textColorSecondary} fz="md" me={26} mb={40}>
                {description}
            </Text>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={20}>{
                value.map((item, key) =>
                    <Information
                        key={key}
                        title={item.name}
                        value={item.value}
                    />
                )
            }
            </SimpleGrid>
        </Card>
    );
}

function Information(props) {
    const { title, value, ...rest } = props;
    // Chakra Color Mode
    const textColorPrimary = useTextColor();
    const textColorSecondary = useDetailColor();
    const bg = useColorValue("var(--mantine-color-gray-0)", "var(--mantine-color-dark-7)");

    return (
        <Card style={{ background: bg }} p={12} {...rest}>
            <Text fw={500} c={textColorSecondary} fz="sm">
                {title}
            </Text>
            <Text c={textColorPrimary} fw={500} fz="md">
                {value}
            </Text>
        </Card>
    );
}