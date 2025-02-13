import {
    Box,
    CircularProgress,
    CircularProgressLabel,
    Flex,
    Heading,
    Icon,
    Text,
    useColorModeValue,
    SimpleGrid
} from '@chakra-ui/react';
import React from 'react';
import { MdPeople, MdWork } from 'react-icons/md';

const Reports = (props) => {
    const clientReports = {
        totalClients: props.TotalClient,
        activeClients: props.clientReport.ActiveCount,
        pendingClients: props.clientReport.NonActiveCount,
    };

    const billerReports = {
        totalBillers: props.TotalBillers,
        hoursWorked: props.totalHours,
        performanceMetrics: props.averageRating, // Assumed out of 5 for circular progress
    };

    const gradientBg = useColorModeValue(
        'linear-gradient(to bottom right, #e0f2f1, #b2dfdb)',
        'linear-gradient(to bottom right, #1a202c, #2d3748)'
    );

    return (
        <Box
            p={4}
            bg="white"
            borderWidth="1px"
            borderRadius="lg"
            shadow="md"
            transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
            _hover={{ transform: "scale(1.01)", shadow: "xl" }}
        >
            <Flex align="center" mb={6} justify="space-between">
                <Heading as="h2" size="lg">
                    Reports
                </Heading>
            </Flex>

            <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 2 }} spacing={4}>
                <Box
                    p={5}
                    borderWidth="2px"
                    borderRadius="lg"
                    transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
                    _hover={{ transform: "scale(1.01)", shadow: "xl" }}
                >
                    <Flex align="center" mb={4} p={2} direction={{ base: 'column', md: 'row' }} >
                        <Icon as={MdPeople} boxSize={8} color='green.500' />
                        <Box ml={{ base: 0, md: 4 }} mt={{ base: 4, md: 0 }} textAlign={{ base: 'center', md: 'left' }}>
                            <Heading as="h3" size="md">Client Reports</Heading>
                            <Flex direction={{ base: 'column', md: 'row' }} wrap="wrap" justify='space-around' spacing={4} mt={2}>
                                <Box textAlign="center" mb={{ base: 4, md: 0 }}>
                                    <CircularProgress value={(clientReports.totalClients / 200) * 100} color='green.400' size={{ base: "60px", md: "80px" }}>
                                        <CircularProgressLabel fontSize={{ base: "sm", md: "md" }}>{clientReports.totalClients}</CircularProgressLabel>
                                    </CircularProgress>
                                    <Text m={2}>Total Clients</Text>
                                </Box>
                                <Box textAlign="center" mb={{ base: 4, md: 0 }}>
                                    <CircularProgress value={(clientReports.activeClients / 120) * 100} color='blue.400' size={{ base: "60px", md: "80px" }}>
                                        <CircularProgressLabel fontSize={{ base: "sm", md: "md" }}>{clientReports.activeClients}</CircularProgressLabel>
                                    </CircularProgress>
                                    <Text m={2}>Active Clients</Text>
                                </Box>
                                <Box textAlign="center">
                                    <CircularProgress value={(clientReports.pendingClients / 30) * 100} color='teal.400' size={{ base: "60px", md: "80px" }}>
                                        <CircularProgressLabel fontSize={{ base: "sm", md: "md" }}>{clientReports.pendingClients}</CircularProgressLabel>
                                    </CircularProgress>
                                    <Text m={2}>Pending Clients</Text>
                                </Box>
                            </Flex>
                        </Box>
                    </Flex>
                </Box>

                <Box
                    p={5}
                    borderWidth="2px"
                    borderRadius="lg"
                    transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
                    _hover={{ transform: "scale(1.01)", shadow: "xl" }}
                >
                    <Flex align="center" mb={4} p={2} direction={{ base: 'column', md: 'row' }} wrap="wrap">
                        <Icon as={MdPeople} boxSize={8} color='green.500' />
                        <Box ml={{ base: 0, md: 4 }} mt={{ base: 4, md: 0 }} textAlign={{ base: 'center', md: 'left' }}>
                            <Heading as="h3" size="md">Biller Reports</Heading>
                            <Flex direction={{ base: 'column', md: 'row' }} wrap="wrap" justify='space-around' spacing={4} mt={2}>
                                <Box textAlign="center" mb={{ base: 4, md: 0 }}>
                                    <CircularProgress value={(billerReports.totalBillers / 10000) * 100} color='green.400' size={{ base: "60px", md: "80px" }}>
                                        <CircularProgressLabel fontSize={{ base: "sm", md: "md" }}>{billerReports.totalBillers}</CircularProgressLabel>
                                    </CircularProgress>
                                    <Text mt={2}>Total Billers</Text>
                                </Box>
                            </Flex>
                        </Box>
                    </Flex>
                </Box>
            </SimpleGrid>
        </Box>
    );
};

export default Reports;
