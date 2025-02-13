import {
  Box,
  Text,
  Divider,
  Avatar,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  GridItem,
  Spacer,
  useDisclosure,
  Icon,
  Badge,
  Flex
} from "@chakra-ui/react";
import { MdEmail, MdPhone, MdBuild } from "react-icons/md";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../../API/constants";
import Drawers from "../../pages/biller/component/Drawers";

const BillerCard = ({ data = [], heading, onAddNew, onAssign, userRole }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [drawerType, setDrawerType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAllSkills, setShowAllSkills] = useState(false); // State for showing all skills

  const handleDrawerOpen = (type, item = null) => {
    setDrawerType(type);
    setSelectedItem(item);
    onOpen();
  };

  const toggleShowSkills = () => {
    setShowAllSkills(!showAllSkills);
  };

  return (
    <>
      <Box
        direction="column"
        bg="white"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="lg"
        p={6}
        shadow="md"
        align="left"
        transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
        _hover={{ transform: "scale(1.01)", boxShadow: "lg" }}
      >
        <SimpleGrid columns={2} justifyContent="space-between" mb={4}>
          <Text fontSize="xl" fontWeight="semibold" mb={2} align={"left"}>
            {heading}
          </Text>
          <GridItem colSpan={1 / 3} style={{ justifySelf: "end" }}>
            <Link to={`/billers`}>
              <Button variant="solid" colorScheme="whatsapp" color={"white"} size={{ base: "sm" }}
                px={2}
                py={3}
              >
                View All
              </Button>
            </Link>
          </GridItem>
        </SimpleGrid>
        <Divider borderColor="gray.300" mb={4} />
        {data.length > 0 ? (
          data.slice(0, 5).map((item, index) => (
            <Box key={index} mb={4}>
              <HStack mb={4}>
                <Avatar
                  size="md"
                  name={item.userName}
                  src={`${BASE_URL}/uploads/profile/${item.profilePicture}`}
                  mb={2}
                />
                <VStack align="left" spacing={2.5} ml={5}>
                  <Text fontSize="md" fontWeight="bold" color={"green"}>
                    {item.userName}
                  </Text>
                  <HStack spacing={1}>
                    <Icon as={MdEmail} color="gray.500" />
                    <Text fontSize="sm" color="gray.500">
                      {item.email}
                    </Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Icon as={MdPhone} color="gray.500" />
                    <Text fontSize="sm" color="gray.500">
                      {item.phoneNumber}
                    </Text>
                  </HStack>
                  <HStack spacing={2} align="center">
                    <Icon as={MdBuild} color="gray.500" />
                    <Text fontSize="sm" color="gray.500" mr={2}>
                      Skills:
                    </Text>
                    <Flex
                      flexWrap="wrap"
                      gap={1}
                      maxWidth="100%"
                      overflowX="auto"
                    >
                      {(showAllSkills ? item.skills.split(',') : item.skills.split(',').slice(0, 5)).map((skill, index) => (
                        <Badge
                          key={index}
                          variant="solid"
                          colorScheme="whatsapp"
                          borderRadius="full"
                          px={2}
                          py={1}
                          minWidth="fit-content"
                        >
                          {skill.trim()}
                        </Badge>
                      ))}
                      {item.skills.split(',').length > 5 && (
                        <Button variant="link" colorScheme="whatsapp" onClick={toggleShowSkills} ml={1} size="sm">
                          {showAllSkills ? 'See Less' : 'See More...'}
                        </Button>
                      )}
                    </Flex>
                  </HStack>
                </VStack>
                <Spacer />
              </HStack>
            </Box>
          ))
        ) : (
          <Text color="gray.500">No data available</Text>
        )}
        {(onAddNew || onAssign) && (
          <SimpleGrid columns={2} spacing={4} mt={5}>
            {onAddNew && (
              <Button colorScheme="whatsapp"
                width="full"
                onClick={() => handleDrawerOpen("addNew")}
              >
                Add New Biller
              </Button>
            )}
            {onAssign && (
              <Link to="/jobs">
                <Button colorScheme="whatsapp" width="full" onClick={onAssign}>
                  Assign Clients
                </Button>
              </Link>
            )}
          </SimpleGrid>
        )}
      </Box>
      <Drawers
        isOpen={isOpen}
        onClose={onClose}
        drawerType={drawerType}
        data={selectedItem}
        handleAddUpdateDeleteItem={() => {
          console.log("Item added/updated/deleted");
        }}
      />
    </>
  );
};

export default BillerCard;
