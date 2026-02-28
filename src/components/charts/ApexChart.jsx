import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";

export default function ApexChart({ chartData, chartOptions, chartType }) {
  const series = useMemo(() => chartData, [chartData]);
  const options = useMemo(() => chartOptions, [chartOptions]);

  return (
    <ReactApexChart
      options={options}
      series={series}
      type={chartType}
      width='100%'
      height='100%'
    />
  );
}
