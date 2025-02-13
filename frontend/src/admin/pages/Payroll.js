import { Badge, Box, Button, Container, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Heading, SimpleGrid, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BiDollar } from 'react-icons/bi';

const items = [
    {
        title: "Available for Withdrawal",
        amount: 1201,
    },
    {
        title: "Pending Clearance",
        amount: 4491,
    },
    {
        title: "Work in Progress",
        amount: 10000,
    },


]

const data = [
    {
        employeeID: 11012,
        employee: "Syed Ahzam Imam",
        date: "05/02/2023",
        amount: 150,
        status: "Pending",
        designation: "Software Engineer",
        currentProject: "Project A",
        branch: "Head Office",
    },
    {
        employeeID: 12312,
        employee: "Uzair Javed",
        date: "06/15/2023",
        amount: 200,
        status: "Approved",
        designation: "Senior Developer",
        currentProject: "Project B",
        branch: "Branch 1",
    },
    {
        employeeID: 12323,
        employee: "Ahmed Raza",
        date: "07/22/2023",
        amount: 180,
        status: "Pending",
        designation: "UI/UX Designer",
        currentProject: "Project C",
        branch: "Branch 2",
    },
    {
        employeeID: 12331,
        employee: "Shazim Ali Mughal",
        date: "08/10/2023",
        amount: 250,
        status: "Approved",
        designation: "Project Manager",
        currentProject: "Project D",
        branch: "Branch 3",
    },
    {
        employeeID: 12312,
        employee: "Aaliyan Khan",
        date: "09/05/2023",
        amount: 300,
        status: "Pending",
        designation: "QA Tester",
        currentProject: "Project E",
        branch: "Branch 1",
    },
    {
        employeeID: 12312,
        employee: "Sharjeel Ahmed",
        date: "10/12/2023",
        amount: 220,
        status: "Approved",
        designation: "DevOps Engineer",
        currentProject: "Project F",
        branch: "Branch 2",
    },
    {
        employeeID: 12331,
        employee: "Umar Saad",
        date: "11/18/2023",
        amount: 270,
        status: "Pending",
        designation: "Business Analyst",
        currentProject: "Project G",
        branch: "Branch 3",
    },
];

// Use this updated data array in your code as needed



const Payroll = ({ sideBarWidth }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleRequestPayment = (employee) => {
        setSelectedEmployee(employee);
        onOpen();
    };
    const toast = useToast();

    const handleDrawerClose = () => {
        setTimeout(() => {
            toast({
                title: "Payment Processed",
                description: "The payment has been processed successfully.",
                status: "success",
                duration: 3000,
                position: "top-right",
                isClosable: true,
            });
        }, 2);
      
        onClose(); // Ensure that onClose is properly called to close the Drawer
    };

    return (
        <Box py={8} w="auto" minH="100vh">
            <Container maxW="container.xxl" justifySelf="center">
                <Box
                    ml={{ base: 0, lg: sideBarWidth === "small" ? 14 : 60 }}
                    transition="margin 0.3s ease-in-out"
                >
                    <Box w="100%" minH="80vh">
                        <Heading fontWeight="semibold" my={6}>Payroll Dashboard</Heading>
                        <SimpleGrid
                            my={10}
                            columns={{ base: 1, md: 2, lg: 3 }}
                            spacing={10}
                            mx={4}
                        >
                            {items.map((item, index) => (
                                <Box
                                    key={index}
                                    boxShadow="lg"
                                    borderRadius="lg"
                                    p={4}
                                    textAlign="center"
                                    bg="gray.100"
                                >
                                    <Text fontSize="lg" fontWeight="bold">{item.title}</Text>
                                    <Text fontSize="xl">$ {item.amount.toFixed(2)}</Text>
                                </Box>
                            ))}
                        </SimpleGrid>
                        {/* Drawer component */}
                        <Drawer
                            placement="right"
                            onClose={handleDrawerClose}
                            isOpen={isOpen}
                            size="lg"
                        >
                            <DrawerOverlay />
                            <DrawerContent>
                                <DrawerCloseButton />
                                <DrawerHeader borderBottomWidth="1px">Release Payment</DrawerHeader>
                                <DrawerBody>
                                    {/* Content of the drawer */}
                                    {selectedEmployee && (
                                        <Box>
                                            <VStack spacing={4} align="start">
                                                <Text fontWeight="bold" fontSize="xl">
                                                    Employee: {selectedEmployee.employee}
                                                </Text>
                                                <Text fontSize="xl">Date: {selectedEmployee.date}</Text>
                                                <Text fontSize="xl">Amount: ${selectedEmployee.amount.toFixed(2)}</Text>
                                                <Text fontSize="xl">Status: {selectedEmployee.status}</Text>
                                                <Text fontSize="xl">Designation: {selectedEmployee.designation}</Text>
                                                <Text fontSize="xl">Current Project: {selectedEmployee.currentProject}</Text>
                                                <Text fontSize="xl">Branch: {selectedEmployee.branch}</Text>
                                            </VStack>
                                            {/* Add other details as needed */}
                                            <Button
                                                colorScheme="green"
                                                mt={6}
                                                onClick={handleDrawerClose}
                                            >
                                                Make Payment
                                            </Button>
                                        </Box>
                                    )}
                                </DrawerBody>
                            </DrawerContent>
                        </Drawer>

                        <TableContainer mx={4} justifySelf="center">
                            <Table variant="striped">
                                <Thead>
                                    <Tr bg="blue.600">
                                        <Th color="white">Employee ID</Th>
                                        <Th color="white">Employee</Th>
                                        <Th color="white">Date</Th>
                                        <Th color="white">Amount</Th>
                                        <Th color="white">Status</Th>
                                        <Th color="white" pl={10}>Payment</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data.map((dataItem, index) => (
                                        <Tr key={index}>
                                            <Td color="gray.600">{dataItem.employeeID}</Td>
                                            <Td color="gray.600">{dataItem.employee}</Td>
                                            <Td color="gray.600">{dataItem.date}</Td>
                                            <Td color="gray.600">$ {dataItem.amount.toFixed(2)}</Td>
                                            <Td>
                                                <Badge
                                                    colorScheme={dataItem.status === "Approved" ? "green" : "orange"}
                                                    variant="subtle"
                                                    borderRadius="md"
                                                    p={2}
                                                >
                                                    {dataItem.status}
                                                </Badge>
                                            </Td>
                                            <Td>
                                                <Button
                                                    m={4}
                                                    colorScheme="green"
                                                    leftIcon={data[index].status === 'Approved' ? false : <BiDollar />}
                                                    onClick={() => handleRequestPayment(data[index])}
                                                    isDisabled={data[index].status === 'Approved'}
                                                >
                                                    {data[index].status === 'Approved' ? 'Payment Approved' : 'Release Payment'}
                                                </Button>
                                            </Td>


                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>

                    </Box>
                </Box>
            </Container>
        </Box>
    )
}

export default Payroll