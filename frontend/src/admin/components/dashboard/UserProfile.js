import React, { useState } from "react";
import {
  Flex,
  Avatar,
  Text,
  CircularProgress,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useColorModeValue,
} from "@chakra-ui/react";
import { createAttendance, updateAttendance } from "../../../API/attendance"; 
import Loading from "../../../components/Loading/Loading";

// Dummy import for image (change if required)
const image = require("../../../images/profile-background.jpg");

// Default placeholder image (you can replace this with your preferred placeholder)
const defaultAvatar = "path/to/default-avatar.jpg";

const UserProfile = ({ name, jobTitle, avatarUrl }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [timer, setTimer] = useState(Number(localStorage.getItem("timer")) || 0);
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [isClockingOut, setIsClockingOut] = useState(false);
  const [attendanceId, setAttendanceId] = useState(localStorage.getItem("attendanceId"));
  const gradientBg = useColorModeValue(
    'linear-gradient(to bottom right, #e0f2f1, #b2dfdb)',
    'linear-gradient(to bottom right, #1a202c, #2d3748)'
);
  // Fetch user data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleClockIn = async () => {
    setIsClockingIn(true);
    onOpen(); // Open modal for clocking in

    try {
      const response = await createAttendance(user.userId);
      setAttendanceId(response.attendance.attendanceId);
      localStorage.setItem("attendanceId", response.attendance.attendanceId);
      onClose();
      setIsClockingIn(false);
      setTimer(0);
      toast({
        title: "Successfully Clocked In",
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    } catch (error) {
      console.error("Error clocking in:", error);
      setIsClockingIn(false);
      toast({
        title: "Failed to Clock In",
        description: "You have already clocked in today",
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  const handleClockOut = async () => {
    setIsClockingOut(true);

    try {
      await updateAttendance(attendanceId);
      setIsClockingOut(false);
      setAttendanceId(null);
      localStorage.removeItem("attendanceId");
      toast({
        title: "Successfully Clocked Out",
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
      window.location.reload(); // Refresh the page after clocking out
    } catch (error) {
      console.error("Error clocking out:", error);
      setIsClockingOut(false);
      toast({
        title: "Failed to Clock Out",
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <Flex
      direction="column"
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      p={6}
      shadow="md"
      align="center"
      justify="center"
      bgImage={gradientBg}
    >
      <Avatar
        src={avatarUrl}
        size="xl"
        mb={1}
      />
      <Text fontSize="md" fontWeight="bold" mb={1}>
        {name || user?.fname}
      </Text>
      <Text fontSize="md" fontWeight="bold" mb={1}>
        {/* {name || user?.role} */}
      </Text>
      <Text fontSize="md" color="gray.500">
        {jobTitle || user?.designation}
      </Text>
      {/* <Flex width={"100%"} gap={14} pt={2} justify="center" p={4}>
        <VStack width={"100%"}>
          {attendanceId ? (
            <Button colorScheme="red" variant="solid" onClick={handleClockOut} isDisabled={isClockingOut}>
              {isClockingOut ? <CircularProgress isIndeterminate size="24px" color="white" /> : "Clock Out"}
            </Button>
          ) : (
            <Button colorScheme="whatsapp" variant="solid" onClick={handleClockIn} isDisabled={isClockingIn}>
              {isClockingIn ? <CircularProgress isIndeterminate size="24px" color="whatsapp" /> : "Clock In"}
            </Button>
          )}
        </VStack>
      </Flex> */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Attempting to clock you in</ModalHeader>
          <ModalBody>
            <CircularProgress isIndeterminate size="48px" color="teal" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default UserProfile;
