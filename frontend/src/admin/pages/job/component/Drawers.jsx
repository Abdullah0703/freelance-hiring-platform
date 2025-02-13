import { ArrowBackIcon, EmailIcon, InfoOutlineIcon, PhoneIcon } from '@chakra-ui/icons';
import {
    Badge,
    Box,
    Button,
    ButtonGroup,
    Card,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Heading,
    Icon,
    Image,
    SimpleGrid,
    Stack,
    Text,
    useToast
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '../../../../API/constants';
import { createJobAssignment, updateJob } from '../../../../API/job';
import { fetchUserById } from "../../../../API/userprofile";
import AddJob from "./AddJob";
import EditJob from "./EditJob";

const Drawers = ({
    isOpen,
    onClose,
    drawerType,
    data,
    handleAddUpdateDeleteItem,
}) => {
    const [billerDetails, setBillerDetails] = useState([]);
    const [selectedBillers, setSelectedBillers] = useState(new Set());
    const [selectedJob, setSelectedJob] = useState(null);
    const [finalizeLoading, setFinalizeLoading] = useState(false); // Loading state for finalizing billers
    const toast = useToast(); // Initialize the toast function
    const [showAllSkills, setShowAllSkills] = useState(false);
    const navigate = useNavigate();

    const handleViewProfile = (userId) => {
        console.log('Biller details before finding:', billerDetails);
        console.log('User ID passed:', userId);

        const selectedBiller = billerDetails.find(biller => biller.userId === userId);

        if (selectedBiller) {
            console.log('Selected biller:', selectedBiller);
            navigate('/billerprofile', { state: { biller: selectedBiller } });
            console.log("Navigate function called");
        } else {
            console.error('No biller found for userId:', userId);
        }
    }

    // Function to fetch and display users based on IDs
    const fetchAndDisplayUsers = async (item) => {
        try {
            console.log('Raw item data received:', item);
            const data = item;
            const { jobId, recommendedProfiles } = data;
            console.log('Job ID:', jobId);
            console.log('Recommended Profiles:', recommendedProfiles);

            // Extract parsedProfiles from the item object
            const parsedProfiles = JSON.parse(recommendedProfiles);

            if (!Array.isArray(parsedProfiles)) {
                throw new Error('Expected parsedProfiles to be an array');
            }

            // Filter out any empty or invalid IDs
            const userIds = parsedProfiles.filter(id => id).map(id => id.toString().trim());

            if (userIds.length === 0) {
                throw new Error('No valid user IDs provided in parsedProfiles');
            }

            // Fetch users based on IDs
            const userRequests = userIds.map(id => fetchUserById(id));
            const userResponses = await Promise.all(userRequests);

            // Extract and flatten data from responses
            const users = userResponses.map(response => ({
                userId: response.data.user.userId,
                userName: response.data.user.userName,
                email: response.data.user.email,
                phoneNumber: response.data.user.phoneNumber,
                skills: response.data.user.skills,
                address: response.data.user.address,
                profilePicture: response.data.user.profilePicture
            }));
            console.log('Fetched user data:', users);

            // Display or use the users data as needed
            console.log('Users:', users);
            setBillerDetails(users);
            console.log('Set biller details using users', billerDetails);

        } catch (error) {
            console.error('Error fetching and displaying users:', error);
        }
    };

    useEffect(() => {
        if (drawerType === "viewRecommended") {
            console.log("data is of type: ", typeof (data))
            console.log("data is : ", data.jobId);
            fetchAndDisplayUsers(data);
        }
    }, [drawerType, data]);

    useEffect(() => {
        if (!isOpen) {
            setBillerDetails([]);
            setSelectedBillers(new Set());
            setSelectedJob(null);
        }
    }, [isOpen]);

    const handleSelectBiller = (userId) => {
        setSelectedBillers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            console.log("Selected Billers:", Array.from(newSet));
            return newSet;
        });
    };

    const handleFinalizeBillers = async () => {
        setFinalizeLoading(true); // Start loading

        const billerIds = Array.from(selectedBillers);
        // Check if any billers are selected
        if (billerIds.length === 0) {
            toast({
                title: "No Billers Selected",
                description: "No billers are selected to finalize for the job.",
                status: "error",
                duration: 5000,
                position: "top-right",
                isClosable: true,
            });
            setFinalizeLoading(false); // Stop loading in case of error
            return; // Exit the function early
        }
        console.log("Selected Biller IDs:", billerIds);
        console.log("Job ID:", data.jobId);

        try {
            // Assign each selected biller to the job
            await Promise.all(billerIds.map(billerId => {
                const jobAssignment = {
                    jobId: data.jobId,
                    billerId: billerId,
                };
                return createJobAssignment(jobAssignment);
            }));

            // Update the job status to FINALIZED
            await updateJob(data.jobId, { status: 'FINALIZED' });
            console.log('Billers assigned and job status updated to FINALIZED');

            // Display success toast
            toast({
                title: "Billers Assigned",
                description: "The billers have been successfully assigned to the job and The job status has been updated to FINALIZED.",
                status: "success",
                duration: 5000,
                position: "top-right",
                isClosable: true,
            });
        } catch (error) {
            console.error('Error finalizing billers:', error);

            // Display error toast
            toast({
                title: "Error",
                description: "There was an error assigning the billers to the job.",
                status: "error",
                duration: 5000,
                position: "top-right",
                isClosable: true,
            });
        } finally {
            setFinalizeLoading(false); // Stop loading
        }
        onClose();
    };

    const renderDrawer = () => {
        switch (drawerType) {
            case "addNew":
                return (
                    <AddJob onClose={onClose} handleAddUpdateDeleteItem={handleAddUpdateDeleteItem} />
                );
            case "edit":
                return (
                    <EditJob
                        selectedItem={data}
                        onClose={onClose}
                        handleAddUpdateDeleteItem={handleAddUpdateDeleteItem}
                    />
                );
            case "viewRecommended":
                const toggleShowSkills = () => {
                    setShowAllSkills(!showAllSkills);
                };
                return (
                    <Box p={4}>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} p={8}>
                            {billerDetails.slice(0, 5).map((biller, index) => (
                                <Card
                                    key={biller.userId}
                                    direction={{ base: 'column', sm: 'row' }}
                                    overflow='hidden'
                                    variant='outline'
                                    bg='white'
                                    shadow='lg'
                                    borderRadius='md'
                                    boxShadow='0 4px 8px rgba(0, 0, 0, 0.3)'
                                    _hover={{ boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)' }}
                                    transition='all 0.3s ease-in-out'
                                    display='flex'
                                    flexDirection='column'
                                    alignItems='center'
                                    background='linear-gradient(to bottom right, #e0f2f1, #b2dfdb)'
                                >
                                    <Box
                                        mt={2}
                                        borderRadius='full'
                                        overflow='hidden'
                                        maxW='150px'
                                        maxH='150px'
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='center'
                                    >
                                        <Image
                                            objectFit='cover'
                                            src={`${BASE_URL}/uploads/profile/${biller.profilePicture}`}
                                            alt={`${biller.userName}'s profile`}
                                            borderRadius='full'
                                            width='150px'
                                            height='150px'
                                        />
                                    </Box>
                                    <Stack
                                        direction='column'
                                        spacing={3}
                                        p={4}
                                        align='center'
                                        flex='1'
                                    >
                                        <Heading size='md' mb={2}>{biller.userName}</Heading>
                                        <Text>{console.log("Image URL:", `${BASE_URL}/uploads/profile/${biller.profilePicture}`)}</Text>
                                        <Stack spacing={2} textAlign='center'>
                                            <Stack direction='row' align='center' spacing={2}>
                                                <Icon as={EmailIcon} boxSize={5} color='teal.500' />
                                                <Text fontSize='sm' color='gray.600' fontWeight={"bold"}>Email: {biller.email}</Text>
                                            </Stack>
                                            <Stack direction='row' align='center' spacing={2}>
                                                <Icon as={PhoneIcon} boxSize={5} color='teal.500' />
                                                <Text fontSize='sm' color='gray.600' fontWeight={"semibold"}>Phone: {biller.phoneNumber}</Text>
                                            </Stack>
                                            <Stack direction='row' align='center' spacing={2}>
                                                <Icon as={InfoOutlineIcon} boxSize={5} color='teal.500' />
                                                <Text fontSize='sm' color='gray.600' fontWeight={"bold"}>Skills:</Text>
                                                <Flex
                                                    flexWrap="wrap"
                                                    gap={1}
                                                    maxWidth="100%"
                                                    overflowX="auto"
                                                >
                                                    {(showAllSkills ? biller.skills.split(',') : biller.skills.split(',').slice(0, 5)).map((skill, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="solid"
                                                            colorScheme="whatsapp"
                                                            borderRadius="full"
                                                            px={2}
                                                            // py={1}
                                                            minWidth="fit-content"
                                                        >
                                                            {skill.trim()}
                                                        </Badge>
                                                    ))}
                                                </Flex>
                                                {biller.skills.split(',').length > 5 && (
                                                    <Button variant="link" colorScheme="whatsapp" onClick={toggleShowSkills} ml={1} size="sm">
                                                        {showAllSkills ? 'See Less' : 'See More...'}
                                                    </Button>
                                                )}
                                            </Stack>
                                        </Stack>
                                        <ButtonGroup spacing={4}>
                                            <Button
                                                onClick={() => handleSelectBiller(biller.userId)}
                                                colorScheme={selectedBillers.has(biller.userId) ? 'gray' : 'green'}
                                            >
                                                {selectedBillers.has(biller.userId) ? 'Deselect' : 'Select'}
                                            </Button>
                                            <Button
                                                onClick={() => handleViewProfile(biller.userId)}
                                                colorScheme="green"
                                            >
                                                View Profile
                                            </Button>
                                        </ButtonGroup>
                                    </Stack>
                                </Card>
                            ))}
                        </SimpleGrid>
                        <Box display='flex' justifyContent='center' p={8}>
                            <Button
                                colorScheme="whatsapp"
                                onClick={handleFinalizeBillers}
                                isLoading={finalizeLoading} // Show loading spinner
                            >
                                Finalize Billers
                            </Button>
                        </Box>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Drawer isOpen={isOpen} placement="right" size="full" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader>
                    <Button
                        leftIcon={<ArrowBackIcon />}
                        onClick={onClose}
                        variant="ghost"
                        alignItems="center"
                        justifyContent="center"
                    />
                    {drawerType === "addNew" && "Add New Job"}
                    {drawerType === "edit" && "Edit Job Details"}
                    {drawerType === "viewRecommended" && "Recommended Billers"}
                </DrawerHeader>
                <DrawerBody>{renderDrawer()}</DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default Drawers;
