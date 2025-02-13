import React from 'react';
import { Box, Heading, Text, VStack, Button, Divider, Grid, GridItem, Flex, CircularProgress, CircularProgressLabel } from '@chakra-ui/react';

const ClientBillingSummary = ({ data }) => {
  if (!data) {
    return <Text>No billing data available</Text>;
  }

  const { monthlyReport } = data;

  return (
    <Box p={6} bg="white" borderWidth="1px" borderRadius="lg" shadow="md">
      <Heading as="h2" size="lg" mb={4}>
        Billing Summary
      </Heading>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem colSpan={1}>
          <VStack spacing={3} align="start">
            <Text><strong>Amount Due:</strong> {data.amountDue}</Text>
            <Text><strong>Due Date:</strong> {data.dueDate}</Text>
            <Button colorScheme="whatsapp" mt={2}>
              Make a Payment
            </Button>
          </VStack>
        </GridItem>

        <GridItem colSpan={2}>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem>
              <VStack spacing={4} align="start">
                <Heading as="h3" size="md">
                  Payment History
                </Heading>
                <VStack spacing={2} align="start">
                  {data.paymentHistory.map((payment, index) => (
                    <Text key={index}>
                      {payment.date}: {payment.amount} ({payment.status})
                    </Text>
                  ))}
                </VStack>
              </VStack>
            </GridItem>

            <GridItem>
              <VStack spacing={4} align="start">
                <Heading as="h3" size="md">
                  Support Tickets
                </Heading>
                <VStack spacing={2} align="start">
                  {data.supportTickets.map(ticket => (
                    <Text key={ticket.id}>
                      <strong>#{ticket.id}:</strong> {ticket.issue} ({ticket.status})
                    </Text>
                  ))}
                </VStack>
              </VStack>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>

      <Divider my={6} />

      <Heading as="h3" size="md" mb={4}>
        Monthly Report - {monthlyReport.month}
      </Heading>
      <Flex wrap='wrap' gap={10}>
        <Flex direction='column' align='center'>
          <CircularProgress value={(parseFloat(monthlyReport.tat) / 100) * 100} color='green.400' size={100}>
            <CircularProgressLabel>{monthlyReport.tat}</CircularProgressLabel>
          </CircularProgress>
          <Text mt={2}>TAT</Text>
        </Flex>
        <Flex direction='column' align='center'>
          <CircularProgress value={(parseFloat(monthlyReport.clientSatisfaction) / 5) * 100} color='green.400' size={100}>
            <CircularProgressLabel>{monthlyReport.clientSatisfaction}</CircularProgressLabel>
          </CircularProgress>
          <Text mt={2}>Client Satisfaction</Text>
        </Flex>
        <Flex direction='column' align='center'>
          <CircularProgress value={100} color='green.400' size={100}>
            <CircularProgressLabel>{monthlyReport.totalBilling}</CircularProgressLabel>
          </CircularProgress>
          <Text mt={2}>Total Billing</Text>
        </Flex>
      </Flex>

      <Button colorScheme="whatsapp" mt={4}>
        Generate Custom Report
      </Button>
    </Box>
  );
};

export default ClientBillingSummary;
