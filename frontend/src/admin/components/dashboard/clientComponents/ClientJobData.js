import {
    Button,
    GridItem,
    SimpleGrid,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue, useDisclosure
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllJobs } from "../../../../API/job";
import Drawers from "../../../pages/job/component/Drawers";
const fetchJobs = async () => {
    try {
        const jobData = await getAllJobs();
        return jobData.jobs;
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return [];
    }
};

const ClientJobData = ({ title, buttonLabel }) => {
    const bgColor = useColorModeValue("white", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const [jobs, setJobs] = useState([]);
    const [drawerType, setDrawerType] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        const fetchAndSetJobs = async () => {
            const jobList = await fetchJobs(); // Fetch jobs
            console.log("info from fetch and set job data: ", jobList);
            setJobs(jobList); // Set jobs in state
        };
        fetchAndSetJobs();
    }, []);

    const handleButtonClick = () => {
        setDrawerType("addNew");
        setSelectedItem(null);
        onOpen();
    };

    return (
        <>
            <TableContainer
                bg={bgColor}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="lg"
                pt={6}
                pb={10}
                shadow="md"
                textAlign="center"
                minH={"100%"}
                overflowX="auto"
                transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out" // Smooth transition
                _hover={{ transform: "scale(1.02)", boxShadow: "lg" }} // Hover effect
            >
                <SimpleGrid columns={2} justifyContent="space-between" mb={4} px={4}>
                    <Text fontSize="xl" fontWeight="semibold" mb={2} align={"left"}>
                        {title}
                    </Text>
                    <GridItem colSpan={1 / 3} style={{ justifySelf: "end" }}>
                        <Button variant="solid" colorScheme="whatsapp" color={'white'}
                            size={{ base: "sm" }}
                            px={3}
                            py={2}
                            onClick={handleButtonClick}
                        >
                            {buttonLabel}
                        </Button>
                    </GridItem>
                </SimpleGrid>
                <Table variant="simple" size={'md'}>
                    <Thead>
                        <Tr bg="gray.100" color="white">
                            <Th>Job ID</Th>
                            <Th>Description</Th>
                            <Th>Start date</Th>
                            <Th>Duration</Th>
                            <Th>Status</Th>
                            <Th>Assigned Billers</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {jobs && jobs.length > 0 ? (
                            jobs.map((job, index) => (
                                <Tr key={index}>
                                    <Td>{job.jobId}</Td>
                                    <Td>{job.title}</Td>
                                    <Td>{job.startDate}</Td>
                                    <Td>{job.duration}</Td>
                                    <Td>{job.status}</Td>
                                    <Td>
                                        {job.billers && job.billers.length > 0 ? (
                                            job.billers.map((biller) => biller.userName).join(", ") // Display biller names
                                        ) : (
                                            "N/A"
                                        )}
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan="5" style={{ textAlign: 'center' }}>No jobs available</Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
            <Drawers
                isOpen={isOpen}
                onClose={onClose}
                drawerType={drawerType}
                data={selectedItem}
                handleAddUpdateDeleteItem={() => {
                    // Callback function to handle add, update or delete
                    console.log("Item added/updated/deleted");
                }}
            />
        </>
    );
};

export default ClientJobData;
