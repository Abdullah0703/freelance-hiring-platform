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
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    useToast,
    Badge,
    SimpleGrid,
    Center,
    Icon
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
    BiChevronLeft,
    BiChevronRight,
    BiSearch,
} from "react-icons/bi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IoTicketOutline } from "react-icons/io5";
import { HiDotsVertical } from "react-icons/hi";
import DeleteAlert from '../../../../components/DeleteAlert';
import Loading from '../../../../components/Loading/Loading';
import Drawers from "./Drawers";
import { deleteTicket, editTicket, getAllTickets, getClientTickets, markResolvedByAdmin, markResolvedByClient } from '../../../../API/ticket'; // Adjust the import path
import { useEffect } from "react";




const SupportList = () => {
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
    const [raisedTickets, setRaisedTickets] = useState(0);
    const [resolvedTickets, setResolvedTickets] = useState(0);
    const [unresolvedTickets, setUnresolvedTickets] = useState(0);
    const [headertext, setHeaderText] = useState();
    const [bodytext, setBodyText] = useState();
    // const [Tk,setTK]=useState(null);

    const [tickets, setTickets] = useState([
        // { ticketId: 1, issue: "Broken screen", jobId: 101, title:"Job-101", status: "Resolved" },
        // { ticketId: 2, issue: "Battery not charging", jobId: 102, title:"Job-102", status: "Unresolved" },
        // { ticketId: 3, issue: "Overheating issues", jobId: 103, title:"Job-103", status: "Resolved" },
        // { ticketId: 4, issue: "Noisy fan", jobId: 104, title:"Job-104", status: "Unresolved" },
        // { ticketId: 5, issue: "Wi-Fi connectivity issues", jobId: 105, title:"Job-105", status: "Resolved" },
        // Add more hardcoded tickets here if needed
    ]);
    const [isLoading, setIsLoading] = useState(false); // Set to false as we're using hardcoded data
    const [selectedJob, setSelectedJob] = useState("");
    const role = localStorage.getItem("role");

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearchChange = (event) => {
        const searchText = event.target.value?.toLowerCase();
        setSearchTerm(searchText);
    };

    const toast = useToast(); // Initialize useToast
    const filteredItems = tickets.filter(
        (item) =>
        (String(item.ticketId)?.toLowerCase().includes(searchTerm) ||
            String(item.jobId)?.toLowerCase().includes(searchTerm))
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);
    console.log(currentItems)
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
        setSelectedItemId(item.ticketId);
        setHeaderText('Confirm Delete');
        setBodyText(`Are you sure you want to delete the ticket with ID ${item.ticketId}?`);
        setIsDeleteAlertOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteTicket(selectedItemId);
            fetchTickets();
            toast({
                title: "Ticket Deleted",
                description: `Ticket with ID ${selectedItemId} has been deleted.`,
                status: "success",
                position: "top-right",
                duration: 3000,
                isClosable: true,
            });
            setIsDeleteAlertOpen(false); // Close the alert after deletion
        } catch (error) {
            console.error("Error deleting ticket:", error);
            toast({
                title: "Error",
                description: "Error deleting ticket",
                status: "error",
                duration: 3000,
                position: "top-right",
                isClosable: true,
            });
            setIsDeleteAlertOpen(false); // Close the alert after deletion
        }
    };




    const fetchTickets = async () => {

        try {
            setIsLoading(true);
            if (role === 'ADMIN') {
                console.log("taking data from admin")
                const ticketData = await getAllTickets();
                setTickets(ticketData.tickets);
                setRaisedTickets(ticketData.raisedTickets)
                setResolvedTickets(ticketData.resolvedTickets)
                setUnresolvedTickets(ticketData.unresolvedTickets)

            } else if (role == "CLIENT") {
                console.log("taking data from Client")
                const userString = localStorage.getItem("user");
                const user = userString ? JSON.parse(userString) : null;
                const ticketData = await getClientTickets(user.userId);
                setTickets(ticketData.tickets);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };
    const TicketResolve = async (ticketId) => {

        try {
            console.log(ticketId)
            setIsLoading(true);
            if (role === 'ADMIN') {
                console.log("Resolving from admin")
                const ticketData = await markResolvedByAdmin(ticketId)


            } else if (role == "CLIENT") {
                console.log("Resolving from client")
                const ticketData = await markResolvedByClient(ticketId)
            }
            fetchTickets();
            setIsLoading(false);
        } catch (error) {
            console.error("Error resolving ticket:", error);
            setIsLoading(false);
        }
    }
    const handleEditTicket = async (ticketId, updatedData) => {
        try {
            console.log("edit ticket id:", ticketId)
            const result = await editTicket(ticketId, updatedData);
            console.log('Ticket updated successfully:', result);
            fetchTickets()
            // Perform any additional actions, such as refreshing data or showing a success message
            toast({
                title: "Ticket Edited",
                description: `Ticket with ID ${ticketId} has been edited.`,
                status: "success",
                position: "top-right",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error updating ticket:', error);
            toast({
                title: "Error",
                description: "Error updating ticket",
                status: "error",
                duration: 3000,
                position: "top-right",
                isClosable: true,
            });
        }
    };
    useEffect(() => {
        fetchTickets();
    }, []);

    if (isLoading) {
        return (<Loading />);
    }
    console.log("This is data:", tickets['Job.description'])
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
                            placeholder="Search by ticket ID or Job Id"
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
            </Flex>
            {/* Collected Fees Stat */}
            {role == "ADMIN" && <Box
                bg={bgColor}
                mb={1}
            >
                <Flex
                    wrap="wrap"
                    spacing={4}
                    justify="space-between"
                    align="center"
                >
                    <Box
                        p={4}
                        borderWidth="1px"
                        borderColor={borderColor}
                        borderRadius="lg"
                        shadow="md"
                        flex="1 1 30%"
                        m={2}
                    >
                        <Stat>
                            <Flex align="center">
                                <Icon as={IoTicketOutline} boxSize={8} mr={4} />
                                <Box>
                                    <StatLabel>Raised Tickets</StatLabel>
                                    <StatNumber>{raisedTickets}</StatNumber>
                                </Box>
                            </Flex>
                        </Stat>
                    </Box>
                    <Box
                        p={4}
                        borderWidth="1px"
                        borderColor={borderColor}
                        borderRadius="lg"
                        shadow="md"
                        flex="1 1 30%"
                        m={2}
                    >
                        <Stat>
                            <Flex align="center">
                                <Icon as={IoTicketOutline} boxSize={8} mr={4} />
                                <Box>
                                    <StatLabel>Resolved Tickets</StatLabel>
                                    <StatNumber>{resolvedTickets}</StatNumber>
                                </Box>
                            </Flex>
                        </Stat>
                    </Box>
                    <Box
                        p={4}
                        borderWidth="1px"
                        borderColor={borderColor}
                        borderRadius="lg"
                        shadow="md"
                        flex="1 1 30%"
                        m={2}
                    >
                        <Stat>
                            <Flex align="center">
                                <Icon as={IoTicketOutline} boxSize={8} mr={4} />
                                <Box>
                                    <StatLabel>Unresolved Tickets</StatLabel>
                                    <StatNumber>{unresolvedTickets}</StatNumber>
                                </Box>
                            </Flex>
                        </Stat>
                    </Box>
                </Flex>
            </Box>}
            <Box overflowX="auto">
                <Table variant="simple" size={"md"}>
                    <Thead>
                        <Tr>
                            <Th>Ticket ID</Th>
                            <Th>Job ID</Th>
                            <Th>Title</Th>

                            <Th>Status</Th>
                            {role == "ADMIN" && (<Th>Detete Status</Th>)}
                            {role !== "BILLER" && (<Th>Actions</Th>)}
                          
                        </Tr>
                    </Thead>
                    <Tbody>
                        {currentItems.map((item) => (

                            <Tr key={item.ticketId}>
                                <Td>{item.ticketId}</Td>
                                <Td>{item.jobId}</Td>
                                <Td>{item['Job.title']}</Td>

                                <Td>
                                    <Badge
                                        borderRadius="md"
                                        colorScheme={
                                            item.actionByAdmin === "resolved" && item.actionByClient === "resolved"
                                                ? "green"
                                                : item.actionByAdmin === "resolved" || item.actionByClient === "resolved"
                                                    ? "yellow"
                                                    : "red"
                                        }
                                    >
                                        {item.actionByAdmin === "resolved" && item.actionByClient === "resolved"
                                            ? "Resolved"
                                            : item.actionByAdmin === "resolved"
                                                ? "Resolved by Admin"
                                                : item.actionByClient === "resolved"
                                                    ? "Resolved by Client"
                                                    : "Pending"}
                                    </Badge>

                                </Td>
                                
                                {role == "ADMIN" && <Td>{(item.deletedAt?"Deleted":"Not Deleted")}</Td>}
                              
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
                                                {role !== "ADMIN" && (
                                                    <MenuItem
                                                        icon={<FiEdit />}
                                                        onClick={() => openDrawer("edit", item)}
                                                    >
                                                        Edit
                                                    </MenuItem>
                                                )}
                                                <MenuItem
                                                    icon={<FiEdit />}
                                                    onClick={() => openDrawer("show", item)}
                                                >

                                                    Show
                                                </MenuItem>
                                                {role == "CLIENT" && <MenuItem
                                                    icon={<FiTrash2 />}
                                                    onClick={() => handleDeleteClick(item)}
                                                >
                                                    Delete
                                                </MenuItem>}
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
            <DeleteAlert
                isOpen={isDeleteAlertOpen}
                onClose={() => setIsDeleteAlertOpen(false)}
                onConfirmDelete={handleConfirmDelete}
                HeaderText={headertext}
                BodyText={bodytext}
            />
            <Drawers
                isOpen={isDrawerOpen}
                onClose={closeDrawer}
                drawerType={selectedDrawerType}
                itemData={selectedItemData}
                setSelectedJob={setSelectedJob}
                selectedJob={selectedJob}
                handleResolve={TicketResolve}
                editTicket={handleEditTicket}
            />
        </Box>
    );
};

export default SupportList;
