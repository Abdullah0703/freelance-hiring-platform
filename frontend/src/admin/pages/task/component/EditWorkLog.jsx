import React, { useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    SimpleGrid,
    useColorModeValue,
    useToast,
    Textarea
} from "@chakra-ui/react";
import { updateWorkLog } from "../../../../API/worklog"; // Ensure this API call is correctly imported

const EditWorkLog = ({ handleAddUpdateDeleteItem, onClose, selectedItem }) => {

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
    const [workLogData, setWorkLogData] = useState(selectedItem);

    const handleInputChange = (field, value) => {
        setWorkLogData({ ...workLogData, [field]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            workLogData.hoursLog = parseInt(workLogData.hoursLog, 10); // Ensure hoursLog is an integer
            setBtnLoading(true);
            const today = new Date().toISOString().split('T')[0];
            if (workLogData.date < today || workLogData.date > today) {
                toast({
                    title: "Invalid Date",
                    description: "Please select the current date.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
                setBtnLoading(false);
                return;
            }
            console.log("submitting the work log", workLogData);
            const response = await updateWorkLog(workLogData.workLogId, workLogData); // Call the correct API function
            handleAddUpdateDeleteItem();
            console.log('Work log updated successfully:', response);
            toast({
                title: 'Work Log Updated',
                description: 'Work log has been updated successfully!',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
        } catch (error) {
            console.error('Error updating Work Log', error);
            toast({
                title: 'Error updating Work Log',
                description: 'There was an error updating the work log. Please try again later.',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "top-right"
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
                        <FormLabel fontWeight="semibold">Task Description</FormLabel>
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
                    Edit Work Log
                </Button>
            </FormControl>
        </Box>
    )
}

export default EditWorkLog