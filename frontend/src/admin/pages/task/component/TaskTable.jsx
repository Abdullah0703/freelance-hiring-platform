import {
  Badge,
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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  BiSearch,
} from "react-icons/bi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { MdOutlinePersonAdd } from "react-icons/md";
import { deleteTask, updateTaskStatus } from "../../../../API/task";
import AssignTask from "../../../../components/AssignTask";
import DeleteAlert from "../../../../components/DeleteAlert";
import Loading from "../../../../components/Loading/Loading";
import StartTask from "../../../../components/StartTask";
import Drawers from "./Drawers";


let role = '';
let userId = 0;

const user = JSON.parse(localStorage.getItem("user"));


if (user) {
  role = user.role;
  userId = user.userId
}


const TaskTable = ({ tasks = [], fetchTasks, inProgress, pending, completed }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false);
  const [isStartTaskOpen, setIsStartTaskOpen] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDrawerType, setSelectedDrawerType] = useState("");
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullDescription, setFullDescription] = useState("");
  // Other state variables...

  const openModal = (description) => {
    console.log("Opening modal with description:", description);
    setFullDescription(description);
    setIsModalOpen(true);
  };


  const closeModal = () => {
    console.log("Closing modal");
    setIsModalOpen(false);
  };

  const toast = useToast();
  const getStatusColor = (status) => {
    switch (status) {
      case 'Not started':
        return 'cyan';
      case 'Assigned':
        return 'green';
      case 'Completed':
        return 'green';
      case 'Under review':
        return 'yellow';
      case 'Pending':
        return 'blue';
      default:
        return 'cyan'; // Default color for unknown status
    }
  };



  const filteredItems = tasks.filter(
    (item) =>
    (String(item.taskId)?.toLowerCase().includes(searchTerm) ||
      String(item.name)?.toLowerCase().includes(searchTerm) ||
      String(item.description)?.toLowerCase().includes(searchTerm) ||
      String(item.estimatedTime)?.toLowerCase().includes(searchTerm) ||
      String(item.deadline)?.toLowerCase().includes(searchTerm)) //&&
    // (selectedStatus === "" || item.status === selectedStatus)
  );
  const handleSearchChange = (event) => {
    const searchText = event.target.value?.toLowerCase();
    setSearchTerm(searchText);
  };


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
    setSelectedItemId(item.taskId);
    // setEmployeeName(item.name);
    setIsDeleteAlertOpen(true);
  };

  const handleStartClick = (item) => {
    setSelectedItemId(item.taskId);
    // setEmployeeName(item.name);
    setIsStartTaskOpen(true);
  };

  const handleAssignClick = (item) => {
    setSelectedItemId(item.taskId);
    // setEmployeeName(item.name);
    setIsAssignTaskOpen(true);
  };

  const handleAssignTask = async () => {
    try {
      await deleteTask(selectedItemId);
      fetchTasks();
      toast({
        title: "Task Deleted",
        description: `All data for this task has been deleted.`,
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error("Error deleting Task:", error);

      // Display an error message using useToast
      toast({
        title: "Error",
        description: "Error deleting Task",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };


  const handleConfirmDelete = async () => {
    try {
      await deleteTask(selectedItemId);
      fetchTasks();
      toast({
        title: "Task Deleted",
        description: `All data for this task has been deleted.`,
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error("Error deleting Task:", error);

      // Display an error message using useToast
      toast({
        title: "Error",
        description: "Error deleting Task",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  const handleStartTask = async () => {
    try {
      let newStatus = inProgress ? 'Completed' : 'Started';
      await updateTaskStatus(selectedItemId, newStatus);
      fetchTasks();
      toast({
        title: "Task Started",
        description: `This task has been started`,
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      setIsStartTaskOpen(false);
    } catch (error) {
      console.error("Error starting Task:", error);

      // Display an error message using useToast
      toast({
        title: "Error",
        description: "Error starting Task",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  if (!tasks) {
    return <Loading />;
  }
  return (
    <>
      <Box bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        p={4}
        shadow="lg"
        mx="auto">
        <Box
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
                  placeholder="Search by name of the Employee"
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
            {role === 'admin' && (
              <Flex align="center">
                <ButtonGroup>
                  <Button
                    variant="solid"
                    colorScheme="whatsapp"
                    onClick={() => openDrawer("addNew")}
                    size="sm"
                    color={'white'}
                  >
                    New Task
                  </Button>
                </ButtonGroup>
              </Flex>
            )}

          </Flex>
          <TableContainer >

            <Table variant="simple" size={'md'}>
              <Thead>
                <Tr>
                  <Th>Task #</Th>
                  <Th>Name</Th>
                  <Th>Description</Th>
                  <Th>Estimated Time</Th>
                  <Th>Deadline</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentItems?.map((item, index) => (
                  <Tr>
                    <Td>{item.taskId}</Td>
                    <Td>{item.name}</Td>
                    <Td maxW="275px" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                      <span onClick={() => openModal(item.description)} style={{ cursor: "pointer" }}>
                        {item.description}
                      </span>
                    </Td>

                    <Td>
                      <Badge variant="outline" colorScheme='green'>
                        {item.estimatedTime} Hours
                      </Badge>
                    </Td>
                    <Td>{item.deadline}</Td>
                    <Td>
                      <Badge variant="subtle" colorScheme={getStatusColor(item.status)} px={2}>
                        {item.status}
                      </Badge>
                    </Td>

                    {/* <Td>
                      <Button
                        size="xs"
                        colorScheme="purple"
                        as={Link}
                        to="/process"
                        state={{ taskId: item.taskId, id: item.id }}
                      >
                        Process
                      </Button>
                    </Td> */}
                    <Td>
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
                            onClick={() => openDrawer("show", item)}
                          >
                            Show
                          </MenuItem>
                          {role === 'admin' && !completed && (
                            <MenuItem
                              icon={<FiEdit />}
                              onClick={() => openDrawer("edit", item)}
                            >
                              Edit
                            </MenuItem>
                          )}
                          {role === 'admin' && !completed && (
                            <MenuItem
                              icon={<MdOutlinePersonAdd />}
                              onClick={() => handleAssignClick(item)}
                            >
                              Assign
                            </MenuItem>
                          )}
                          {role !== 'admin' && !completed && (
                            <MenuItem
                              icon={<MdOutlinePersonAdd />}
                              onClick={() => handleStartClick(item)}
                            >
                              {inProgress ? "Complete" : "Start"}
                            </MenuItem>
                          )}

                          {role === 'admin' && (
                            <MenuItem
                              icon={<FiTrash2 />}
                              onClick={() => handleDeleteClick(item)}
                            >
                              Delete
                            </MenuItem>
                          )}
                        </MenuList>

                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

        </Box>

        <Drawers
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          drawerType={selectedDrawerType}
          data={selectedItemData}
          handleAddUpdateDeleteItem={fetchTasks}
          role={role}
        />

        <DeleteAlert
          isOpen={isDeleteAlertOpen}
          onClose={() => setIsDeleteAlertOpen(false)}
          onConfirmDelete={handleConfirmDelete}
          HeaderText={"Delete Employee"}
          BodyText={`Are you sure you want to delete this ?`}
        />
        <AssignTask
          isOpen={isAssignTaskOpen}
          onClose={() => setIsAssignTaskOpen(false)}
          HeaderText={"Assign Task to employee"}
          BodyText={`Are you sure you want to assign this task`}
          taskId={selectedItemId}
          fetchTasks={fetchTasks}
        />
        <StartTask
          isOpen={isStartTaskOpen}
          onClose={() => setIsStartTaskOpen(false)}
          onConfirmStart={handleStartTask}
          pending={pending}
          inProgress={inProgress}
          
        />
      </Box >


      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Full Description</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>{fullDescription}</p>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="whatsapp" mr={3} onClick={closeModal} color={'white'}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default TaskTable;
