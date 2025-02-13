import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, useColorModeValue, Select} from "@chakra-ui/react";
// import { updateTicketById } from "../../../../API/ticket"; // Adjust the import path as needed

const EditTicket = ({ selectedItem, onClose, editTicket }) => {
    const [issue, setissue] = useState(selectedItem?.issue || "");
    const [jobId, setJobId] = useState(selectedItem?.jobId || "");
    const [status, setStatus] = useState(selectedItem?.status || "");
    const role = localStorage.getItem("role");
    const bgColor = useColorModeValue("gray.100", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textStyles = {
        border: "1px solid grey",
        backgroundColor: "transparent",
        width: "100%",
        padding: "0.5rem",
        borderRadius: "0.5rem",
    };
    const handleSubmit = async () => {
        try {
            // Prepare data to be sent based on role
            let updatedData = {};
            if (role === "ADMIN") {
                updatedData = { complaint: issue, actionByAdmin: status };
            } else if (role === "CLIENT") {
                updatedData = { complaint: issue, actionByClient: status };
            }

            // Call the editTicket function with the updated data
            await editTicket(selectedItem.ticketId, updatedData);
            onClose();
        } catch (error) {
            console.error("Error updating ticket:", error);
        }
    };

    useEffect(() => {
        if (selectedItem) {

            setissue(selectedItem.issue);
            setJobId(selectedItem.jobId);
        }
    }, [selectedItem]);

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
            <FormControl id="issue" mb={4} >
                <FormLabel fontWeight={"semibold"}>Issue Details</FormLabel>
                <Textarea
                    style={textStyles}
                    value={issue}
                    onChange={(e) => setissue(e.target.value)}
                    placeholder="Describe the Issue..."
                />
            </FormControl>
            <FormControl id="status" mb={4} isRequired>
                <FormLabel fontWeight={"semibold"}>Status</FormLabel>
                <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="Select status"
                >
                    <option value="resolved">Resolved</option>
                    <option value="pending">Unresolved</option>
                </Select>
            </FormControl>
            <Button colorScheme="whatsapp"
             onClick={handleSubmit}
            >
                Update Ticket
            </Button>
        </Box>
    );
};

export default EditTicket;
