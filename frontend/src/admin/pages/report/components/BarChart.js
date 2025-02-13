import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data }) => {
  // Destructure data to get labels and values
  const { labels, values } = data;

  // Define different shades of green
  const colors = [
    'rgba(75, 192, 192, 0.5)', // Light teal
    'rgba(54, 162, 235, 0.5)', // Light blue
    'rgba(255, 159, 64, 0.5)'  // Light orange
  ];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label:'TurnAroundTime',
        backgroundColor: colors, // Apply the different colors
        borderColor: 'rgba(75, 192, 192, 0.5)',
        borderWidth: 1,
        barThickness: 60, // Control the width of each bar
        maxBarThickness: 80, 
      },
      {
        label:'Productivity Scores',
        data: values,
        backgroundColor: colors, // Apply the different colors
        borderColor: 'rgba(54, 162, 235, 0.5)',
        borderWidth: 1,
        barThickness: 60, // Control the width of each bar
        maxBarThickness: 80
      },
      {
        label: 'Performance Metrics',
        backgroundColor: colors, // Apply the different colors
        borderColor: 'rgba(255, 159, 64, 0.5)',
        borderWidth: 1,
        barThickness: 60, // Control the width of each bar
        maxBarThickness: 80
      },
    ],
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
          text: 'Metrics',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
