import React, { useState } from "react";
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
    InputGroup,
    InputLeftElement,
    Select,
    Flex,
    Input,
    useToast,
    Container,
    Heading, // Add this import
} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import {
    BiSearch,
    BiChevronLeft,
    BiChevronRight,
} from "react-icons/bi";
import Loading from "../../components/Loading/Loading";



const AttendanceList = ({ sideBarWidth }) => {

    const borderColor = useColorModeValue("gray.200", "gray.600");
    const [searchTerm, setSearchTerm] = useState("");
    const bgColor = useColorModeValue("white", "gray.700");
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);

    const toast = useToast();

    // const fetchEmployees = async () => {
    //     try {
    //         const employeeData = await getAllEmployees();
    //         console.log("employeeData", employeeData)
    //         setAttendanceData(employeeData.employees);
    //         // setIsLoading(false);
    //     } catch (error) {
    //         console.error("Error fetching employees:", error);
    //     }
    // };

    // useEffect(() => {
    //     fetchEmployees();
    // }, []);


    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await getAllAttendance();
    //             console.log("response", response); // Assuming the endpoint for fetching attendance data is "/api/attendance"
    //             if (response.success) {
    //                 setAttendanceData(response.attendance);
    //             } else {
    //                 toast({
    //                     title: "Error",
    //                     description: response.message || "Failed to fetch attendance data",
    //                     status: "error",
    //                     duration: 5000,
    //                     isClosable: true,
    //                 });
    //             }
    //         } catch (error) {
    //             toast({
    //                 title: "Error",
    //                 description: error.message || "Failed to fetch attendance data",
    //                 status: "error",
    //                 duration: 5000,
    //                 isClosable: true,
    //             });
    //         }
    //     };

    //     fetchData();
    // }, [toast]);

    const handleApproveRequest = () => {
        toast({
            title: "Leave Approved",
            description: "The Leave has been approved successfully.",
            status: "success",
            duration: 3000,
            position: "top-right",
            isClosable: true,
        });
        setIsApproveOpen(false)
        setTimeout(() => {
            window.location.reload()
        }, 2000);

    };
    const handleRejectRequest = () => {
        toast({
            title: "Leave Rejected",
            description: "The Leave has been rejected successfully.",
            status: "error",  // Change "success" to "error"
            duration: 3000,
            position: "top-right",
            isClosable: true,
        });
        setIsRejectOpen(false)
        setTimeout(() => {
            window.location.reload()
        }, 2000);

    };


    const [customerName, setCustomerName] = useState("");
    const navigate = useNavigate();

    const handleRowClick = (userId) => {
        navigate(`/attendance/user/${userId}`);
    };
    const handleBranchChange = (event) => {
        const department = event.target.value;
        setSelectedDepartment(department);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearchChange = (event) => {
        const searchText = event.target.value?.toLowerCase();
        setSearchTerm(searchText);
    };


    const filteredItems = attendanceData.filter(
        (item) =>
            (item.name?.toLowerCase().includes(searchTerm) ||
                item.address?.toLowerCase().includes(searchTerm) ||
                item.phoneNumber?.toLowerCase().includes(searchTerm)) &&
            (selectedDepartment == "" || item.department == selectedDepartment)
    );

    const capitalizeFirstLetter = (string) => {
        return string.replace(/\b\w/g, (char) => char.toUpperCase());
      };


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    if (!attendanceData) {
        return (<Loading />)
    }
    return (
        <Box bg={'gray.100'} py={8} w="auto" minH="100vh">
            <Container maxW="container.xxl" justifySelf="center">
                <Box
                    ml={{ base: 0, lg: sideBarWidth === "small" ? 14 : 60 }}
                    transition="margin 0.3s ease-in-out"
                >
                    <Heading as="h1" size="xl" mb={10}>
                        Attendance Management
                    </Heading>

                    <Box
                        bg={bgColor}
                        borderWidth="1px"
                        borderColor={borderColor}
                        borderRadius="md"
                        p={4}
                        shadow="md"
                        mx="auto"
                    >
                        <Flex align="center" mb={4} justify="space-between">
                            <Flex align="center" w="50%">
                                <InputGroup w="100%" size={"sm"}>
                                    <InputLeftElement
                                        pointerEvents="none"
                                        color="gray.400"
                                        fontSize="1.2em"
                                        ml={2}
                                    >
                                        <BiSearch />
                                    </InputLeftElement>
                                    <Input
                                        placeholder="Search by name of the Employee"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        borderRadius="0.3rem"
                                        py={2}
                                        pl={10}
                                        pr={3}
                                        fontSize="md"
                                        mr={4}
                                        _placeholder={{ color: "gray.400" }}
                                    />
                                </InputGroup>
                            </Flex>
                            <Flex align="center">
                                <Select
                                    placeholder="All Departments"
                                    value={selectedDepartment}
                                    onChange={handleBranchChange}
                                    borderRadius="0.3rem"
                                    py={2}
                                    fontSize="md"
                                    mr={4}
                                >
                                    {[...new Set(attendanceData.map((employee) => employee.department))].map(
                                        (department) => (
                                            <option key={department} value={department}>
                                                {department}
                                            </option>
                                        )
                                    )}
                                </Select>
                            </Flex>
                        </Flex>

                        <Table variant="simple" size={"lg"} >
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Address</Th>
                                    <Th>Contact</Th>
                                    <Th>Designation</Th>
                                    <Th>Department</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {currentItems.map((item) => (
                                    <Tr key={item.userId}>
                                        <Td
                                            onClick={() => handleRowClick(item.userId)}
                                            cursor="pointer"
                                            _hover={{ fontWeight: "bold" }}
                                            color="gray.600"  // Set the font color to gray.600
                                        >
                                            {item.name}
                                        </Td>
                                        <Td color="gray.600">{item.address}</Td>
                                        <Td color="gray.600">{item.phoneNumber}</Td>
                                        <Td color="gray.600">{item.designation}</Td>
                                        <Td color="gray.600">{item.department === "hr" ? item.department.toUpperCase() : capitalizeFirstLetter(item.department)}</Td> {/* Capitalize all letters if department is "HR" */}
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                        <Flex justify="space-between" mt={4} align="center">
                            <Box>
                                <IconButton
                                    icon={<BiChevronLeft />}
                                    isDisabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    aria-label="Previous Page"
                                />
                                <IconButton
                                    icon={<BiChevronRight />}
                                    isDisabled={indexOfLastItem >= filteredItems.length}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    ml={2}
                                    aria-label="Next Page"
                                />
                            </Box>
                            <Text fontSize="smaller">
                                Page {currentPage} of {Math.ceil(filteredItems.length / itemsPerPage)}
                            </Text>
                        </Flex>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default AttendanceList;
