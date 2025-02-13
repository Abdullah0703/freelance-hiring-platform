import React from "react";
import {
  Box,
  Text,
  Divider,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  GridItem,
  Select,
  Input,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { MdAssignment, MdAdd, MdCalendarToday, MdCheckCircle } from "react-icons/md";
const AssignmentManagementCard = ({ assignmentsData, heading }) => {
  const gradientBg = useColorModeValue(
    'linear-gradient(to bottom right, #e0f2f1, #b2dfdb)',
    'linear-gradient(to bottom right, #1a202c, #2d3748)'
  );
  const inputBgColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box
      direction="column"
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      p={6}
      shadow="md"
      align="left"
    >
      <SimpleGrid columns={2} justifyContent="space-between" mb={4}>
        <Text fontSize="xl" fontWeight="semibold" mb={2} align={"left"}>
          {heading}
        </Text>
        <GridItem colSpan={1 / 3} style={{ justifySelf: "end" }}>
          <Button variant="solid" colorScheme="whatsapp" color={'white'} size={{ base: "sm" }}>
            View
          </Button>
        </GridItem>
      </SimpleGrid>
      <Divider borderColor="gray.300" mb={4} />

      {/* Current Assignments */}
      <Box bgGradient={gradientBg} p={4} borderRadius="md" mb={4}>
        <VStack align="left" spacing={4} mb={4}>
          <HStack spacing={2} mb={4}>
            <Icon as={MdAssignment} boxSize={6} color="teal.500" />
            <Text fontSize="lg" fontWeight="semibold">Current Assignments</Text>
          </HStack>
          {assignmentsData.currentAssignments.map((assignment, index) => (
            <HStack key={index} spacing={4}>
              <Text fontSize="sm">{assignment}</Text>
            </HStack>
          ))}
        </VStack>
      </Box>

      {/* New Assignments */}
      <Box bgGradient={gradientBg} p={4} borderRadius="md" mb={4}>
        <VStack align="left" spacing={4} mb={4}>
          <HStack spacing={2} mb={2}>
            <Icon as={MdAdd} boxSize={6} color="teal.500" />
            <Text fontSize="lg" fontWeight="semibold">New Assignments</Text>
          </HStack>
          <Button colorScheme="whatsapp" mb={2}>Create New Assignment</Button>
          <HStack spacing={2} mb={2}>
            <Text>Select Client:</Text>
            <Select placeholder="Select client" borderColor="gray.300" bg="white" borderRadius="md" boxShadow="sm">
              {/* Add client options here */}
            </Select>
          </HStack>
          <HStack spacing={2}>
            <Text>Select Biller:</Text>
            <Select placeholder="Select biller" borderColor="gray.300" bg="white" borderRadius="md" boxShadow="sm">
              {/* Add biller options here */}
            </Select>
          </HStack>
        </VStack>
      </Box>

      {/* Interview Scheduling */}
      <Box bgGradient={gradientBg} p={4} borderRadius="md" mb={4}>
        <VStack align="left" spacing={4} mb={2}>
          <HStack spacing={2} mb={2}>
            <Icon as={MdCalendarToday} boxSize={6} color="teal.500" />
            <Text fontSize="lg" fontWeight="semibold">Interview Scheduling</Text>
          </HStack>
          <Button colorScheme="whatsapp" mb={1}>Schedule Interview</Button>
          <HStack spacing={2} mb={2}>
            <Text>Select Client:</Text>
            <Select placeholder="Select client" borderColor="gray.300" bg={inputBgColor} borderRadius="md" boxShadow="sm">
              {/* Add client options here */}
            </Select>
          </HStack>
          <HStack spacing={2} mb={1}>
            <Text>Select Biller:</Text>
            <Select placeholder="Select biller" borderColor="gray.300" bg={inputBgColor} borderRadius="md" boxShadow="sm">
              {/* Add biller options here */}
            </Select>
          </HStack>
          <HStack spacing={4}>
            <Text>Date & Time:</Text>
            <Input type="date" borderColor="gray.300" bg={inputBgColor} borderRadius="md" boxShadow="sm" />
            <Input type="time" borderColor="gray.300" bg={inputBgColor} borderRadius="md" boxShadow="sm" />
          </HStack>
        </VStack>
      </Box>

      {/* Assignment Status */}
      <Box bgGradient={gradientBg} p={4} borderRadius="md">
        <VStack align="left" spacing={4}>
          <HStack spacing={2} mb={4}>
            <Icon as={MdCheckCircle} boxSize={6} color="teal.500" />
            <Text fontSize="lg" fontWeight="semibold">Assignment Status</Text>
          </HStack>
          {assignmentsData.assignmentStatus.map((status, index) => (
            <HStack key={index} spacing={2}>
              <Text fontSize="sm">{status}</Text>
            </HStack>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default AssignmentManagementCard;
