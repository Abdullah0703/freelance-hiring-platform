import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    SimpleGrid,
    useColorModeValue,
    useToast,
    Textarea,
    Select,
} from "@chakra-ui/react";
import { createWorkLog } from "../../../../API/worklog";
import { getJobsAssignedToBiller } from "../../../../API/job";

const AddWorkLog = ({ handleAddUpdateDeleteItem, onClose }) => {
    const bgColor = useColorModeValue("gray.100", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textStyles = {
        border: "1px solid grey",
        backgroundColor: "transparent",
        width: "100%",
        padding: "0.5rem",
        borderRadius: "0.5rem",
    };
    const toast = useToast();
    const [btnLoading, setBtnLoading] = useState(false);
    const [workLogData, setWorkLogData] = useState({
        taskDescription: "",
        date: "",
        hoursLog: "",
        jobId: "" // Add jobId to the workLogData state
    });
    const [jobs, setJobs] = useState([]); // State to hold jobs assigned to the biller

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setWorkLogData(prevData => ({ ...prevData, date: today }));

        // Fetch jobs assigned to the logged-in biller
        const fetchJobs = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user")) || {};
                const billerId = user.userId;
                console.log("Biller Id", billerId);
                const jobsData = await getJobsAssignedToBiller(billerId);
                console.log("jobs data", jobsData);
                setJobs(jobsData);
            } catch (error) {
                console.error("Error fetching jobs", error);
            }
        };

        fetchJobs();
    }, []);

    // const handleInputChange = (field, value) => {
    //     console.log(`Input field: ${field}, Value: ${value}`);
    //     setWorkLogData({ ...workLogData, [field]: value });
    // };

    // //new function
    const handleInputChange = (field, value) => {
        console.log(`Input field: ${field}, Value: ${value}`);
        setWorkLogData(prevData => ({
            ...prevData,
            [field]: field === "jobId" ? parseInt(value, 10) : value
        }));
    };

    const handleSubmit = async () => {
        try {
            setBtnLoading(true);
            const today = new Date().toISOString().split('T')[0];
            if (workLogData.date < today || workLogData.date > today) {
                toast({
                    title: "Invalid Date",
                    description: "You cannot select a past date. Please select the current date.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
                setBtnLoading(false);
                return;
            }
            const user = JSON.parse(localStorage.getItem("user")) || {};
            const userId = user.userId; // Retrieve userId from local storage

            const updatedWorkLogData = {
                ...workLogData,
                billerId: userId,
                hoursLog: parseInt(workLogData.hoursLog, 10)
            };
            console.log("updated worklog data", updatedWorkLogData);
            const response = await createWorkLog(updatedWorkLogData);
            handleAddUpdateDeleteItem();
            toast({
                title: "Work Log Added",
                description: "Work log has been added successfully!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        } catch (error) {
            console.error("Error adding Work Log", error);
            toast({
                title: "Error adding Work Log",
                description: "There was an error adding the work log. Please try again later.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        } finally {
            setBtnLoading(false);
            onClose();
        }
    };

    return (
        <Box
            spacing={10}
            borderWidth="1px"
            bg={bgColor}
            borderColor={borderColor}
            borderRadius="md"
            p={4}
            shadow="md"
            width="100%"
        >
            <FormControl>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <Box mb={2}>
                        <FormLabel fontWeight="semibold">Work Log Description</FormLabel>
                        <Textarea
                            style={textStyles}
                            onChange={(e) => handleInputChange("taskDescription", e.target.value)}
                            value={workLogData.taskDescription}
                        />
                    </Box>
                    <Box mb={2}>
                        <FormLabel fontWeight="semibold">Date</FormLabel>
                        <Input
                            style={textStyles}
                            onChange={(e) => handleInputChange("date", e.target.value)}
                            type="date"
                            value={workLogData.date}
                        />
                    </Box>
                    <Box mb={2}>
                        <FormLabel fontWeight="semibold">Hours Logged</FormLabel>
                        <Input
                            style={textStyles}
                            onChange={(e) => handleInputChange("hoursLog", e.target.value)}
                            type="number"
                            step="0.1"
                            value={workLogData.hoursLog}
                        />
                    </Box>
                    <Box mb={2}>
                        <FormLabel fontWeight="semibold">Select Job</FormLabel>
                        <Select
                            style={textStyles}
                            placeholder="Select job"
                            onChange={(e) => handleInputChange("jobId", e.target.value)}
                            value={workLogData.jobId}
                        >
                            {jobs.map((job) => (
                                <option key={job.jobId} value={job.jobId}>
                                    {job.title}
                                </option>
                            ))}
                        </Select>
                    </Box>
                </SimpleGrid>
                <Button
                    variant="outline"
                    colorScheme="red"
                    mt={2}
                    mr={2}
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant="solid"
                    colorScheme="whatsapp"
                    mt={2}
                    onClick={handleSubmit}
                    isLoading={btnLoading}
                >
                    Add Work Log
                </Button>
            </FormControl>
        </Box>

    );
};

export default AddWorkLog;
