import Card from "components/card/Card";

export default function InformationMap({name, description, value, ...rest}) {
    return (
        <Card {...rest}>
            <span className="block text-(--text-primary) font-bold text-xl mt-2.5 mb-1">
                {name}
            </span>
            <span className="block text-(--text-muted) text-base me-[26px] mb-10">
                {description}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{
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
        <Card className="p-3" style={{ background: "var(--surface-secondary)" }} {...rest}>
            <span className="block font-medium text-(--text-secondary) text-sm">
                {title}
            </span>
            <span className="block text-(--text-primary) font-medium text-base">
                {value}
            </span>
        </Card>
    );
}
