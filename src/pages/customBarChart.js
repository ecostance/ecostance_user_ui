import React, { useRef, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const CustomBarChart = ({ data }) => {
  const chartReference = useRef(null);
  const [chartInitialized, setChartInitialized] = useState(false);

  useEffect(() => {
    const chartInstance = chartReference.current?.chartInstance;
  
    console.log("Chart Instance:", chartInstance);
  
    if (chartInstance && !chartInitialized) {
      setChartInitialized(true);
      console.log('Chart is initialized');
    }
  }, [chartReference, chartInitialized]);

  return (
    <div>
      {chartInitialized ? (
        <Bar
          ref={chartReference}
          data={data}
        />
      ) : (
        <p>Chart is initializing...</p>
      )}
    </div>
  );
};

export default CustomBarChart;
