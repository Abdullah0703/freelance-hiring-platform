import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Box, VStack } from '@chakra-ui/react';
import './PieChart.css'; 

// Register the required components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const PieChart = ({ data }) => {
  const { labels, values } = data;

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Monthly Reports',
        data: values,
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)', // Teal
          'rgba(153, 102, 255, 0.5)', // Purple
          'rgba(255, 159, 64, 0.5)'  // Orange
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 20,
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
        bodyColor: '#333',
        titleColor: '#000',
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
      },
    },
  };

  return (
    <Box py={4} w="full" maxW="450px" mx="auto">
      <VStack spacing={4} align="stretch">
        <Box p={1}>
          <Pie data={chartData} options={options} />
        </Box>
      </VStack>
    </Box>
  );
};

export default PieChart;
