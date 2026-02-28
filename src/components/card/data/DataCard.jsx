import { DataTypes } from "../../../variables/type";
import MiniStatistics from "./MiniStatistics";
import React from "react";
import { SimpleGrid } from "@mantine/core";
import IconBox from "../../icons/IconBox";
import ChartData from "../../charts/data/ChartData";
import DataTable from "./DataTable";
import PieChartData from "../../charts/data/PieChartData";
import { List } from "./List";
import InformationMap from "./InformationMap";

export function DataList({items}) {
    return items.map((item, key) => {

        return <DataCard key={key} {...item} />
    })
}

export default function DataCard({name, value, type, ...optional}) {
    const getItem = () => {

        switch (type) {
            case DataTypes.Statistics: {
                const {icon, growth} = optional

                return <MiniStatistics
                    startContent={
                        icon && <BaseIcon icon={icon}/>
                    }
                    growth={growth}
                    name={name}
                    value={value}
                />
            }
            case DataTypes.InfoMap: {
                const {description} = optional

                return <InformationMap
                    name={name}
                    description={description}
                    value={value}
                />
            }
            case DataTypes.Bar_Chart:
            case DataTypes.Line_Chart:
                const {time_unit, description, status, options} = optional

                return <ChartData
                    name={name}
                    value={value}
                    description={description}
                    status={status}
                    time_unit={time_unit}
                    options={options}
                    chartType={getChartType(type)}
                />

            case DataTypes.Pie_Chart: {
                const {options, unit} = optional

                return <PieChartData name={name} data={value} options={options} unit={unit} />
            }

            case DataTypes.Table:{
                const {columns} = optional

                return <DataTable name={name} data={value} columns={columns} />
            }

            case DataTypes.Group: {
                return <SimpleGrid cols={{base: 1, xl: value.length}} spacing={20}>
                    {value.map((item, key) => <DataCard key={key} {...item} />)}
                </SimpleGrid>
            }

            case DataTypes.List: {
                const {description, icon} = optional

                return <List title={name} description={description} icon={icon} items={value} />
            }

            case DataTypes.Custom: {
                return value
            }

            default: return <></>
        }
    }

    return getItem()
}

function getChartType(type) {
    switch (type) {
        case DataTypes.Line_Chart:
            return "line"
        case DataTypes.Bar_Chart:
            return "bar"
    }
}

function BaseIcon({icon: IconComp}) {
    return <IconBox
        w={56}
        h={56}
        style={{ background: "var(--surface-secondary)" }}
        icon={
            <IconComp size={32} color="var(--accent-primary)"/>
        }
    />
}