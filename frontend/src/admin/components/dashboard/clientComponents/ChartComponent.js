import { Box, Heading, Text, Flex } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Example data with green line color
const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Sales',
      data: [30, 45, 35, 50, 60, 70, 90],
      borderColor: '#28a745', // Green color for the line
      backgroundColor: 'rgba(40, 167, 69, 0.2)', // Light green for the background
      fill: true,
    },
  ],
};

// Example options
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += `${context.parsed.y}`;
          }
          return label;
        },
      },
    },
  },
};

// Chart component
const ChartComponent = () => {
  return (
    <Box bg="white" borderRadius="md" shadow="lg" w="100%" h="100%" p={2}
      transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out" // Smooth transition
      _hover={{ transform: "scale(1.02)", boxShadow: "lg" }} // Hover effect
    >
      <Flex justify="space-between" align="center">
        <Heading fontSize="md">Overview</Heading>
        <Box p={1} bg="white" borderRadius="md" borderWidth={1} borderColor="gray.300">
          <Text fontSize="sm" color="black">6 months</Text>
        </Box>
      </Flex>
      <Line data={data} options={options} />
    </Box>
  );
};

export default ChartComponent;
