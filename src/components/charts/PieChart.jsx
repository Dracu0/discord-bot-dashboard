import React, { Suspense } from "react";
const ReactApexChart = React.lazy(() => import("react-apexcharts"));

export default function PieChart({chartData, chartOptions, ...options}) {
  return (
      <Suspense fallback={<div />}>
          <ReactApexChart
              options={chartOptions}
              series={chartData}
              type='pie'
              {...options}
          />
      </Suspense>
  );
}