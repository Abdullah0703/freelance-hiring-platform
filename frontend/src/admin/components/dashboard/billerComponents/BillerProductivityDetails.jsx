import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, VStack, Input, Button, Grid, GridItem, Icon } from '@chakra-ui/react';
import { CalendarIcon, CheckCircleIcon, CheckIcon, EditIcon } from '@chakra-ui/icons';
import { FaCalendar } from "react-icons/fa";
import { getAllWorkLogs } from '../../../../API/worklog';
import Loading from '../../../../components/Loading/Loading';

const BillerProductivityDetails = ({ dailyTasks }) => {
    const [hoursWorked, setHoursWorked] = useState('');
    const [tasksCompleted, setTasksCompleted] = useState('');
    const [workLogs, setWorkLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchWorkLogs = async () => {
        try {
            const response = await getAllWorkLogs(); // Adjust if the function name or import path is different
            if (response.success) {
                console.log("worklog data: ", response);
                setWorkLogs(response.workLogs); // Assuming response has workLogs
                // Also set dailyTasks if you have an API for it
                // setDailyTasks(response.dailyTasks || []);
            } else {
                console.error("Error fetching work logs");
            }
        } catch (error) {
            console.error("Error fetching work logs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkLogs();
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    const handleSubmit = () => {
        // Handle the submit action (e.g., send data to the server)
        console.log('Submitted Hours:', hoursWorked);
        console.log('Submitted Tasks:', tasksCompleted);
    };

    return (
        <Box p={6} bg="white" borderWidth="1px" borderRadius="lg" shadow="md"
            transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
            _hover={{ transform: "scale(1.01)", boxShadow: "lg" }}
        >
            <Heading as="h2" size="lg" mb={4}>
                Productivity
            </Heading>

            <Grid templateColumns="repeat(3, 1fr)" gap={1}>

                {/* Daily Tasks Section */}
                <GridItem colSpan={1}>
                    <Heading as="h3" size="md" mb={3}>
                        <Icon as={CheckCircleIcon} mr={2} color="green.500" />
                        Daily Tasks
                    </Heading>
                    {dailyTasks.map((task, index) => (
                        <Text key={index} mb={2}>
                            <Icon as={CheckIcon} boxSize={4} mr={2} />
                            {task.name}: {task.description} ({task.status})
                        </Text>
                    ))}
                </GridItem>

                {/* Submit Productivity Section */}
                <GridItem colSpan={1}>
                    <Heading as="h3" size="md" mb={3}>
                        <Icon as={EditIcon} mr={2} color="green.500" />
                        Submit Productivity
                    </Heading>
                    <VStack spacing={'1.5'} align="start">
                        <Text>Hours Worked:</Text>
                        <Input
                            value={hoursWorked}
                            onChange={(e) => setHoursWorked(e.target.value)}
                            placeholder="Enter hours worked"
                            size="sm" // Reduced size
                            borderRadius="md"
                        />

                        <Text>Tasks Completed:</Text>
                        <Input
                            value={tasksCompleted}
                            onChange={(e) => setTasksCompleted(e.target.value)}
                            placeholder="Enter tasks completed"
                            size="sm"
                            borderRadius="md"
                        />

                        <Button onClick={handleSubmit} colorScheme="whatsapp" mt={2}>
                            Submit
                        </Button>
                    </VStack>
                </GridItem>

                {/* Work Log Section */}
                <GridItem colSpan={1} pl={5}>
                    <Heading as="h3" size="md" mb={3}>
                        <Icon as={CalendarIcon} mr={2} color="green.500" />
                        Work Log
                    </Heading>
                    {workLogs.map((log, index) => (
                        <Text key={index} mb={2}>
                            <Icon as={FaCalendar} boxSize={4} mr={2} />
                            {log.date}: {log.hoursLog} hours worked
                        </Text>
                    ))}
                </GridItem>
            </Grid>
        </Box>
    );
};

export default BillerProductivityDetails;