import React from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Text,
    VStack,
    useColorModeValue,
    Badge,
    Icon,
    HStack,
    Divider,
    Flex,
} from '@chakra-ui/react';
import { FaTicketAlt, FaUserAlt } from 'react-icons/fa';
import { MdOutlineReportProblem, MdWorkOutline, MdDescription } from 'react-icons/md';
import { CheckCircleIcon, CalendarIcon } from '@chakra-ui/icons';

const ShowTicket = ({ selectedItem, ticket, onClose, handleResolve }) => {
    const bgColor = useColorModeValue('gray.100', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.800', 'gray.200');

    // Fetch the user's role from localStorage
    const role = localStorage.getItem('role');
    const user = localStorage.getItem('user');

    // Parse the user object from localStorage
    const parsedUser = user ? JSON.parse(user) : null;

    // Determine if the resolve button should be disabled
    const isResolveDisabled =
        (role === 'ADMIN' && selectedItem?.actionByAdmin === 'resolved') ||
        (role === 'CLIENT' && selectedItem?.actionByClient === 'resolved');

    return (
        <Box
            borderWidth="2px"
            bg={bgColor}
            borderColor={borderColor}
            borderRadius="md"
            p={8}
            shadow="lg"
            width="100%"
            maxWidth="800px"
            mx="auto"
        >
            <VStack spacing={6} align="start">
                <Box width="100%">
                    <VStack align="start" spacing={4}>
                        {/* Ticket ID */}
                        <Flex align="center" width="100%">
                            <FormLabel fontWeight="bold" color={textColor} mb={0}>
                                <HStack spacing={2}>
                                    <Icon as={FaTicketAlt} color="whatsapp.500" />
                                    <Text>Ticket ID:</Text>
                                </HStack>
                            </FormLabel>
                            <Text fontSize="lg" color={textColor} ml="auto">
                                {selectedItem?.ticketId}
                            </Text>
                        </Flex>

                        <Divider borderColor={borderColor} />

                        {/* Complaint */}
                        <Flex align="center" width="100%">
                            <FormLabel fontWeight="bold" color={textColor} mb={0}>
                                <HStack spacing={2}>
                                    <Icon as={MdOutlineReportProblem} color="whatsapp.500" />
                                    <Text>Complaint:</Text>
                                </HStack>
                            </FormLabel>
                            <Text fontSize="lg" color={textColor} ml="auto">
                                {selectedItem?.complaint}
                            </Text>
                        </Flex>

                        <Divider borderColor={borderColor} />

                        {/* Job Title */}
                        <Flex align="center" width="100%">
                            <FormLabel fontWeight="bold" color={textColor} mb={0}>
                                <HStack spacing={2}>
                                    <Icon as={MdWorkOutline} color="whatsapp.500" />
                                    <Text>Job Title:</Text>
                                </HStack>
                            </FormLabel>
                            <Text fontSize="lg" color={textColor} ml="auto">
                                {selectedItem['Job.title']}
                            </Text>
                        </Flex>

                        <Divider borderColor={borderColor} />

                        {/* Job Description */}
                        <Flex align="center" width="100%">
                            <FormLabel fontWeight="bold" color={textColor} mb={0}>
                                <HStack spacing={2}>
                                    <Icon as={MdDescription} color="whatsapp.500" />
                                    <Text>Job Description:</Text>
                                </HStack>
                            </FormLabel>
                            <Text fontSize="lg" color={textColor} ml="auto">
                                {selectedItem['Job.description']}
                            </Text>
                        </Flex>

                        <Divider borderColor={borderColor} />

                        {/* Client Name with Conditional Logic */}
                        <Flex align="center" width="100%">
                            <FormLabel fontWeight="bold" color={textColor} mb={0}>
                                <HStack spacing={2}>
                                    <Icon as={FaUserAlt} color="whatsapp.500" />
                                    <Text>Client Name:</Text>
                                </HStack>
                            </FormLabel>
                            <Text fontSize="lg" color={textColor} ml="auto">
                                {role === 'CLIENT' && parsedUser ? parsedUser.userName : selectedItem['Job.client.userName']}
                            </Text>
                        </Flex>

                        <Divider borderColor={borderColor} />

                        {/* Status (Admin) */}
                        <Flex align="center" width="100%">
                            <FormLabel fontWeight="bold" color={textColor} mb={0}>
                                <HStack spacing={2}>
                                    <Icon as={CalendarIcon} color="whatsapp.500" />
                                    <Text>Status (Admin):</Text>
                                </HStack>
                            </FormLabel>
                            <Badge
                                borderRadius="md"
                                px={3}
                                py={1}
                                colorScheme={selectedItem?.actionByAdmin === 'resolved' ? 'green' : 'red'}
                                ml="auto"
                            >
                                {selectedItem?.actionByAdmin}
                            </Badge>
                        </Flex>

                        <Divider borderColor={borderColor} />

                        {/* Status (Client) */}
                        <Flex align="center" width="100%">
                            <FormLabel fontWeight="bold" color={textColor} mb={0}>
                                <HStack spacing={2}>
                                    <Icon as={CalendarIcon} color="whatsapp.500" />
                                    <Text>Status (Client):</Text>
                                </HStack>
                            </FormLabel>
                            <Badge
                                borderRadius="md"
                                px={3}
                                py={1}
                                colorScheme={selectedItem?.actionByClient === 'resolved' ? 'green' : 'red'}
                                ml="auto"
                            >
                                {selectedItem?.actionByClient}
                            </Badge>
                        </Flex>
                    </VStack>
                </Box>

                {/* Resolve Button */}
                <Button
                    colorScheme="whatsapp"
                    onClick={!isResolveDisabled ? () => { handleResolve(selectedItem.ticketId); onClose(); } : null}
                    size="lg"
                    width="full"
                    borderRadius="md"
                    cursor={isResolveDisabled ? 'not-allowed' : 'pointer'}
                    disabled={isResolveDisabled}
                    leftIcon={<CheckCircleIcon />}
                >
                    Resolve Ticket
                </Button>
            </VStack>
        </Box>
    );
};

export default ShowTicket;
