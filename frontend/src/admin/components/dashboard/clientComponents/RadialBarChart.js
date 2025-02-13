import { Box, Flex, Heading } from '@chakra-ui/react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Example data
// const data = {
//   labels: ['Jobs Posted', 'Jobs Completed', 'Jobs Aborted'],
//   datasets: [
//     {
//       data: [3, 1, 0],
//       backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40'],
//       borderColor: '#fff',
//       borderWidth: 2,
//     },
//   ],
// };

// // Example options
// const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: 'bottom',
//       align: 'center',
//       labels: {
//         boxWidth: 12,
//         font: {
//           size: 12,
//         },
//         padding: 20,
//       },
//     },
//     tooltip: {
//       callbacks: {
//         label: function (context) {
//           let label = context.label || '';
//           if (label) {
//             label += ': ';
//           }
//           if (context.parsed !== null) {
//             label += `${context.parsed}`;
//           }
//           return label;
//         },
//       },
//     },
//   },
//   elements: {
//     arc: {
//       borderWidth: 2,
//     },
//   },
// };

// Radial Bar Chart Component
const RadialBarChart = ({ data, options }) => {
  return (
    <Box
      bg="white"
      borderRadius="md"
      shadow="lg"
      width="100%"
      height="100%"
      p={1}
      display="flex"
      flexDirection="column"
      alignItems="center" // Center content horizontally
      justifyContent="center" // Center content vertically
      transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out" // Smooth transition
      _hover={{ transform: "scale(1.02)", boxShadow: "lg" }} // Hover effect
    >
      <Heading fontSize="lg" m={4}>Analysis </Heading>
      <Box width="100%" height="100%" maxWidth="400px">
        <Doughnut data={data} options={options} />
      </Box>
    </Box>
  );
};

export default RadialBarChart;
