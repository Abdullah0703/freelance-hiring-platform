import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Text,
    useColorModeValue,
    Flex,
    Image,
    SimpleGrid,
    Divider,
    Icon,
    Progress,
    Tooltip,
    Heading,
    Badge,
    VStack,
    Select
} from "@chakra-ui/react";
import {
    BiChevronLeft,
    BiChevronRight,
    BiArrowBack
} from "react-icons/bi";
import {
    FaMapMarkerAlt,
    FaEnvelope,
    FaPhone,
    FaRegCalendarAlt,
    FaHourglassStart,
    FaRegClock,
    FaClock,
    FaCheck,
    FaExclamation
} from 'react-icons/fa';
import { BASE_URL } from "../../../../API/constants";
import { getCompletedJobs } from "../../../../API/biller";
import { Md10Mp } from "react-icons/md";

const user = JSON.parse(localStorage.getItem("user"));
const role = localStorage.getItem("role");

const defaultBillerProfileData = {
    profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    userName: "Default Name",
    address: "N/A",
    email: "default@example.com",
    phoneNumber: "000-000-0000",
    role: "BILLER",
    skills: "N/A",
    currentStatus: "Active",
    loginTime: "08:00 Hours",
    workingHours: "10:00 am - 07:00 pm",
    expectedHours: "40 Hours per week",
    attendanceRecords: []
};

const BillerProfile = ({ billerProfileData = defaultBillerProfileData }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { biller, userId } = location.state || {};
    const bgColor = useColorModeValue("white", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [completedJobs, setCompletedJobs] = useState([]);
    const [pendingJobs, setPendingJobs] = useState([]);
    const [selectedJobType, setSelectedJobType] = useState('completed');
    const [billerData, setBillerData] = useState(billerProfileData);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleBackClick = () => {
        navigate(-1); // Navigate to the previous page
    };

    const attendanceRecords = billerProfileData.attendanceRecords || [];
    const indexOfLastItem = currentPage * itemsPerPage;
    const currentItems = attendanceRecords.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);

    const fetchJobs = async () => {
        try {
            const jobData = await getCompletedJobs(biller.userId);
            console.log("jobData", jobData);
            console.log("completed jobs of biller:", jobData.completedJobs);
            console.log("inprogress jobs of biller:", jobData.jobsInProgress);
            setCompletedJobs(jobData.completedJobs);
            setPendingJobs(jobData.jobsInProgress);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        const storedBiller = localStorage.getItem("selectedBiller");

        if (storedBiller) {
            try {
                const parsedBiller = JSON.parse(storedBiller); // Parse the stored JSON string
                setBillerData(parsedBiller); // Update the state with the parsed biller data
            } catch (error) {
                console.error("Failed to parse biller data from localStorage:", error);
            }
        } else {
            console.warn("No biller data found in localStorage.");
        }
        // Optionally, clean up localStorage after loading data
        return () => {
            localStorage.removeItem("selectedBiller");
        };
    }, []);

    const handleJobTypeChange = (event) => {
        setSelectedJobType(event.target.value);
    };

    const jobDataToDisplay = selectedJobType === 'completed' ? completedJobs : pendingJobs;

    return (
        <Box>
            {/* Heading and Back Button */}
            <Flex align="center" mb={4}>
                <IconButton
                    icon={<BiArrowBack />}
                    onClick={handleBackClick}
                    aria-label="Go Back"
                    mr={4}
                />
                <Heading>Biller Profile</Heading>
            </Flex>

            <Box
                bg={bgColor}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="md"
                p={4}
                shadow="md"
                mx="auto"
                h="37vh"
            >
                <Flex direction="row" w="80vw" h="25vh" mb={3}>
                    <Box h="100%">
                        <Image
                            src={`${BASE_URL}/uploads/profile/${billerProfileData.profilePicture}`}
                            objectFit="cover"
                            mt={2}
                            height="100%"
                            borderRadius="lg"
                        />
                    </Box>
                    <Box w="75%" p={3}>
                        <Text fontSize="xl" fontWeight="semibold">
                            {billerProfileData.userName || defaultBillerProfileData.userName}
                        </Text>
                        <SimpleGrid spacing={4} py={4} w="100%" columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}>
                            <Flex align="center">
                                <FaMapMarkerAlt style={{ marginRight: '8px', color: 'blue' }} />
                                <Text color="gray.500">{billerProfileData.address || defaultBillerProfileData.address}</Text>
                            </Flex>
                            <Flex align="center">
                                <FaEnvelope style={{ marginRight: '8px', color: 'green' }} />
                                <Text color="gray.500">{billerProfileData.email || defaultBillerProfileData.email}</Text>
                            </Flex>
                            <Flex align="center">
                                <FaPhone style={{ marginRight: '8px', color: 'purple' }} />
                                <Text color="gray.500">{billerProfileData.phoneNumber || defaultBillerProfileData.phoneNumber}</Text>
                            </Flex>
                        </SimpleGrid>
                        <Divider borderColor="gray.300" />
                        <SimpleGrid
                            columns={{ base: 1, lg: 2 }}
                            // spacing={}
                            mt={4}
                            w="100%"
                            display={{ base: 'none', lg: 'grid' }}
                        >
                            {/* First Grid Cell: Role and Skills */}
                            <VStack align="start" spacing={3}>
                                <Text fontWeight="semibold" color="gray.600">Role:</Text>
                                <Text color="gray.500">{billerProfileData.role || defaultBillerProfileData.role}</Text>

                                {/* <Text fontWeight="semibold" color="gray.600">Login Time:</Text>
                                <Text color="gray.500">{billerProfileData.loginTime || defaultBillerProfileData.loginTime}</Text> */}
                            </VStack>

                            {/* Second Grid Cell: Current Status and Skills */}
                            <VStack align="start" spacing={3}>
                                {/* <Text fontWeight="semibold" color="gray.600">Current Status:</Text>
                                <Text color="gray.500">{billerProfileData.currentStatus || defaultBillerProfileData.currentStatus}</Text> */}
                                <Text fontWeight="semibold" color="gray.600">Skills:</Text>
                                <Box
                                    maxH="100px"
                                    overflowY="auto"
                                    overflowX="hidden"
                                    display="flex"
                                    flexWrap="wrap"
                                    sx={{
                                        "&::-webkit-scrollbar": {
                                            width: "8px",
                                            borderRadius: "8px",
                                            backgroundColor: "#F0F0F0",
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                            backgroundColor: "#8BC34A",
                                            borderRadius: "8px",
                                            border: "2px solid #F0F0F0",
                                        },
                                    }}
                                >
                                    {(billerProfileData.skills || defaultBillerProfileData.skills).split(',').map((skill, index) => (
                                        <Badge
                                            key={index}
                                            variant="solid"
                                            colorScheme="whatsapp"
                                            borderRadius="full"
                                            px={2}
                                            py={1}
                                            mr={1}
                                            mb={1}
                                            minWidth="fit-content"
                                        >
                                            {skill.trim()}
                                        </Badge>
                                    ))}
                                </Box>
                            </VStack>
                        </SimpleGrid>
                    </Box>
                </Flex>
            </Box>

            <Divider borderColor="gray.300" my={3} />
            <Box
                bg={bgColor}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="md"
                p={4}
                shadow="md"
                mx="auto"
            >
                <Flex justify="space-between" align="center" mb={4}>
                    <Heading size='lg' fontSize='30px'>Jobs:</Heading>
                    <Select
                        placeholder="Select job type"
                        value={selectedJobType}
                        onChange={handleJobTypeChange}
                        maxWidth="200px"
                        sx={{
                            borderColor: "green.500",
                            _focus: {
                                borderColor: "green.500",
                                boxShadow: "0 0 0 1px green.500",
                            },
                            _hover: {
                                borderColor: "green.500",
                            }
                        }}
                    >
                        <option value="completed">Completed Jobs</option>
                        <option value="inprogress">In-Progress Jobs</option>
                    </Select>
                </Flex>
                <Box overflowX="auto">
                    <Table variant="simple" p={4}>
                        <Thead bgColor="gray.100">
                            <Tr>
                                {/* <Th>Job ID</Th> */}
                                <Th>Title</Th>
                                <Th>Date</Th>
                                <Th>Details</Th>
                                {/* <Th>Status</Th> */}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {jobDataToDisplay.map((job, index) => (
                                <Tr key={index}>
                                    {/* <Td>{job.jobId}</Td> */}
                                    <Td>{job.title}</Td>
                                    <Td>{job.startDate}</Td>
                                    <Td>{job.description}</Td>
                                    {/* <Td>{job.status}</Td> */}
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
                <Flex justify="space-between" align="center" mt={4}>
                    <IconButton
                        icon={<BiChevronLeft />}
                        onClick={() => handlePageChange(currentPage - 1)}
                        isDisabled={currentPage === 1}
                        aria-label="Previous Page"
                    />
                    <Text>
                        Page {currentPage} of {Math.ceil(jobDataToDisplay.length / itemsPerPage)}
                    </Text>
                    <IconButton
                        icon={<BiChevronRight />}
                        onClick={() => handlePageChange(currentPage + 1)}
                        isDisabled={currentPage === Math.ceil(jobDataToDisplay.length / itemsPerPage)}
                        aria-label="Next Page"
                    />
                </Flex>
            </Box>

            <Divider borderColor="gray.300" my={3} />

            {/* <Box
                bg={bgColor}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="md"
                p={4}
                shadow="md"
                mx="auto"
            >
                <Box overflowX="auto">
                    <Table variant="simple" p={4}>
                        <Thead bgColor="gray.100">
                            <Tr>
                                <Th>Date</Th>
                                <Th>Attendance Visual</Th>
                                <Th>Effective Hrs</Th>
                                <Th>Gross Hrs</Th>
                                <Th>Arrival</Th>
                                <Th>Log</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {currentItems.map((data, index) => (
                                <Tr key={index}>
                                    <Td>{data.date}</Td>
                                    <Td>
                                        <Progress value={data.attendanceVisual || 0} size="sm" colorScheme="blue" />
                                    </Td>
                                    <Td>{data.effectiveHrs || "N/A"}</Td>
                                    <Td>{data.grossHrs || "N/A"}</Td>
                                    <Td>{data.arrival || "N/A"}</Td>
                                    <Td>
                                        {data.log ? (
                                            <Icon as={FaCheck} color="green.500" />
                                        ) : (
                                            <Icon as={FaExclamation} color="red.500" />
                                        )}
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
                <Flex justify="space-between" align="center" mt={4}>
                    <IconButton
                        icon={<BiChevronLeft />}
                        onClick={() => handlePageChange(currentPage - 1)}
                        isDisabled={currentPage === 1}
                        aria-label="Previous Page"
                    />
                    <Text>
                        Page {currentPage} of {Math.ceil(attendanceRecords.length / itemsPerPage)}
                    </Text>
                    <IconButton
                        icon={<BiChevronRight />}
                        onClick={() => handlePageChange(currentPage + 1)}
                        isDisabled={currentPage === Math.ceil(attendanceRecords.length / itemsPerPage)}
                        aria-label="Next Page"
                    />
                </Flex>
                <Flex justify="space-between" align="center" mt={4}>
                    <IconButton
                        icon={<BiChevronLeft />}
                        onClick={() => handlePageChange(currentPage - 1)}
                        isDisabled={currentPage === 1}
                        aria-label="Previous Page"
                    />
                    <Text>
                        Page {currentPage} of {Math.ceil(attendanceRecords.length / itemsPerPage)}
                    </Text>
                    <IconButton
                        icon={<BiChevronRight />}
                        onClick={() => handlePageChange(currentPage + 1)}
                        isDisabled={currentPage === Math.ceil(attendanceRecords.length / itemsPerPage)}
                        aria-label="Next Page"
                    />
                </Flex>
            </Box> */}
        </Box>
    );
};

export default BillerProfile;
