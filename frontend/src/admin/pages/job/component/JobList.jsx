import React, { useEffect, useState } from "react";

import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Checkbox, CheckboxGroup,
  Flex,
  FormControl,
  FormErrorMessage,
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
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
  HStack,
  Avatar,
  VStack, Icon,
  Divider, Link
} from "@chakra-ui/react";

import { BiChevronLeft, BiChevronRight, BiSearch, BiSupport } from "react-icons/bi";
import { FaTools, FaUser } from "react-icons/fa";
import { FiCalendar, FiCheck, FiEdit, FiMinusCircle, FiTrash2, FiUser } from "react-icons/fi";
import { HiClock, HiDotsVertical, HiLink } from 'react-icons/hi';
import { MdEmail } from "react-icons/md";
import { getAllBiller } from "../../../../API/biller";
import { deleteJobById, getAllJobs, updateJob } from "../../../../API/job";
import { createTicket } from "../../../../API/ticket";
import DeleteAlert from "../../../../components/DeleteAlert";
import Loading from "../../../../components/Loading/Loading";
import Drawers from "./Drawers";
import { BASE_URL } from "../../../../API/constants";

const role = localStorage.getItem("role");

const JobList = () => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [meetingLink, setMeetingLink] = useState("");
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
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [jobName, setJobName] = useState("");
  const [item, setItem] = useState("");
  const [billers, setBillers] = useState([]);
  const [selectedBillers, setSelectedBillers] = useState([]);
  const [isbillerloading, setisbillerloading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const toast = useToast(); // Initialize useToast
  const [supportIssue, setSupportIssue] = useState("");
  const [newStatus, setNewStatus] = useState(""); // State for new status
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [meetingLinkError, setMeetingLinkError] = useState(false);
  const [meetingTime, setmeetingTime] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [expandedSkills, setExpandedSkills] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const toggleDescription = (itemId) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };

  const handleSeeMoreClick = (userId) => {
    setExpandedSkills((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };
  const {
    isOpen: isSupportModalOpen,
    onOpen: onSupportModalOpen,
    onClose: onSupportModalClose
  } = useDisclosure();
  const {
    isOpen: isSearchCandidateModalOpen,
    onOpen: onSearchCandidateModalOpen,
    onClose: onSearchCandidateModalClose
  } = useDisclosure();
  const {
    isOpen: isMeetingDetailsModalOpen,
    onOpen: onMeetingDetailsModalOpen,
    onClose: onMeetingDetailsModalClose
  } = useDisclosure();
  const {
    isOpen: isAssignedBillerModalOpen,
    onOpen: onAssignedBillerModalOpen,
    onClose: onAssignedBillerModalClose
  } = useDisclosure();

  const statusColors = {
    AWAITING_CONFIRMATION: 'yellow',
    INITIAL_MEETING_SCHEDULED: 'purple',
    SEARCHING_CANDIDATE: 'yellow',
    INTERVIEW_SCHEDULED: 'teal',
    FINALIZED: 'green',
    ABORTED: 'red',
    COMPLETED: 'green'
  };
  const validateMeetingLink = (value) => {
    const regex = /^(http:\/\/|https:\/\/|www\.)/i;
    return regex.test(value);
  };

  const handleMeetingLinkChange = (e) => {
    const value = e.target.value;
    setMeetingLink(value);
    setMeetingLinkError(!validateMeetingLink(value));
  };
  const handleMeetingTimeChange = (e) => {
    setmeetingTime(e.target.value);
    // The value should be in HH:mm format
  };

  const [selectedDepartment, setSelectedDepartment] = useState("");
  //fetching billers here
  const fetchBillers = async () => {
    try {
      // Assuming there's an API endpoint to get billers
      setisbillerloading(true);
      const billerData = await getAllBiller();
      setBillers(billerData.billers);
      console.log("billers from fetchbillers function", billers);
    } catch (error) {
      console.error("Error fetching billers:", error);
    } finally {
      setisbillerloading(false);
    }
  };

  const handleBillerSelect = (userId) => {
    setSelectedBillers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter(billerId => billerId !== userId) // Deselect if already selected
        : [...prevSelected, userId] // Select if not already selected
    );
  };


  const handleRecommendBillers = async (item, selectedBillers) => {
    console.log("Received Selected Billers:", selectedBillers);
    setBtnLoading(true);
    // Check if any billers are selected
    if (!selectedBillers || selectedBillers.length === 0) {
      toast({
        title: "No Billers Selected",
        description: "No billers are selected for recommendation.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setBtnLoading(false); // Stop loading in case of error
      return; // Exit the function early
    }
    try {
      const updatedItem = {
        ...item,
        status: 'INTERVIEW_SCHEDULED',
        meetingLink: meetingLink,
        meetingTime: meetingTime,
        recommendedProfiles: JSON.stringify(selectedBillers),
      };

      console.log("Updating job with data:", updatedItem);
      await updateJob(item.jobId, updatedItem);
      console.log("Job updated successfully with data", updatedItem);
      await fetchJobs();

      toast({
        title: "Billers Recommended",
        description: "Billers have been recommended successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setBtnLoading(false);
      onClose();
    } catch (error) {
      console.error("Error recommending billers", error);
      toast({
        title: "Error",
        description: "There was an error recommending billers. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setBtnLoading(false);
      onClose();
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    const searchText = event.target.value?.toLowerCase();
    setSearchTerm(searchText);
  };

  const handleScheduleMeeting = async (item) => {
    setBtnLoading(true); // Start loading

    try {
      if (item.status === "INITIAL_MEETING_SCHEDULED") {
        const updatedItem = {
          ...item,
          status: "SEARCHING_CANDIDATE"
        };
        await updateJob(item.jobId, updatedItem);
        await fetchJobs();
        // Provide success feedback
        toast({
          title: "Status Updated",
          description: "The status has been updated to 'SEARCHING_CANDIDATE'.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } else if (item.status === "SEARCHING_CANDIDATE") {
        // Fetch billers if the status is already "SEARCHING_CANDIDATE"
        await fetchBillers();
      }

      // Set the item and open the modal to input the meeting link
      setItem(item);
      onOpen();

    } catch (error) {
      console.error("Error updating job status", error);
      // Provide error feedback
      toast({
        title: "Error",
        description: "There was an error updating the job status. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setBtnLoading(false); // Stop loading in both success and error cases
    }
  };

  const handleSaveMeeting = async (item) => {
    setBtnLoading(true); // Start loading

    try {
      // Validate required fields
      if (!meetingLink || !meetingTime) {
        toast({
          title: "Error",
          description: "Meeting link and meeting time are required.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setBtnLoading(false);
        return;
      }

      let updatedItem;
      if (item.status === "AWAITING_CONFIRMATION") {
        updatedItem = {
          ...item,
          meetingLink: meetingLink,
          meetingTime: meetingTime,
          status: "INITIAL_MEETING_SCHEDULED"
        };
        console.log("Updated item at awaiting confirmation", updatedItem);
      } else if (item.status === "INITIAL_MEETING_SCHEDULED") {
        updatedItem = {
          ...item,
          meetingLink: meetingLink,
          meetingTime: meetingTime,
          status: "SEARCHING_CANDIDATE",
          recommendedBillers: selectedBillers
        };
      } else {
        toast({
          title: "Error",
          description: "Unexpected status value.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setBtnLoading(false); // Stop loading in case of unexpected status
        return;
      }

      await updateJob(item.jobId, updatedItem);
      await fetchJobs();

      if (item.status === "AWAITING_CONFIRMATION") {
        toast({
          title: "Meeting Scheduled",
          description: "The status has been updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } else if (item.status === "INITIAL_MEETING_SCHEDULED") {
        toast({
          title: "Status Changed",
          description: "The status has been updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }

      onClose();
    } catch (error) {
      console.error("Error updating status", error);

      if (item.status === "AWAITING_CONFIRMATION") {
        toast({
          title: "Error Scheduling Meeting",
          description: "There was an error scheduling the meeting. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } else if (item.status === "INITIAL_MEETING_SCHEDULED") {
        toast({
          title: "Error Updating Status",
          description: "There was an error updating the status. Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
      onClose();
    } finally {
      setBtnLoading(false);
    }
  };

  const handleSupport = (item) => {
    setSelectedJob(item);
    onSupportModalOpen();
    console.log("Item data", item);
  };

  const handleSupportSubmit = async () => {
    if (!supportIssue.trim()) {
      toast({
        title: "No Issue Provided",
        description: "Please provide a description of the issue before submitting.",
        status: "error",
        duration: 2000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    if (selectedJob) {
      const supportMessage = `Job ID: ${selectedJob.jobId}, Job Name: ${selectedJob.title}, Issue: ${supportIssue}`;
      console.log("Support msg", supportMessage);

      setBtnLoading(true); // Start loading
      try {
        await createTicket({
          jobId: selectedJob.jobId,
          complaint: supportIssue,
        });

        toast({
          title: "Support Ticket Created",
          description: `A support ticket has been created for Job Title: ${selectedJob.title}.`,
          status: "success",
          duration: 2000,
          position: "top-right",
          isClosable: true,
        });

        setSupportIssue("");
        onSupportModalClose();
      } catch (error) {
        console.error("Error creating support ticket:", error);

        toast({
          title: "Error Creating Ticket",
          description: "There was an error creating the support ticket. Please try again later.",
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      } finally {
        setBtnLoading(false); // Stop loading in both success and error cases
      }
    } else {
      console.error("No job selected for support");
    }
  };

  const handleMeetingDetails = (item) => {
    setSelectedJob(item);
    onMeetingDetailsModalOpen();
    console.log("Item data", item);
  };
  const handleAssignedBillers = (item) => {
    setSelectedJob(item.billers);
    console.log("items in assinged biller: ", item);
    onAssignedBillerModalOpen();
    console.log("Assigned Biller Data", item.billers);
  }
  const handleStatusChange = (item, status, message) => {
    setSelectedJob(item);
    setNewStatus(status);
    setConfirmationMessage(message);
    onSearchCandidateModalOpen();
  };
  const handleStatusChangeSubmit = async () => {
    setBtnLoading(true); // Start loading

    try {
      if (!selectedJob) {
        throw new Error("No job selected");
      }

      const updatedItem = {
        ...selectedJob,
        status: newStatus,
        recommendedBillers: newStatus === "SEARCHING_CANDIDATE" ? selectedBillers : selectedJob.recommendedBillers, // only add billers if the status is "SEARCHING_CANDIDATE"
      };

      await updateJob(selectedJob.jobId, updatedItem);
      await fetchJobs();

      toast({
        title: `Status Updated to ${formatStatusTitle(newStatus)}`,
        description: "The status has been updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      onSearchCandidateModalClose();
    } catch (error) {
      console.error("Error updating status", error);

      toast({
        title: "Error Updating Status",
        description: "There was an error updating the status. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      onSearchCandidateModalClose();
    } finally {
      setBtnLoading(false); // Stop loading in both success and error cases
    }
  };

  const formatTimetoDisplay = (timeString) => {
    if (!timeString) return '';
    const [hours24, minutes] = timeString.split(':');
    let hours = parseInt(hours24, 10);
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    // Format hours and minutes with leading zeros
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  const formatStatusTitle = (status) => {
    return status
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  };
  const onSearchCandidateClick = (item) => {
    handleStatusChange(
      item,
      "SEARCHING_CANDIDATE",
      "Are you sure you want to change the status to Searching Candidate?"
    );
  };
  const onCompleteClick = (item) => {
    handleStatusChange(
      item,
      "COMPLETED",
      "Are you sure you want to mark this job as Completed?"
    );
  };
  const onAbortClick = (item) => {
    handleStatusChange(
      item,
      "ABORTED",
      "Are you sure you want to abort this job?"
    );
  };
  const onFinalizeClick = (item) => {
    handleStatusChange(
      item,
      "FINALIZED",
      "Are you sure you want to finalize this job?"
    );
  };

  const filteredItems = jobs.filter(
    (item) =>
      (String(item.title)?.toLowerCase().includes(searchTerm) ||
        String(item.description)?.toLowerCase().includes(searchTerm) ||
        String(item.address)?.toLowerCase().includes(searchTerm) ||
        String(item.phoneNumber)?.toLowerCase().includes(searchTerm) ||
        String(item.email)?.toLowerCase().includes(searchTerm)) &&
      (selectedDepartment === "" || item.department === selectedDepartment)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);

  const openDrawer = (drawerType, itemData) => {
    console.log("Opening drawer with type:", drawerType, "and data:", itemData);
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
    setSelectedItemId(item.jobId); //changed the userId var to jobId here
    setJobName(item.title);
    setIsDeleteAlertOpen(true);
  };

  // Handler for department filter change
  // const handleDepartmentChange = (event) => {
  //   setSelectedDepartment(event.target.value);
  // };

  // Handle confirmation of item deletion
  const handleConfirmDelete = async () => {
    setBtnLoading(true); // Start loading

    try {
      await deleteJobById(selectedItemId);
      await fetchJobs(); // Ensure jobs are refetched to reflect the deletion
      toast({
        title: "Job Deleted",
        description: `All data for the selected job has been deleted.`,
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
        description: "Error deleting job. Please try again later.",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    } finally {
      setBtnLoading(false); // Stop loading in both success and error cases
    }
  };

  // Fetch jobs when the component mounts
  const fetchJobs = async () => {
    try {
      const jobData = await getAllJobs();
      console.log("jobData", jobData);
      setJobs(jobData.jobs);
      console.log("JOb data from fetchjobs function", jobData);
      console.log(jobData.jobs[0].billers);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (isOpen) {
      console.log("Modal is open, item:", item);
      console.log("Available billers:", billers);
    }
  }, [isOpen, item, billers]);

  if (isLoading) {
    return <Loading />;
  }

  const hasEmptyFields = () => {
    return !selectedJob?.meetingLink || !selectedJob?.meetingTime;
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
              placeholder="Search by title or description"
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
          {role === "CLIENT" && (
            <ButtonGroup>
              <Button
                variant="solid"
                colorScheme="whatsapp"
                onClick={() => openDrawer("addNew")}
                size="md"
                color={"white"}
              >
                Create New Job
              </Button>
            </ButtonGroup>
          )}
        </Flex>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple" size={"md"}>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Description</Th>
              <Th>Start Date</Th>
              <Th>Payment Terms</Th>
              <Th>Duration</Th>
              <Th>Required Skills</Th>
              <Th>Meeting Details</Th>
              <Th>Assinged Billers</Th>
              <Th>Budget</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((item) => (
              <Tr key={item.userId}>
                <Td>{item.title}</Td>
                <Td>{item.description}</Td>
                <Td>{item.startDate}</Td>
                <Td>{item.paymentTerms}</Td>
                <Td>{item.duration}</Td>
                <Td>{item.skills}</Td>
                {/* <Td>{item.billers.userName}</Td> */}
                <Td>
                  {!(item.status === "COMPLETED" || item.status === "ABORTED") && (
                    <Button
                      colorScheme="whatsapp"
                      size="sm"
                      variant="solid"
                      borderRadius="md"
                      fontSize="sm"
                      px={2}
                      py={1}
                      onClick={() => handleMeetingDetails(item)}
                    >
                      View
                    </Button>
                  )}
                </Td>
                <Td>
                  {role !== "BILLER" && item.status !== "COMPLETED" && item.status !== "ABORTED" && (
                    <Button
                      colorScheme="whatsapp"
                      size="sm"
                      variant="solid"
                      borderRadius="md"
                      fontSize="sm"
                      px={2}
                      py={1}
                      onClick={() => handleAssignedBillers(item)}
                    >
                      View
                    </Button>
                  )}
                </Td>
                <Td>{item.budget}$</Td>
                <Td><Badge colorScheme={statusColors[item.status]}
                  borderRadius="md"
                > {item.status.replace(/_/g, ' ')} </Badge></Td> {/*.replace(/_/g, ' ')*/}
                <Td>
                  {!(role === "CLIENT" && (item.status === "COMPLETED" || item.status === "ABORTED")) &&
                    !(role === "ADMIN" && (item.status === "COMPLETED" || item.status === "ABORTED")) && (
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<HiDotsVertical />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          {role === "CLIENT" && item.status !== "COMPLETED" && item.status !== "ABORTED" && (
                            <MenuItem
                              icon={<FiEdit />}
                              onClick={() => openDrawer("edit", item)}
                            >
                              Edit
                            </MenuItem>
                          )}
                          {role === "CLIENT" && item.status !== "COMPLETED" && item.status !== "ABORTED" && (
                            <MenuItem
                              icon={<FiTrash2 />}
                              onClick={() => handleDeleteClick(item)}
                              isLoading={btnLoading}
                            >
                              Delete
                            </MenuItem>
                          )}
                          {role === "CLIENT" && item.status !== "COMPLETED" && item.status !== "ABORTED" && (
                            <MenuItem
                              icon={<BiSupport />}
                              onClick={() => handleSupport(item)}
                              isLoading={btnLoading}
                            >
                              Support
                            </MenuItem>
                          )}
                          {role === "CLIENT" && item.status === "INTERVIEW_SCHEDULED" && (
                            <MenuItem
                              icon={<FiUser />}
                              onClick={() => openDrawer("viewRecommended", item)}
                            >
                              View Profiles
                            </MenuItem>
                          )}
                          {role === "CLIENT" && item.status === "FINALIZED" && (
                            <MenuItem
                              icon={<FiCheck />}
                              onClick={() => onCompleteClick(item)}
                            >
                              Completed
                            </MenuItem>
                          )}
                          {role === "CLIENT" && item.status === "FINALIZED" && (
                            <MenuItem
                              icon={<FiMinusCircle />}
                              onClick={() => onAbortClick(item)}
                            >
                              Abort
                            </MenuItem>
                          )}
                          {role === "ADMIN" && item.status === "AWAITING_CONFIRMATION" && (
                            <MenuItem
                              icon={<FiCalendar />}
                              onClick={() => handleScheduleMeeting(item)}
                              isLoading={btnLoading}
                            >
                              Schedule Meeting
                            </MenuItem>
                          )}
                          {role === "ADMIN" && item.status === "INITIAL_MEETING_SCHEDULED" && (
                            <MenuItem
                              icon={<FiCalendar />}
                              onClick={() => onSearchCandidateClick(item)}
                            >
                              Search Candidate
                            </MenuItem>
                          )}
                          {role === "ADMIN" && item.status === "INTERVIEW_SCHEDULED" && (
                            <MenuItem
                              icon={<FiCalendar />}
                              onClick={() => onFinalizeClick(item)}
                            >
                              Finalize
                            </MenuItem>
                          )}
                          {role === "ADMIN" && item.status === "SEARCHING_CANDIDATE" && (
                            <MenuItem
                              icon={<FiCalendar />}
                              onClick={() => handleScheduleMeeting(item)}
                              isLoading={btnLoading}
                            >
                              Recommend Candidates
                            </MenuItem>
                          )}
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
        handleAddUpdateDeleteItem={fetchJobs}
      />
      <DeleteAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        HeaderText={"Delete Job"}
        BodyText={`Are you sure you want to delete this ${jobName}?`}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {item.status === "AWAITING_CONFIRMATION"
              ? "Schedule Meeting"
              : item.status === "SEARCHING_CANDIDATE"
                ? "Recommend Billers"
                : "Change Status"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {item.status === "AWAITING_CONFIRMATION" && (
              <FormControl isInvalid={meetingLinkError}>
                {/* <FormLabel>Enter Meeting Link</FormLabel> */}
                <Input
                  placeholder="Enter Meeting Link"
                  value={meetingLink}
                  onChange={handleMeetingLinkChange}
                />
                <Input
                  required
                  type="time"
                  value={meetingTime}
                  onChange={handleMeetingTimeChange}
                />
                <FormErrorMessage>
                  The link must start with "https://", or "www.".
                </FormErrorMessage>
              </FormControl>
            )}
            {item.status === "SEARCHING_CANDIDATE" && (
              <>
                <FormControl isInvalid={meetingLinkError} mb={4}>
                  <Stack spacing={4}>
                    <HStack>
                      <Icon as={HiLink} color="gray.500" />
                      <Input
                        placeholder="Enter Meeting Link"
                        value={meetingLink}
                        onChange={handleMeetingLinkChange}
                      />
                    </HStack>
                    <HStack>
                      <Icon as={HiClock} color="gray.500" />
                      <Input
                        type="time"
                        value={meetingTime}
                        onChange={handleMeetingTimeChange}
                        sx={{
                          "&::-webkit-calendar-picker-indicator": {
                            display: "none",
                            appearance: "none",
                          },
                        }}
                      />
                    </HStack>
                  </Stack>
                  <FormErrorMessage>
                    The link must start with "https://" or "www.".
                  </FormErrorMessage>
                </FormControl>
                <Divider borderColor="gray.300" />
                <Text fontSize="xl" mb={2} mt={2}>Select Billers to Recommend:</Text>
                <Box
                  maxHeight="200px"
                  overflowY="auto"
                  sx={{
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "whatsapp.500", // Scrollbar thumb color matching WhatsApp scheme
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "whatsapp.600", // Darker color on hover
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "gray.100", // Track color
                    },
                  }}
                >
                  {billers.length > 0 ? (
                    <Stack spacing={4}>
                      {billers.map((biller) => (
                        <HStack key={biller.userId} spacing={3}>
                          <Checkbox
                            isChecked={selectedBillers.includes(biller.userId)}
                            onChange={() => handleBillerSelect(biller.userId)}
                          >
                            <HStack spacing={3}>
                              <Avatar
                                size="sm"
                                name={biller.userName}
                                src={`${BASE_URL}/uploads/profile/${biller.profilePicture}`}
                              />
                              <Text
                                fontSize="md"
                                onClick={() => {
                                  localStorage.setItem("selectedBiller", JSON.stringify(biller));
                                  window.open(`/biller/profile/${biller.userId}`, '_blank')
                                }}
                                cursor="pointer"
                                _hover={{ textDecoration: 'underline' }}
                              >
                                {biller.userName}
                              </Text>
                            </HStack>
                          </Checkbox>
                        </HStack>
                      ))}
                    </Stack>
                  ) : (
                    <Text>No billers available</Text>
                  )}
                </Box>
                <Text mt={2}>Selected Billers: {selectedBillers.join(", ")}</Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {item.status === "SEARCHING_CANDIDATE" && (
              <Button
                colorScheme="whatsapp"
                mr={3}
                onClick={() => {
                  console.log("Selected Billers:", selectedBillers);
                  handleRecommendBillers(item, selectedBillers);
                }}
                isLoading={btnLoading}
              >
                Recommend Billers
              </Button>
            )}
            {item.status === "AWAITING_CONFIRMATION" && (
              <Button
                colorScheme="whatsapp"
                mr={3}
                onClick={() => handleSaveMeeting(item)}
                isLoading={btnLoading}
              >
                Save
              </Button>
            )}
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isSupportModalOpen} onClose={onSupportModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Issue Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              placeholder="Describe your issue here..."
              value={supportIssue}
              onChange={(e) => setSupportIssue(e.target.value)}
              rows={5}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="whatsapp" mr={3} onClick={handleSupportSubmit} isLoading={btnLoading}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onSupportModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isSearchCandidateModalOpen} onClose={onSearchCandidateModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Status</ModalHeader>
          <ModalBody>
            <Text>{confirmationMessage}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="whatsapp" mr={3} onClick={handleStatusChangeSubmit} isLoading={btnLoading}>
              Yes
            </Button>
            <Button variant="ghost" onClick={onSearchCandidateModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* ASSIGNED BILLER MODAL */}
      <Modal isOpen={isAssignedBillerModalOpen} onClose={onAssignedBillerModalClose}>
        <ModalOverlay />
        <ModalContent bg="white" borderRadius="md" boxShadow="lg">
          <ModalHeader fontSize="lg" fontWeight="bold">
            Assigned Billers
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedJob && selectedJob.length > 0 ? (
              selectedJob.map((biller) => {
                // Split skills string into an array
                const skills = biller.skills ? biller.skills.split(',') : [];
                return (
                  <Box
                    key={biller.userId}
                    p={4}
                    mb={3}
                    borderWidth="1px"
                    borderRadius="lg"
                    boxShadow="sm"
                    _hover={{ boxShadow: "md" }}
                  >
                    <HStack spacing={3} alignItems="center">
                      <Avatar
                        size="md"
                        name={biller.userName}
                        // src={biller.profilePicture || ""}
                        src={`${BASE_URL}/uploads/profile/${biller.profilePicture}`}
                        bg="green.500"
                        icon={<FaUser color="white" />}
                      />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" fontSize="lg">
                          {biller.userName}
                        </Text>
                        <HStack spacing={2}>
                          <MdEmail color="teal" />
                          <Text fontSize="sm">{biller.email}</Text>
                        </HStack>
                        <HStack wrap="wrap">
                          <FaTools color="blue.500" />
                          {skills.length > 5 ? (
                            <>
                              {expandedSkills[biller.userId]
                                ? skills.map((skill, index) => (
                                  <Badge
                                    key={index}
                                    colorScheme="whatsapp"
                                    // mr={1}
                                    mb={1}
                                    borderRadius={"md"}
                                  >
                                    {skill}
                                  </Badge>
                                ))
                                : skills.slice(0, 4).map((skill, index) => (
                                  <Badge
                                    key={index}
                                    colorScheme="whatsapp"
                                    // mr={1}
                                    mb={1}
                                    borderRadius={"md"}
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              <Button
                                variant="link"
                                colorScheme="whatsapp"
                                onClick={() => handleSeeMoreClick(biller.userId)}
                              >
                                {expandedSkills[biller.userId] ? 'See Less' : 'See More'}
                              </Button>
                            </>
                          ) : (
                            skills.map((skill, index) => (
                              <Badge
                                key={index}
                                colorScheme="whatsapp"
                                mr={2}
                                mb={2}
                              >
                                {skill}
                              </Badge>
                            ))
                          )}
                        </HStack>
                      </VStack>
                    </HStack>
                  </Box>
                );
              })
            ) : (
              <Text>No assigned billers available.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onAssignedBillerModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* MEETING DETAILS MODAL */}
      <Modal isOpen={isMeetingDetailsModalOpen} onClose={onMeetingDetailsModalClose}>
        <ModalOverlay />
        <ModalContent bg="white" borderRadius="md" boxShadow="lg">
          <ModalHeader fontSize="lg" fontWeight="bold">Meeting Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              <Text fontSize="sm" color="black" mb={1} display="flex" alignItems="center">
                <HiLink color="green.500" style={{ marginRight: '8px' }} />
                <strong>Meeting Link:</strong>
              </Text>
              <Text fontSize="md" color="green.600" wordBreak="break-word" p={2} border="1px solid" borderColor="gray.200" borderRadius="md">
                <a href={selectedJob?.meetingLink || "#"} target="_blank" rel="noopener noreferrer">
                  {selectedJob?.meetingLink || "No meeting scheduled"}
                </a>
              </Text>
            </Box>
            <Box mb={4}>
              <Text fontSize="sm" color="black" mb={1} display="flex" alignItems="center">
                <HiClock color="green.500" style={{ marginRight: '8px' }} />
                <strong>Meeting Time:</strong>
              </Text>
              <Text fontSize="md" color="gray.800" p={2} border="1px solid" borderColor="gray.200" borderRadius="md">
                {selectedJob?.meetingTime ? formatTimetoDisplay(selectedJob.meetingTime) : "N/A"}
              </Text>
              <br />
              {role === "CLIENT" && selectedJob && selectedJob.status === "INTERVIEW_SCHEDULED" && !hasEmptyFields() && (
                <Button
                  colorScheme="green"
                  size="sm"
                  variant="solid"
                  borderRadius="md"
                  fontSize="sm"
                  px={2}
                  py={1}
                  onClick={() => openDrawer("viewRecommended", selectedJob)}
                  isLoading={btnLoading}
                >
                  View Recommended Profiles
                </Button>
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onMeetingDetailsModalClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
export default JobList;