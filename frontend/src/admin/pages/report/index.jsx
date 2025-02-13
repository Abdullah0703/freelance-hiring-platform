import { Box, Container, Flex, Heading, Icon, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { FaChartBar, FaChartLine, FaChartPie, FaFileExcel } from 'react-icons/fa';
import BarChart from './components/BarChart';
import CustomReports from './components/CustomReports';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';

const ReportScreen = ({ sideBarWidth }) => {
  // Hardcoded data for the components
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const datasets = [
    {
      label: 'Productivity A',
      data: [45, 55, 60, 70, 65, 75],
      borderColor: '#3182ce',
      backgroundColor: 'rgba(49, 130, 206, 0.2)',
    },
    {
      label: 'Productivity B',
      data: [55, 60, 58, 55, 50, 65],
      borderColor: '#fc8181',
      backgroundColor: 'rgba(252, 129, 129, 0.2)',
    },
    {
      label: 'Productivity C',
      data: [20, 30, 35, 40, 50, 55],
      borderColor: '#f6e05e',
      backgroundColor: 'rgba(246, 224, 94, 0.2)',
    },
  ];

  const performanceData = {
    labels: ['TAT', 'Productivity Score', 'Client Feedback'],
    values: [24, 89, 75],
  };

  const monthlyReportData = {
    labels: ["Billing Performance", "Financials", "Other Metrics"],
    values: [45, 35, 20],
  };

  const customReportData = {
    labels: ['Metric 1', 'Metric 2', 'Metric 3', 'Metric 4'],
    values: [50, 60, 70, 80],
  };

  return (
    <Box 
    py={8} 
    w="auto"
    minH="100vh"
    bgGradient="linear(to-br, #f0f4f8, #e2e8f0)"
    borderRadius="md"
    boxShadow="xl" >
      <Container maxW="container.xxl" justifySelf="center">
        <Box
          ml={{ base: 0, lg: sideBarWidth === "small" ? 14 : 60 }}
          transition="margin 0.3s ease-in-out"
        >
          <Box ml={5}>
            <Heading as="h1" size="xl" mb={4}>
              Reports
            </Heading>
            <SimpleGrid
              columns={{ base: 1, md: 2 }} // 1 column on small screens, 2 columns on medium screens and up
              spacing={6}
            >
              <Box
                p={4}
                bg="white"
                borderWidth={1}
                borderRadius="md"
                shadow="xl" // Darker shadow for the default state
                transition="all 0.3s ease-in-out"
                _hover={{
                  shadow: '2xl', // Even darker shadow on hover
                  transform: 'translateY(-5px)',
                }}
              >
                <Flex align="center" justify="center" mb={4}>
                  <Icon as={FaChartLine} boxSize={6} color="teal.500" mr={2} />
                  <Heading as="h3" size="md">
                    Productivity Over Time
                  </Heading>
                </Flex>
                <LineChart labels={labels} datasets={datasets} />
              </Box>
              <Box
                p={4}
                bg="white"
                borderWidth={1}
                borderRadius="md"
                shadow="xl" // Darker shadow for the default state
                transition="all 0.3s ease-in-out"
                _hover={{
                  shadow: '2xl', // Even darker shadow on hover
                  transform: 'translateY(-5px)',
                }}
              >
                <Flex align="center" justify="center" mb={4}>
                  <Icon as={FaChartBar} boxSize={6} color="orange.500" mr={2} />
                  <Heading as="h3" size="md">
                    Client Feedback
                  </Heading>
                </Flex>
                <BarChart data={performanceData} />
              </Box>
              <Box
                p={4}
                bg="white"
                borderWidth={1}
                borderRadius="md"
                shadow="xl" // Darker shadow for the default state
                transition="all 0.3s ease-in-out"
                _hover={{
                  shadow: '2xl', // Even darker shadow on hover
                  transform: 'translateY(-5px)',
                }}
              >
                <Flex align="center" justify="center" mb={4}>
                  <Icon as={FaChartPie} boxSize={6} color="purple.500" mr={2} />
                  <Heading as="h3" size="md">
                    Monthly Breakdown
                  </Heading>
                </Flex>
                <PieChart data={monthlyReportData} />
              </Box>
              <Box
                p={4}
                bg="white"
                borderWidth={1}
                borderRadius="md"
                shadow="xl" // Darker shadow for the default state
                transition="all 0.3s ease-in-out"
                _hover={{
                  shadow: '2xl', // Even darker shadow on hover
                  transform: 'translateY(-5px)',
                }}
              >
                <Flex align="center" justify="center" mb={4}>
                  <Icon as={FaFileExcel} boxSize={6} color="green.500" mr={2} />
                  <Heading as="h3" size="md">
                    Custom Reports
                  </Heading>
                </Flex>
                <CustomReports data={customReportData} />
              </Box>
            </SimpleGrid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ReportScreen;
