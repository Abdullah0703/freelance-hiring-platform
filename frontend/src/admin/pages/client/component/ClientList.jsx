import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiChevronLeft, BiChevronRight, BiSearch } from "react-icons/bi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { deleteClientById, getAllClients } from "../../../../API/client";
import DeleteAlert from "../../../../components/DeleteAlert";
import Loading from "../../../../components/Loading/Loading";
import Drawers from "./Drawers";
import { getAllJobs } from "../../../../API/job";


const role = localStorage.getItem("role");

const ClientList = () => {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDrawerType, setSelectedDrawerType] = useState("");
  const [selectedItemData, setSelectedItemData] = useState(null);
  const bgColor = useColorModeValue("white", "gray.700");
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clientName, setClientName] = useState("");
  const role = localStorage.getItem("role");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    const searchText = event.target.value?.toLowerCase();
    setSearchTerm(searchText);
  };

  const toast = useToast(); // Initialize useToast
  // const filteredItems = clients.filter(
  //   (item) =>
  //     (String(item.userName)?.toLowerCase().includes(searchTerm) ||
  //       String(item.address)?.toLowerCase().includes(searchTerm) ||
  //       String(item.email)?.toLowerCase().includes(searchTerm) ||
  //       String(item.phoneNumber)?.toLowerCase().includes(searchTerm) ||
  //       String(item.email)?.toLowerCase().includes(searchTerm)) &&
  //     (selectedDepartment === "" || item.department === selectedDepartment)
  // );
  const filteredItems = Array.isArray(clients) ? clients.filter(
    (item) =>
      (String(item.userName)?.toLowerCase().includes(searchTerm) ||
        String(item.address)?.toLowerCase().includes(searchTerm) ||
        String(item.email)?.toLowerCase().includes(searchTerm) ||
        String(item.phoneNumber)?.toLowerCase().includes(searchTerm)) &&
      (selectedDepartment === "" || item.department === selectedDepartment)
  ) : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);

  const openDrawer = (drawerType, itemData) => {
    setSelectedDrawerType(drawerType);
    setSelectedItemData(itemData);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDrawerType("");
    setSelectedItemData(null);
  };

  const handleDeleteClick = (item) => {
    setSelectedItemId(item.userId);
    setClientName(item.userName);
    setIsDeleteAlertOpen(true);
  };

  // Handler for department filter change
  // const handleDepartmentChange = (event) => {
  //   setSelectedDepartment(event.target.value);
  // };

  // Handle confirmation of item deletion
  const handleConfirmDelete = async () => {
    try {
      await deleteClientById(selectedItemId);
      fetchClients();
      toast({
        title: "Client Deleted",
        description: `All data for ${clientName} has been deleted.`,
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteAlertOpen(false);
    } catch (error) {
      // Display an error message using useToast
      toast({
        title: "Error",
        description: "Error deleting Client",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };
  // Fetch clients when the component mounts
  const fetchClients = async () => {
    try {
      if (role === "BILLER") {
        const clientData = await getAllJobs();
        const data = clientData.clients;
        console.log("Fetching assigned clients for biller: ", data);
        setClients(data);
        setIsLoading(false);
      } else if (role === "ADMIN") {
        const clientData = await getAllClients();
        console.log("clientData", clientData);
        setClients(clientData.clients);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      p={4}
      shadow="md"
      mx="auto"
    >
      <Flex align="center" mb={4} justify="space-between">
        <Flex align="center" w="50%">
          <InputGroup w="100%" size={"sm"}>
            <InputLeftElement
              pointerEvents="none"
              color="gray.400"
              fontSize="1.2em"
              ml={2}
            >
              <BiSearch />
            </InputLeftElement>
            <Input
              placeholder="Search by name, email, or contact"
              value={searchTerm}
              onChange={handleSearchChange}
              borderRadius="0.3rem"
              py={2}
              pl={10}
              pr={3}
              fontSize="md"
              mr={4}
              _placeholder={{ color: "gray.400" }}
            />
          </InputGroup>
        </Flex>
        {/* <Flex align="center">
          <Select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            placeholder="All Departments"
          >
            <option value="management">Management</option>
            <option value="sales">Sales</option>
            <option value="development">Development</option>
            <option value="hr">HR</option>
          </Select>
        </Flex> */}
        <Flex align="center">
          {role === "ADMIN" && (
            <ButtonGroup>
              <Button
                variant="solid"
                colorScheme="whatsapp"
                onClick={() => openDrawer("addNew")}
                size="md"
                color={"white"}
              >
                Create New Client
              </Button>
            </ButtonGroup>
          )}
        </Flex>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple" size={"md"}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Address</Th>
              <Th>Contact</Th>
              {role !== "BILLER" && (
                <>
                  <Th>Active Jobs</Th>
                  <Th>Posted Jobs</Th>
                </>
              )}
              {/* <Th>Duration</Th>
              <Th>Required Skills</Th>
              <Th>Status</Th> */}
              {role !== "BILLER" && (<Th>Actions</Th>)}
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((item) => (
              <Tr key={item.userId}>
                <Td>{item.userName}</Td>
                <Td>{item.email}</Td>
                <Td>{item.address}</Td>
                <Td>{item.phoneNumber}</Td>
                <Td>{item.activeJobsCount}</Td>
                <Td>{item.totalPostedJobsCount}</Td>
                {/* <Td>{item.duration}</Td>
                <Td>{item.skills}</Td>
                <Td>{<Badge colorScheme='green'>Success</Badge>}</Td> */}
                <Td>
                  {role !== "BILLER" && (
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<HiDotsVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<FiEdit />}
                          onClick={() => openDrawer("edit", item)}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          icon={<FiTrash2 />}
                          onClick={() => handleDeleteClick(item)}
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Flex justify="space-between" mt={4} align="center">
        <Box>
          <IconButton
            icon={<BiChevronLeft />}
            isDisabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            aria-label="Previous Page"
          />
          <IconButton
            icon={<BiChevronRight />}
            isDisabled={indexOfLastItem >= filteredItems.length}
            onClick={() => handlePageChange(currentPage + 1)}
            ml={2}
            aria-label="Next Page"
          />
        </Box>
        <Text fontSize="smaller">
          Page {currentPage} of {Math.ceil(filteredItems.length / itemsPerPage)}
        </Text>
      </Flex>
      <Drawers
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        drawerType={selectedDrawerType}
        data={selectedItemData}
        handleAddUpdateDeleteItem={fetchClients}
      />
      <DeleteAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        HeaderText={"Delete Client"}
        BodyText={`Are you sure you want to delete this ${clientName}?`}
      />
    </Box>
  );
};

export default ClientList;
