import Card from "components/card/Card";

export default function InformationMap({name, description, value, ...rest}) {
    return (
        <Card {...rest}>
            <span className="block text-(--text-primary) font-bold text-lg mb-0.5">
                {name}
            </span>
            <span className="block text-(--text-muted) text-sm mb-4">
                {description}
            </span>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">{
                (value || []).map((item, key) =>
                    <Information
                        key={key}
                        title={item.name}
                        value={item.value}
                    />
                )
            }
            </div>
        </Card>
    );
}

function Information(props) {
    const { title, value, ...rest } = props;

    return (
        <Card className="p-2.5" style={{ background: "var(--surface-secondary)" }} {...rest}>
            <span className="block font-medium text-(--text-secondary) text-xs">
                {title}
            </span>
            <span className="block text-(--text-primary) font-medium text-sm mt-0.5">
                {value}
            </span>
        </Card>
    );
}
