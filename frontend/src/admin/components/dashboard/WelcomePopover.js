import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Box,
    Heading,
    Text,
    Stack,
    Icon,
    Card, 
    CardBody
} from '@chakra-ui/react';
import { InfoOutlineIcon, StarIcon, CheckCircleIcon } from '@chakra-ui/icons';

const fadeIn = {
    transition: 'opacity 0.5s ease-in',
    opacity: 1,
};

const fadeOut = {
    transition: 'opacity 0.5s ease-out',
    opacity: 0,
};

const WelcomePopover = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [user, setUser] = useState(null);
    const [isClosing, setIsClosing] = useState(false);
    const [upcomingMeetings, setUpcomingMeetings] = useState([]);

    useEffect(() => {
        const hasShown = localStorage.getItem('welcomePopoverShown');
        if (hasShown) return; // If already shown, do nothing
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
        onOpen();

        // Simulate fetching upcoming meetings (replace with actual API call)
        const fetchedMeetings = [
            { date: '2024-08-20', title: 'Project Kickoff' },
            { date: '2024-08-25', title: 'Design Review' },
        ];
        setUpcomingMeetings(fetchedMeetings);
    }, [onOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
             // Set the flag in localStorage to indicate the popover has been shown
             localStorage.setItem('welcomePopoverShown', 'true');
            onClose();
        }, 500); // Match this duration with the fadeOut transition
    };

    const getRoleSpecificMessage = () => {
        if (!user || !user.role) {
            return (
                <Stack spacing={4} align="center">
                    <Box>
                        <Icon as={InfoOutlineIcon} w={6} h={6} color="yellow.200" mb={2} />
                        <Text fontSize="md">Please ensure you review your profile and settings.</Text>
                    </Box>
                    <Box>
                        <Icon as={StarIcon} w={6} h={6} color="blue.200" mb={2} />
                        <Text fontSize="md">Stay updated with any recent changes or announcements.</Text>
                    </Box>
                    <Box>
                        <Icon as={CheckCircleIcon} w={6} h={6} color="green.200" mb={2} />
                        <Text fontSize="md">Keep track of your activities and tasks.</Text>
                    </Box>
                </Stack>
            );
        }

        switch (user.role) {
            case 'CLIENT':
                return (
                    <>
                        <Stack spacing={4} direction="row" align="center" justify="space-around">
                            <Card borderRadius="md" boxShadow="md" p={4} bg="green.200" color="black">
                                <CardBody textAlign="center">
                                    <Icon as={InfoOutlineIcon} w={6} h={6} color="green.400" mb={2} />
                                    <Text fontSize="md" color="white" textAlign="start">Today's Pending Jobs:</Text>
                                    <Text fontSize="sm" color="white" textAlign="start">• Job 1: Front-End Developer</Text>
                                    <Text fontSize="sm" color="white" textAlign="start">• Job 2: Back-End Developer</Text>
                                </CardBody>
                            </Card>
                            <Card borderRadius="md" boxShadow="md" p={4} bg="green.200" color="black">
                                <CardBody textAlign="center">
                                    <Icon as={StarIcon} w={6} h={6} color="green.400" mb={2} />
                                    <Text fontSize="md" color="white" textAlign="start">Scheduled Interviews:</Text>
                                    <Text fontSize="sm" color="white" textAlign="start">• Biller1 at 09:00 A.M</Text>
                                    <Text fontSize="sm" color="white" textAlign="start">• Biller2 at 12:00 P.M</Text>
                                </CardBody>
                            </Card>
                            <Card borderRadius="md" boxShadow="md" p={4} bg="green.200" color="black">
                                <CardBody textAlign="center">
                                    <Icon as={CheckCircleIcon} w={6} h={6} color="green.400" mb={2} />
                                    <Text fontSize="md" color="white" textAlign="start">Completed Jobs:</Text>
                                    <Text fontSize="sm" color="white" textAlign="start">• Job 1: LAMP-Stack Developer</Text>
                                    <Text fontSize="sm" color="white" textAlign="start">• Job 2: MERN Developer</Text>
                                </CardBody>
                            </Card>
                        </Stack>
                        <Box textAlign="center" mt={4}>
                            <Text fontSize="lg">Thank you for being a valued client! Please reach out if you have any questions or need assistance.</Text>
                        </Box>
                    </>
                );
            default:
                return (
                    <Stack spacing={4} align="center">
                        <Box>
                            <Icon as={InfoOutlineIcon} w={6} h={6} color="yellow.200" mb={2} />
                            <Text fontSize="md">Please ensure you review your profile and settings.</Text>
                        </Box>
                        <Box>
                            <Icon as={StarIcon} w={6} h={6} color="blue.200" mb={2} />
                            <Text fontSize="md">Stay updated with any recent changes or announcements.</Text>
                        </Box>
                        <Box>
                            <Icon as={CheckCircleIcon} w={6} h={6} color="green.200" mb={2} />
                            <Text fontSize="md">Keep track of your activities and tasks.</Text>
                        </Box>
                    </Stack>
                );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="xl"
            scrollBehavior="inside"
        >
            <ModalOverlay />
            <ModalContent
                maxWidth="60vw"
                maxHeight="90vh"
                borderRadius="md"
                boxShadow="xl"
                p={6}
                bgGradient="linear(to-br, green.300, teal.500)"
                color="white"
                style={isClosing ? fadeOut : fadeIn} // Apply fade-in and fade-out animations
            >
                <ModalHeader>
                    <Heading size="lg">Welcome, {user?.userName}!</Heading>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box textAlign="center">
                        <Text fontSize="lg" mb={4}>
                            Hello! Here's some important information for you.
                        </Text>
                        {getRoleSpecificMessage()}
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="teal" onClick={handleClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default WelcomePopover;
