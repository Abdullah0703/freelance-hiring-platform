import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ labels, datasets }) => {
  const colors = [
    'rgb(75, 192, 192)', //teal
    'rgb(54, 162, 235)', //blue
    'rgb(255, 159, 64)'  //orange
  ];

  const data = {
    labels: labels,
    datasets: datasets.map((dataset, index) => ({
      ...dataset,
      borderColor: colors[index % colors.length],
      pointBackgroundColor: colors[index % colors.length],
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Value: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Months',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Productivity',
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
