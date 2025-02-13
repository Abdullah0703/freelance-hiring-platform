import React, { useState } from 'react';
import { Card, Text, Box, Flex, Icon, Link } from '@chakra-ui/react';
import { FaBriefcase, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { FaClock } from "react-icons/fa6";
import Drawers from '../../../pages/job/component/Drawers';
import { useDisclosure } from "@chakra-ui/react";

// Map titles to their respective icons
const iconMap = {
  'Jobs Posted': FaBriefcase,
  'Jobs Completed': FaCheckCircle,
  'Jobs Aborted': FaTimesCircle,
  'Productivity': FaClock
};

const CardItem = ({ title, value, iconColor = "blue.500", linktext }) => {
  const [drawerType, setDrawerType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const IconComponent = iconMap[title];

  const handleLinkClick = (event) => {
    event.preventDefault(); // Prevent default anchor tag behavior

    if (linktext === "Add new Job") {
      setDrawerType("addNew");
      setSelectedItem(null); // or set specific item if needed
      onOpen();
    } else if (linktext === "Productivity") {
      window.location.href = "/support";
    }
    else {
      // Navigate to /jobs or other routes
      window.location.href = "/jobs"; // Replace with navigation logic if using React Router
    }
  };

  return (
    <>
      <Card p={4} bg="white" shadow="lg" borderRadius="lg" position="relative"
        transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out" // Smooth transition
        _hover={{ transform: "scale(1.03)", boxShadow: "lg" }} // Hover effect
      >
        <Flex align="center" mb={2}>
          <Icon as={IconComponent} w={6} h={6} color={iconColor} mr={3} />
          <Text fontSize="lg">{title}</Text>
        </Flex>
        <Text fontSize="2xl" fontWeight="bold">{value}</Text>
        <Link
          href="#"
          color="green"
          fontSize="sm"
          position="absolute"
          bottom={4}
          right={4}
          onClick={handleLinkClick}
        >
          {linktext}
        </Link>
      </Card>

      <Drawers
        isOpen={isOpen}
        onClose={onClose}
        drawerType={drawerType}
        data={selectedItem}
        handleAddUpdateDeleteItem={() => {
          // Callback function to handle add, update or delete
          console.log("Item added/updated/deleted");
        }}
      />
    </>
  );
};

export default CardItem;
