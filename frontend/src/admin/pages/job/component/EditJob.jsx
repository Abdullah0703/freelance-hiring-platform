import React, { useState } from "react";
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
import { updateJob } from "../../../../API/job";

const EditJob = ({ handleAddUpdateDeleteItem, onClose, selectedItem }) => {
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
  const [jobData, setJobData] = useState(selectedItem);

  // Handler to update editable values
  const handleInputChange = (field, value) => {
    setJobData({ ...jobData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const response = await updateJob(jobData.jobId, jobData); // Assuming jobId is the primary key
      handleAddUpdateDeleteItem();
      console.log('Job updated successfully:', response);

      toast({
        title: 'Job Updated',
        description: 'Job has been updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });

      setBtnLoading(false);
    } catch (error) {
      console.error('Error updating Job', error);
      toast({
        title: 'Error updating Job',
        description: 'There is an error updating the Job, please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "top-right"
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
              value={jobData.title || ""}
              type="text"
            />
          </Box>
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Start Date</FormLabel>
            <Input
              type="date"
              style={textStyles}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              value={jobData.startDate || ""}
            />
          </Box>
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Payment Terms</FormLabel>
            <Select
              style={textStyles}
              onChange={(e) => handleInputChange("paymentTerms", e.target.value)}
              placeholder="Select Payment Terms"
              value={jobData.paymentTerms || ""}
            >
              <option value="HOURLY">Hourly</option>
              <option value="FIXED_PRICE">Fixed Price</option>
            </Select>
          </Box>
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Duration</FormLabel>
            <Select
              style={textStyles}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              placeholder="Select Duration"
              value={jobData.duration || ""}
            >
              <option value="TEMPORARY">Temporary</option>
              <option value="PERMANENT">Permanent</option>
            </Select>
          </Box>
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Required Skills</FormLabel>
            <Textarea
              style={textStyles}
              onChange={(e) => handleInputChange("skills", e.target.value)}
              value={jobData.skills || ""}
            />
          </Box>
          <Box mb={2}>
            <FormLabel fontWeight="semibold">Description</FormLabel>
            <Textarea
              style={textStyles}
              onChange={(e) => handleInputChange("description", e.target.value)}
              value={jobData.description || ""}
            />
          </Box>
          <Box>
            <FormLabel fontWeight="semibold">Budget</FormLabel>
            <Input
              style={textStyles}
              onChange={(e) => handleInputChange("budget", e.target.value)}
              type="number"
              min="0"
              step="0.01"
              value={jobData.budget}
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
          Edit Job
        </Button>
      </FormControl>
    </Box>
  );
};

export default EditJob;
