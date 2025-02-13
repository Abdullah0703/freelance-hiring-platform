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
import {
  BiChevronLeft,
  BiChevronRight,
  BiSearch,
} from "react-icons/bi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { deleteBillerById, getAllBiller } from "../../../../API/biller";
import DeleteAlert from '../../../../components/DeleteAlert';
import Loading from '../../../../components/Loading/Loading';
import Drawers from "./Drawers";
import { useNavigate } from 'react-router-dom';
import { getAllJobs } from "../../../../API/job";



const BillerList = () => {
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
  const [billers, setBillers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeName, setEmployeeName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const role = localStorage.getItem("role");
  const toast = useToast();
  const navigate = useNavigate();

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    const searchText = event.target.value?.toLowerCase();
    setSearchTerm(searchText);
  };

  const filteredItems = billers.filter(
    (item) =>
      (String(item.userId)?.toLowerCase().includes(searchTerm) ||
        String(item.userName)?.toLowerCase().includes(searchTerm) ||
        String(item.address)?.toLowerCase().includes(searchTerm) ||
        String(item.phoneNumber)?.toLowerCase().includes(searchTerm) ||
        String(item.email)?.toLowerCase().includes(searchTerm)) &&
      (selectedDepartment === "" || item.department === selectedDepartment)
  );

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
    setEmployeeName(item.userName);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBillerById(selectedItemId);
      fetchBillers();
      toast({
        title: "Biller Deleted",
        description: `All data for ${employeeName} has been deleted.`,
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error("Error deleting Biller:", error);
      toast({
        title: "Error",
        description: "Error deleting Biller",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  const fetchBillers = async () => {
    try {
      if (role === "CLIENT") {
        const jobData = await getAllJobs();
        const jobs = jobData.jobs;
        const assignedBillers = [];
        jobs.forEach((job) => {
          if (job.billers && job.billers.length > 0) {
            assignedBillers.push(...job.billers);
          }
        });
        // Remove duplicates based on userId
        const uniqueBillers = Array.from(
          new Map(assignedBillers.map(biller => [biller.userId, biller])).values()
        );
        console.log("Assigned Billers: ", uniqueBillers);
        setBillers(uniqueBillers);
        setIsLoading(false);
      }
      else {
        const billerData = await getAllBiller();
        console.log("billerData", billerData)
        setBillers(billerData.billers);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching billers:", error);
    }
  };

  useEffect(() => {
    fetchBillers();
  }, []);

  if (isLoading) {
    return (<Loading />)
  }

    const handleViewProfile = (userId) => {
      console.log('Biller details before finding:', billers);
      console.log('User ID passed:', userId);

      const selectedBiller = billers.find(biller => biller.userId === userId);

      if (selectedBiller) {
        console.log('Selected biller:', selectedBiller);
        navigate('/billerprofile', {
          state: {
            biller: selectedBiller,
            userId: userId // Include userId in the state
          }
        });
        console.log("Navigate function called");
      } else {
        console.error('No biller found for userId:', userId);
      }
    };

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
              placeholder="Search by name, email or contact"
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
        {role !== "CLIENT" && (
          <Flex align="center">
            <ButtonGroup>
              <Button
                variant="solid"
                colorScheme="whatsapp"
                onClick={() => openDrawer("addNew")}
                size="md"
                color={'white'}
              >
                New Biller
              </Button>
            </ButtonGroup>
          </Flex>
        )}
      </Flex>
      <Box overflowX="auto">
        <Table variant="simple" size={"md"}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Address</Th>
              <Th>Contact</Th>
              <Th>Email</Th>
              {role !== "CLIENT" && (<Th>Actions</Th>)}
            </Tr>
          </Thead>
          <Tbody>
            {billers && billers.length > 0 ? (
              billers.map((biller, index) => (
                <Tr key={index}>
                  <Td>
                    <Button
                      variant="link"
                      colorScheme="black"
                      onClick={() => handleViewProfile(biller.userId)}
                      fontWeight="normal"    // Ensures the text is not bold
                      textDecoration="none"  // Removes the underline
                      _hover={{ textDecoration: "none" }} // Removes underline on hover
                    >
                      {biller.userName}
                    </Button>
                  </Td>
                  <Td>{biller.address}</Td>
                  <Td>{biller.phoneNumber}</Td>
                  <Td>{biller.email || "N/A"}</Td>
                  <Td>
                    {role !== "CLIENT" && (
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<HiDotsVertical />}
                          variant="ghost"
                        />
                        <MenuList>
                          <MenuItem
                            icon={<FiEdit />}
                            onClick={() => {
                              setSelectedItemData(biller);
                              setSelectedDrawerType("edit");
                              setIsDrawerOpen(true);
                            }}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem
                            icon={<FiTrash2 />}
                            onClick={() => handleDeleteClick(biller)}
                          >
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    )}
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={4} textAlign="center">
                  No Billers Available.
                </Td>
              </Tr>
            )}
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
      {role !== "CLIENT" && (
        <>
          <Drawers
            isOpen={isDrawerOpen}
            onClose={closeDrawer}
            drawerType={selectedDrawerType}
            data={selectedItemData}
            handleAddUpdateDeleteItem={fetchBillers}
          />
          <DeleteAlert
            isOpen={isDeleteAlertOpen}
            onClose={() => setIsDeleteAlertOpen(false)}
            onConfirmDelete={handleConfirmDelete}
            HeaderText={"Delete Biller"}
            BodyText={`Are you sure you want to delete this ${employeeName}?`}
          />
        </>
      )}
    </Box >
  );
};

export default BillerList;
