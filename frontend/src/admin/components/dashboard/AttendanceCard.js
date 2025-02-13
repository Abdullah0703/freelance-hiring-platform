import React from 'react';
import { Text, Flex, useColorModeValue, Icon } from "@chakra-ui/react";
import { FaInfoCircle, FaUser } from "react-icons/fa"; // Import all necessary icons

// Function to get the icon component based on the title
const getIconComponent = (title) => {
  switch (title) {
    case "Overview Section":
      return FaUser; // Use FaUser for "Overview Section"
    case "Assignment Management":
      return FaInfoCircle; // Use FaInfoCircle for "Assignment Management"
    default:
      return FaInfoCircle; // Default icon
  }
};

const AttendanceCard = ({ title, values, texts }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const IconComponent = getIconComponent(title); // Get icon component based on title

  return (
    <Flex
      direction="column"
      background={bgColor} // Use bgColor for background
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      px={9}
      py={7}
      shadow="lg"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="semibold">
          {title}
        </Text>
      </Flex>
      <Flex
        direction="row"
        wrap="wrap"
        gap={4}
        align="center"
        justify="space-around"
      >
        {values.map((value, index) => (
          <Flex
            key={index}
            direction="column"
            align="center"
            p="4"
            w={{ base: "100%", sm: "48%", md: "23%" }} // Adjust width based on screen size
            minW="250px" // Minimum width for items
            textAlign="center"
            background="rgba(255, 255, 255, 0.8)" // Optional background for better visibility
          >
            <Icon as={IconComponent} w={6} h={6} color="green.500" mb={2} />
            <Text fontWeight={100} fontSize="md">
              {texts[index]}
            </Text>
            <Text
              fontSize="lg"
              fontWeight="bold"
              color="black"
              pt="2"
            >
              {value}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default AttendanceCard;
