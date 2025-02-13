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
import { user } from "../../../../API/constants";
import { updateBiller } from "../../../../API/biller";

let userRole = '';
let userId = 0;

const currentUser = JSON.parse(localStorage.getItem("user"));

if (currentUser) {
  userRole = currentUser.role;
  userId = currentUser.userId;
}

const EditBiller = ({ handleAddUpdateDeleteItem, onClose, selectedItem }) => {
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
  const [billerData, setBillerData] = useState(selectedItem);

  const handleInputChange = (field, value) => {
    setBillerData({ ...billerData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      billerData.phoneNumber = parseInt(billerData.phoneNumber);
      billerData.fname = billerData.name;
      billerData.userRole = userRole;
      setBtnLoading(true);
      const response = await updateBiller(billerData.userId, billerData);
      handleAddUpdateDeleteItem();

      toast({
        title: 'Biller Updated',
        description: 'Biller has been updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      if (user.userId == response.user.userId) {
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(response.user));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }

      setBtnLoading(false);
    } catch (error) {
      console.error('Error adding Biller', error);
      toast({
        title: 'Error updating Biller',
        description: 'There is an error updating the Biller, please try again later.',
        status: 'error',
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
              value={billerData.userName}
              type="text"
            />
          </Box>
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Address</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("address", e.target.value)}
              value={billerData.address}
              type="text"
            />
          </Box>
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Email</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("email", e.target.value)}
              value={billerData.email}
              type="text"
            />
          </Box>
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Contact</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              type="number"
              value={billerData.phoneNumber}
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
          Edit Biller
        </Button>
      </FormControl>
    </Box>
  );
};

export default EditBiller;
