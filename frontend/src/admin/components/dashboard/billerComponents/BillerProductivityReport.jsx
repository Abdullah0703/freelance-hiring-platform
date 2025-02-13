import { CalendarIcon } from '@chakra-ui/icons';
import {
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Text
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getAllWorkLogs, getWorkLogsByBillerId } from '../../../../API/worklog';

const BillerProductivityReport = () => {
  const [totalHoursWorked, setTotalHoursWorked] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkLogs = async () => {
      try {
        const response = await getWorkLogsByBillerId();
        if (response.success) {
          const logs = response.workLogs;
          // Calculate total hours worked
          const totalHours = logs.reduce((acc, log) => acc + log.hoursLog, 0);
          setTotalHoursWorked(totalHours);
          // Calculate other metrics as needed
        } else {
          console.error('Error fetching work logs');
        }
      } catch (error) {
        console.error('Error fetching work logs:', error);

      } finally {
        setLoading(false);
      }
    };

    fetchWorkLogs();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SimpleGrid spacing={4} templateColumns="repeat(2, 1fr)">
      <Card gridColumn="1 / -1" minWidth="250px"
        transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
        _hover={{ transform: "scale(1.01)", boxShadow: "lg" }}>
        <CardHeader>
          <Heading size="md">
            <Icon as={CalendarIcon} mr={2} color="green.400" />
            Productivity Report
          </Heading>
        </CardHeader>
        <CardBody>
          <Flex
            wrap="wrap"
            gap={10}
            justifyContent="center"
            alignItems="center"
          >
            <Flex direction="column" align="center">
              <CircularProgress
                value={(totalHoursWorked / 24) * 100}
                color="rgb(34, 195, 94)"
                size={100}
              >
                <CircularProgressLabel>{totalHoursWorked}</CircularProgressLabel>
              </CircularProgress>
              <Text mt={2}>Total Hours Worked</Text>
            </Flex>
            <Flex direction="column" align="center">
              <CircularProgress value='20' color="rgb(34, 195, 94)" size={100}>
                <CircularProgressLabel>20%</CircularProgressLabel>
              </CircularProgress>
              <Text mt={2}>Turnaround Time</Text>
            </Flex>
            <Flex direction="column" align="center">
              <CircularProgress
                value={(3 / 5) * 100}
                color="rgb(34, 195, 94)"
                size={100}
              >
                <CircularProgressLabel>3/5</CircularProgressLabel>
              </CircularProgress>
              <Text mt={2}>Client Feedback</Text>
            </Flex>
          </Flex>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};

export default BillerProductivityReport;
