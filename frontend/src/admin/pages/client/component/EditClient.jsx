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
import { updateClient } from "../../../../API/client";
import { user } from "../../../../API/constants";


let userRole = '';
let userId = 0;

const currentUser = JSON.parse(localStorage.getItem("user"));


if (currentUser) {
  userRole = currentUser.role;
  userId = currentUser.userId
}

const EditClient = ({ handleAddUpdateDeleteItem, onClose, selectedItem }) => {
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
  const [clientData, setClientData] = useState(selectedItem);

  const handleInputChange = (field, value) => {
    setClientData({ ...clientData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      clientData.phoneNumber = parseInt(clientData.phoneNumber);
      clientData.fname = clientData.name;
      clientData.userRole = userRole;
      setBtnLoading(true)
      const response = await updateClient(clientData.userId, clientData);
      handleAddUpdateDeleteItem();
      console.log('Client added successfully:', response);

      toast({
        title: 'Client Updated',
        description: 'Client has been updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });

      if (user.userId == response.user.userId) {
        localStorage.removeItem('user')
        localStorage.setItem('user', JSON.stringify(response.user));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }



      setBtnLoading(false)
    } catch (error) {
      console.error('Error adding Client', error);
      toast({
        title: 'Error updating Client',
        description: 'There is an error adding the Client, please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
      setBtnLoading(false)
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
              value={clientData.userName}
              type="text"
            />
          </Box>
          {/* <Box mb={2}>
            <FormLabel fontWeight="semibold">Name</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("name", e.target.value)}
              value={clientData.name}
              type="text"
            />
          </Box> */}
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Address</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) =>
                handleInputChange("address", e.target.value)
              } // Handle address change
              value={clientData.address}
              type="text"
            />
          </Box>
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Email</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) =>
                handleInputChange("email", e.target.value)
              } // Handle address change
              value={clientData.email}
              type="text"
            />
          </Box>
          {/* <Box mb={2}>
            <FormLabel fontWeight="semibold">Password</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("password", e.target.value)}
              type="password"
              value={clientData.password}
            />
          </Box> */}
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Contact</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              type="number"
              value={clientData.phoneNumber}
            />
          </Box>
          {/* <Box mb={2}>
            <FormLabel fontWeight="semibold">Role</FormLabel>
            <Select
              style={textStyles}
              onChange={(e) => handleInputChange("role", e.target.value)}
              placeholder="Select role"
              defaultValue={clientData.role}
            >
              <option value="admin">Admin</option>
              <option value="employee">Client</option>
            </Select>
          </Box> */}
          {/* <Box mb={2}>
            <FormLabel fontWeight="semibold">Designation</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("designation", e.target.value)}
              type="text"
              value={clientData.designation}
            />
          </Box> */}
          {/* <Box mb={2}>
            <FormLabel fontWeight="semibold">Department</FormLabel>
            <Select
              style={textStyles}
              onChange={(e) => handleInputChange("department", e.target.value)}
              placeholder="Select department"
              defaultValue={clientData.department}
            >
              <option value="management">Management</option>
              <option value="sales">Sales</option>
              <option value="development">Development</option>
              <option value="hr">HR</option>
            </Select>
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
          Edit Client
        </Button>
      </FormControl>
    </Box>
  );
};

export default EditClient;
