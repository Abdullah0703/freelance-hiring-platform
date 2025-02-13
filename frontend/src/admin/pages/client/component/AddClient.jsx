import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import React, { useState } from "react";
import { createClient } from "../../../../API/client";

const user = JSON.parse(localStorage.getItem("user"));


const AddClient = ({ handleAddUpdateDeleteItem, onClose }) => {
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
  const [clientData, setClientData] = useState();

  // Handler to update editable values
  const handleInputChange = (field, value) => {
    setClientData({ ...clientData, [field]: value });
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    try {
      setBtnLoading(true);
      const updatedClientData = { ...clientData, role: 'CLIENT' }; // Add userId to clientData
      console.log("clientData", updatedClientData);

      const response = await createClient(updatedClientData);
      handleAddUpdateDeleteItem();
      console.log("Client added successfully:", response);

      // Show a success toast
      toast({
        title: "Client Added",
        description: "Client has been added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setBtnLoading(false);
    } catch (error) {
      console.error("Error adding Client", error);
      toast({
        title: "Error adding Client",
        description: "There is an error adding the Client, please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setBtnLoading(false);
    } finally {
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
            <FormLabel fontWeight="semibold">Name</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("userName", e.target.value)}
              type="text"
            />
          </Box>
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Address</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("address", e.target.value)}
              type="text"
            />
          </Box>
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Contact No.</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              type="text"
            />
          </Box>
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Email Address</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("email", e.target.value)}
              type="text"
            />
          </Box>
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Password</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("password", e.target.value)}
              type="password"
            />
          </Box>
          {/* <Box mb={2}>
            <FormLabel fontWeight="semibold">Name</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("fname", e.target.value)}
              type="text"
            />
          </Box> */}
          {/* <Box mb={2}>
            <FormLabel fontWeight="semibold">Address</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) =>
                handleInputChange("address", e.target.value)
              } // Handle address change
              type="text"
            />
          </Box> */}
          {/* <Box mb={2}>
            <FormLabel fontWeight="semibold">Email</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) =>
                handleInputChange("email", e.target.value)
              } // Handle address change
              type="text"
            />
          </Box> */}
          {/* <Box mb={2}>
            <FormLabel fontWeight="semibold">Password</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("password", e.target.value)}
              type="text"
            />
          </Box> */}

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
          Add Client
        </Button>
      </FormControl>
    </Box>
  );
};

export default AddClient;
