import { DataTypes } from "../../../variables/type";
import MiniStatistics from "./MiniStatistics";
import React from "react";
import IconBox from "../../icons/IconBox";
import ChartData from "../../charts/data/ChartData";
import DataTable from "./DataTable";
import PieChartData from "../../charts/data/PieChartData";
import { List } from "./List";
import InformationMap from "./InformationMap";
import LeaderboardTable from "./LeaderboardTable";

export function DataList({items}) {
    return (items || []).map((item, i) => {

        return <DataCard key={item.name || item.id || i} {...item} />
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
                const {columns, description} = optional

                if (optional.variant === "leaderboard") {
                    return <LeaderboardTable title={name} users={value} compact showViewAll description={optional.description} />
                }

                return <DataTable name={name} data={value} columns={columns} description={description} />
            }

            case DataTypes.Group: {
                const groupItems = value || [];
                return <div className={`grid grid-cols-1 xl:grid-cols-${groupItems.length} gap-5`}>
                    {groupItems.map((item, i) => <DataCard key={item.name || item.id || i} {...item} />)}
                </div>
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
