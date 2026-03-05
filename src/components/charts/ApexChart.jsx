import React, { Suspense, useMemo } from "react";
const ReactApexChart = React.lazy(() => import("react-apexcharts"));

export default function ApexChart({ chartData, chartOptions, chartType, series: seriesProp, options: optionsProp, type, height }) {
  const series = useMemo(() => seriesProp ?? chartData, [seriesProp, chartData]);
  const options = useMemo(() => optionsProp ?? chartOptions, [optionsProp, chartOptions]);
  const chartKind = type ?? chartType;

  return (
    <Suspense fallback={<div />}>
      <ReactApexChart
        options={options}
        series={series}
        type={chartKind}
        width='100%'
        height={height ?? '100%'}
      />
    </Suspense>
  );
}
