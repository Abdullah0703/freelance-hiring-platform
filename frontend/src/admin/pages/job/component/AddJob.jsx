import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  useColorModeValue,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import { createJob } from "../../../../API/job";

const user = JSON.parse(localStorage.getItem("user"));

const AddJob = ({ handleAddUpdateDeleteItem, onClose }) => {
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
  const [jobData, setJobData] = useState({
    title: "",
    startDate: "",
    paymentTerms: "",
    duration: "",
    skills: "",
    description: "",
    budget: "", // Add budget field
  });

  // Handler to update editable values
  const handleInputChange = (field, value) => {
    setJobData({ ...jobData, [field]: value });
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setJobData((prevData) => ({ ...prevData, startDate: today }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    // Validate budget
    if (parseFloat(jobData.budget) < 0) {
      toast({
        title: "Invalid Budget",
        description: "Budget cannot be a negative number.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return; 
    }
    try {
      setBtnLoading(true);
      const updatedJobData = { ...jobData, clientId: user.userId }; // Add userId to jobData
      console.log("jobData", updatedJobData);

      const response = await createJob(updatedJobData);
      handleAddUpdateDeleteItem();
      console.log("Job added successfully:", response);

      // Show a success toast
      toast({
        title: "Job Added",
        description: "Job has been added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setBtnLoading(false);
    } catch (error) {
      console.error("Error adding Job", error);
      toast({
        title: "Error adding Job",
        description: "There is an error adding the Job, please try again later.",
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
            <FormLabel fontWeight="semibold">Title</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("title", e.target.value)}
              type="text"
            />
          </Box>
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Start Date</FormLabel>
            <Input type="date" style={textStyles} value={jobData.startDate} readOnly />
          </Box>
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Required Skills</FormLabel>
            <Textarea
              style={textStyles}
              onChange={(e) => handleInputChange("skills", e.target.value)}
              type="text"
            />
          </Box>
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Description</FormLabel>
            <Textarea
              style={textStyles}
              onChange={(e) => handleInputChange("description", e.target.value)}
              type="text"
            />
          </Box>
        </SimpleGrid>
        {/* Group these fields on the same line */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={4}>
          <Box>
            <FormLabel fontWeight="semibold">Payment Terms</FormLabel>
            <Select
              style={textStyles}
              onChange={(e) => handleInputChange("paymentTerms", e.target.value)}
              placeholder="Select Payment Terms"
            >
              <option value="HOURLY">Hourly</option>
              <option value="FIXED_PRICE">Fixed Price</option>
            </Select>
          </Box>
          <Box>
            <FormLabel fontWeight="semibold">Duration</FormLabel>
            <Select
              style={textStyles}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              placeholder="Select Duration"
            >
              <option value="TEMPORARY">Temporary</option>
              <option value="PERMANENT">Permanent</option>
            </Select>
          </Box>
          <Box>
            <FormLabel fontWeight="semibold">Budget</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("budget", e.target.value)}
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter budget amount($)"
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
          Add Job
        </Button>
      </FormControl>
    </Box>
  );
};

export default AddJob;
