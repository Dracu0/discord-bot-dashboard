import { SimpleGrid, Text } from "@mantine/core";
import Card from "components/card/Card";

export default function InformationMap({name, description, value, ...rest}) {
    return (
        <Card {...rest}>
            <Text
                c="var(--text-primary)"
                fw="bold"
                fz="xl"
                mt={10}
                mb={4}
            >
                {name}
            </Text>
            <Text c="var(--text-muted)" fz="md" me={26} mb={40}>
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

    return (
        <Card style={{ background: "var(--surface-secondary)" }} p={12} {...rest}>
            <Text fw={500} c="var(--text-secondary)" fz="sm">
                {title}
            </Text>
            <Text c="var(--text-primary)" fw={500} fz="md">
                {value}
            </Text>
        </Card>
    );
}