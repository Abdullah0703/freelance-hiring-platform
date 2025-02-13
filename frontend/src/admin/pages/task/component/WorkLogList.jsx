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
import { deleteWorkLog, getAllWorkLogs, getWorkLogsByBillerId, getWorkLogsByClientId } from "../../../../API/worklog"; // Ensure correct import
import DeleteAlert from "../../../../components/DeleteAlert";

import Loading from "../../../../components/Loading/Loading";
import Drawers from "./Drawers";

const role = localStorage.getItem("role");
const user = localStorage.getItem("user");

const WorkLogList = () => {
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
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Initialize as true
    const [taskDescription, setTaskDescription] = useState("");
    const [taskDate, setTaskDate] = useState("");
    const [hoursLog, setHoursLog] = useState(0);
    const role = localStorage.getItem("role")
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearchChange = (event) => {
        const searchText = event.target.value?.toLowerCase();
        setSearchTerm(searchText);
    };

    const toast = useToast();
    const filteredItems = tasks.filter(
        (item) =>
            (String(item.taskDescription)?.toLowerCase().includes(searchTerm))
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
        setSelectedItemId(item.workLogId);
        setTaskDescription(item.taskDescription);
        setIsDeleteAlertOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteWorkLog(selectedItemId);
            fetchTasks();
            toast({
                title: "Work Log Deleted",
                description: `All data for ${taskDescription} has been deleted.`,
                status: "success",
                position: "top-right",
                duration: 3000,
                isClosable: true,
            });
            setIsDeleteAlertOpen(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Error deleting Work Log",
                status: "error",
                duration: 3000,
                position: "top-right",
                isClosable: true,
            });
        }
    };

    const fetchTasks = async () => {
        try {
            if (role === "BILLER") {
                const response = await getWorkLogsByBillerId();
                console.log("worklog fetched for biller:", response.workLogs)
                setTasks(response.workLogs);
            } else if (role === "CLIENT") {
                const response = await getWorkLogsByClientId();
                console.log("worklog fetched for clients: ", response)
                setTasks(response.workLogs)
            }
            else {
                toast({
                    title: "Error",
                    description: "Error fetching work logs",
                    status: "error",
                    duration: 3000,
                    position: "top-right",
                    isClosable: true,
                });
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching worklogs:", error);
            toast({
                title: "Error",
                description: "Error fetching work logs",
                status: "error",
                duration: 3000,
                position: "top-right",
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        fetchTasks();
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
                            placeholder="Search by description"
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
                <Flex align="center">
                    {role === "BILLER" && (
                        <ButtonGroup>
                            <Button
                                variant="solid"
                                colorScheme="whatsapp"
                                onClick={() => openDrawer("addNew")}
                                size="md"
                                color={"white"}
                            >
                                Create New Work Log
                            </Button>
                        </ButtonGroup>
                    )}
                </Flex>
            </Flex>

            <Box overflowX="auto">
                <Table variant="simple" size={"md"}>
                    <Thead>
                        <Tr>
                            <Th>Description</Th>
                            <Th>Date</Th>
                            <Th>Hours Log</Th>
                            {role === "BILLER" && (<Th>Actions</Th>)}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {currentItems.map((item) => (
                            <Tr key={item.workLogId}>
                                <Td>{item.taskDescription}</Td>
                                <Td>{item.date}</Td>
                                <Td>{item.hoursLog}</Td>
                                <Td>
                                    {role === "BILLER" && (
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
                handleAddUpdateDeleteItem={fetchTasks}
            />
            <DeleteAlert
                isOpen={isDeleteAlertOpen}
                onClose={() => setIsDeleteAlertOpen(false)}
                onConfirmDelete={handleConfirmDelete}
                HeaderText={"Delete Work Log"}
                BodyText={`Are you sure you want to delete the work log: ${taskDescription}?`}
            />
        </Box>
    );
};

export default WorkLogList;
