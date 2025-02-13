import {
  useDisclosure,
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
  Icon
} from "@chakra-ui/react";
import { MdEmail, MdPhone, MdWork, MdAssignmentInd } from "react-icons/md";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Drawers from "../../pages/client/component/Drawers";
import { BASE_URL } from "../../../API/constants";

const role = localStorage.getItem("role");

const ClientCard = ({ data = [], heading, onAddNew, onAssign }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [drawerType, setDrawerType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDrawerOpen = (type, item = null) => {
    setDrawerType(type);
    setSelectedItem(item);
    onOpen();
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
        transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out" // Smooth transition
        _hover={{ transform: "scale(1.01)", boxShadow: "lg" }} // Hover effect
      >
        <SimpleGrid columns={2} justifyContent="space-between" mb={4}>
          <Text fontSize="xl" fontWeight="semibold" mb={2} align={"left"}>
            {heading}
          </Text>
          <GridItem colSpan={1 / 3} style={{ justifySelf: "end" }}>
            <Link to={`/clients`}>
              <Button variant="solid" colorScheme="whatsapp" color={"white"} size={{ base: "sm" }} px={2} py={3}>
                View All
              </Button>
            </Link>
          </GridItem>
        </SimpleGrid>
        <Divider borderColor="gray.300" mb={4} />
        {data.length > 0 ? (
          data.slice(0, 5).map((item, index) => (
            <HStack key={index} mb={4}>
              <Avatar
                size="md"
                name={item.userName}
                src={`${BASE_URL}/uploads/profile/${item.profilePicture}`}
                mb={2}
              />
              <VStack align="left" spacing={1} ml={5}>
                <Text fontSize="md" fontWeight="bold" color={"green"}>
                  {item.userName}
                </Text>
                <HStack spacing={1.5}>
                  <Icon as={MdEmail} color="gray.500" />
                  <Text fontSize="sm" color="gray.500">
                    {item.email}
                  </Text>
                </HStack>
                <HStack spacing={1.5}>
                  <Icon as={MdPhone} color="gray.500" />
                  <Text fontSize="sm" color="gray.500">
                    {item.phoneNumber}
                  </Text>
                </HStack>
                {role !== "BILLER" && (
                  <>
                    <HStack spacing={1.5}>
                      <Icon as={MdWork} color="gray.500" />
                      <Text fontSize="sm" color="gray.500">
                        Active Jobs: {item.activeJobsCount}
                      </Text>
                    </HStack>
                    <HStack spacing={1.5}>
                      <Icon as={MdAssignmentInd} color="gray.500" />
                      <Text fontSize="sm" color="gray.500">
                        Jobs Posted: {item.totalPostedJobsCount}
                      </Text>
                    </HStack>
                  </>
                )}
              </VStack>
              <Spacer />
            </HStack>
          ))
        ) : (
          <Text color="gray.500">No data available</Text>
        )}
        {(onAddNew || onAssign) && (
          <SimpleGrid columns={2} spacing={4} mt={4}>
            {onAddNew && (
              <Button colorScheme="whatsapp" width="full" onClick={() => handleDrawerOpen("addNew")}>
                Add New Client
              </Button>
            )}
            {onAssign && (
              <Link to="/jobs">
                <Button colorScheme="whatsapp" width="full" onClick={onAssign}>
                  Assign Billers
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

export default ClientCard;
