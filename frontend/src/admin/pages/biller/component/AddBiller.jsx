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
} from "@chakra-ui/react";
import { createBiller } from "../../../../API/biller";

const AddBiller = ({ handleAddUpdateDeleteItem, onClose }) => {
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
  const [billerData, setBillerData] = useState();

  // Handler to update editable values
  const handleInputChange = (field, value) => {
    setBillerData({ ...billerData, [field]: value });
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    try {
      setBtnLoading(true);
      const updatedBillerData = { ...billerData, role: 'BILLER' }; // Add userId to jobData
      const response = await createBiller(updatedBillerData);
      handleAddUpdateDeleteItem();

      // Show a success toast
      toast({
        title: "Biller Added",
        description: "Biller has been added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setBtnLoading(false);
    } catch (error) {
      toast({
        title: "Error adding Biller",
        description:
          "There is an error adding the Biller, please try again later.",
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
          {/* <Box mb={2}>
            <FormLabel fontWeight="semibold">Username</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("userName", e.target.value)}
              type="text"
            />
          </Box> */}
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
              onChange={(e) => handleInputChange("address", e.target.value)} // Handle address change
              type="text"
            />
          </Box>
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Email</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("email", e.target.value)} // Handle address change
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
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Contact</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              type="number"
            />
          </Box>
          {/* <Box mb={2}>
            <FormLabel fontWeight="semibold">Role</FormLabel>
            <Select
              style={textStyles}
              onChange={(e) => handleInputChange("role", e.target.value)}
              placeholder="Select role"
            >
              <option value="admin">Admin</option>
              <option value="employee">Biller</option>
            </Select>
          </Box> */}

          {/* <Box mb={2}>
            <FormLabel fontWeight="semibold">Designation</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("designation", e.target.value)}
              type="text"
            />
          </Box> */}
          {/* <Box mb={2}>
            <FormLabel fontWeight="semibold">Department</FormLabel>
            <Select
              style={textStyles}
              onChange={(e) => handleInputChange("department", e.target.value)}
              placeholder="Select department"
            >
              <option value="management">Management</option>
              <option value="sales">Sales</option>
              <option value="development">Development</option>
              <option value="hr">HR</option>
            </Select>
          </Box> */}

          <Box mb={2}>
            <FormLabel fontWeight="semibold">Skills</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("skills", e.target.value)}
              type="text"
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
          Add Biller
        </Button>
      </FormControl>
    </Box>
  );
};

export default AddBiller;
