import {
    Box,
    Button,
    Input,
    Select,
    SimpleGrid,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue
} from "@chakra-ui/react";
import React, { useState } from "react";

const InvoicesPayments = ({ invoicesData, paymentsData }) => {
    const [selectedInvoice, setSelectedInvoice] = useState("");

    const bgColor = useColorModeValue("white", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const gradientBg = useColorModeValue(
        'linear-gradient(to bottom right, #e0f2f1, #b2dfdb)',
        'linear-gradient(to bottom right, #1a202c, #2d3748)'
    );
    return (
        <Box width="100%">
            <SimpleGrid columns={1} spacing={3} py={2}>
                {/* Invoice List */}
                <Box
                    bg={bgColor}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    p={6}
                    shadow="md"
                    align="left"
                >
                    <Text fontSize="xl" fontWeight="semibold" mb={4}>
                        Invoice List
                    </Text>
                    <TableContainer overflowX="auto">
                        <Table variant="simple" size="md">
                            <Thead>
                                <Tr bg={gradientBg} color="white">
                                    <Th>Invoice #</Th>
                                    <Th>Client Name</Th>
                                    <Th>Amount</Th>
                                    <Th>Status</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {invoicesData && invoicesData.length > 0 ? (
                                    invoicesData.map((invoice) => (
                                        <Tr key={invoice.invoiceId}>
                                            <Td>{invoice.invoiceId}</Td>
                                            <Td>{invoice.clientName}</Td>
                                            <Td>{invoice.amount}</Td>
                                            <Td>{invoice.status}</Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr>
                                        <Td colSpan="4" style={{ textAlign: 'center' }}>No invoices available</Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* Create Invoice */}
                <Box
                    bg={bgColor}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    p={6}
                    shadow="md"
                    align="left"
                >
                    <Text fontSize="xl" fontWeight="semibold" mb={4}>
                        Create New Invoice
                    </Text>
                    <SimpleGrid columns={2} spacing={4}>
                        <Select placeholder="Select Client" mb={4}>
                            <option value="client1">Client 1</option>
                            <option value="client2">Client 2</option>
                        </Select>
                        <Input placeholder="Amount" type="number" mb={4} />
                        <Input placeholder="Description" mb={4} />
                        <Button variant="solid" colorScheme="whatsapp" color={'white'}>
                            Create Invoice
                        </Button>
                    </SimpleGrid>
                </Box>

                {/* Send Invoices */}
                <Box
                    bg={bgColor}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    p={6}
                    shadow="md"
                    align="left"
                >
                    <Text fontSize="xl" fontWeight="semibold" mb={4}>
                        Send Invoice
                    </Text>
                    <Select
                        placeholder="Select Invoice"
                        value={selectedInvoice}
                        onChange={(e) => setSelectedInvoice(e.target.value)}
                        mb={4}
                    >
                        {invoicesData && invoicesData.length > 0 ? (
                            invoicesData.map((invoice) => (
                                <option key={invoice.invoiceId} value={invoice.invoiceId}>
                                    Invoice #{invoice.invoiceId}
                                </option>
                            ))
                        ) : (
                            <option>No invoices available</option>
                        )}
                    </Select>
                    <Button variant="solid" colorScheme="whatsapp" color={'white'}>
                        Send Invoice
                    </Button>
                </Box>

                {/* Payment Tracking */}
                <Box
                    bg={bgColor}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    p={6}
                    shadow="md"
                    align="left"
                >
                    <Text fontSize="xl" fontWeight="semibold" mb={4}>
                        Payment Tracking
                    </Text>
                    <TableContainer overflowX="auto">
                        <Table variant="simple" size="md">
                            <Thead>
                                <Tr bg={gradientBg} color="white">
                                    <Th>Client Name</Th>
                                    <Th>Total Due</Th>
                                    <Th>Paid</Th>
                                    <Th>Due</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {paymentsData && paymentsData.length > 0 ? (
                                    paymentsData.map((payment, index) => (
                                        <Tr key={index}>
                                            <Td>{payment.clientName}</Td>
                                            <Td>{payment.totalDue}</Td>
                                            <Td>{payment.paid}</Td>
                                            <Td>{payment.due}</Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr>
                                        <Td colSpan="4" style={{ textAlign: 'center' }}>No payment data available</Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </SimpleGrid>
        </Box>
    );
};

export default InvoicesPayments;
