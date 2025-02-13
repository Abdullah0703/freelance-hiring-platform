import {
    Box,
    Button,
    FormControl,
    FormLabel,
    SimpleGrid,
    useColorModeValue
} from "@chakra-ui/react";
import React from "react";

const Show = ({ onClose, selectedItem, role }) => {
    const bgColor = useColorModeValue("gray.100", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textStyles = {
        border: "1px solid grey",
        backgroundColor: "transparent",
        width: "100%",
        padding: "0.5rem",
        borderRadius: "0.5rem",
    };

    console.log("selectedItem", selectedItem)

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
                        <FormLabel fontWeight="semibold">Name</FormLabel>
                        <div style={textStyles}>{selectedItem.name}</div>
                    </Box>
                    <Box mb={2}>
                        <FormLabel fontWeight="semibold">Description</FormLabel>
                        <div style={textStyles}>{selectedItem.description}</div>
                    </Box>
                    <Box mb={2}>
                        <FormLabel fontWeight="semibold">Estimated Time</FormLabel>
                        <div style={textStyles}>{selectedItem.estimatedTime}</div>
                    </Box>
                    <Box mb={2}>
                        <FormLabel fontWeight="semibold">Deadline</FormLabel>
                        <div style={textStyles}>{selectedItem.deadline}</div>
                    </Box>
                    {role == 'admin' && (
                        <Box mb={2}>
                            <FormLabel fontWeight="semibold">Assigned To</FormLabel>
                            <div style={textStyles}>
                                {selectedItem.Users && selectedItem.Users.length > 0 ? (
                                    selectedItem.Users.map((user, index) => (
                                        <span key={index}>
                                            {user.fname}
                                            {index !== selectedItem.Users.length - 1 && <br />}
                                        </span>
                                    ))
                                ) : (
                                    <span>Task not assigned to any employee</span>
                                )}
                            </div>
                        </Box>
                    )}




                </SimpleGrid>
                <Button
                    variant="outline"
                    colorScheme="red"
                    mt={2}
                    mr={2}
                    onClick={onClose}
                >
                    Close
                </Button>
            </FormControl>
        </Box>
    );
};

export default Show;
