import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Box, Button, VStack } from '@chakra-ui/react';

// Register the required components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const CustomReports = ({ data }) => {
  // Destructure data to get labels and values
  const { labels, values } = data;

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Custom Metrics',
        data: values,
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)', // Teal
          'rgba(153, 102, 255, 0.5)', // Purple
          'rgba(255, 159, 64, 0.5)',  // Orange
          'rgba(215,30,178,0.5)'

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
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <Box py={4} w="full" maxW="450px" mx="auto">
      <VStack spacing={4} align="stretch">
        <Box p={4}>
          <Doughnut data={chartData} options={options} />
        </Box>
        <Button colorScheme="green" size="sm" onClick={() => alert('Report downloaded!')}>
          Download Report
        </Button>
      </VStack>
    </Box>
  );
};

export default CustomReports;
