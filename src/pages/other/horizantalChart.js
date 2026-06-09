import React from 'react';
import { Bar } from 'react-chartjs-2';


const horizantalData = {
  labels: ['January', 'February'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65, 59]
    }
  ]
}
  
  const horizantalOptions = {
    indexAxis: 'y',
  };
  
  const HorizontalBarChart = () => {
    return (
      <Bar data={horizantalData} options = {horizantalOptions}/>
    );
  };
  
  export default HorizontalBarChart;