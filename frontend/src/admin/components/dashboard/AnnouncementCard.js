import React, { useEffect, useState } from 'react';
import { Box, Text, Divider, VStack, HStack, SimpleGrid, Badge, GridItem, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { FcAdvertising } from "react-icons/fc";
import { fetchNotifications } from '../../../API/notification'; // Adjust import as needed

const AnnouncementCard = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        const data = await fetchNotifications(parsedUser.userId);
        if (data.success) {
          setNotifications(data.notifications);
        } else {
          setError('Failed to fetch notifications');
        }
      } else {
        setError('User data not found in localStorage');
      }
    } catch (error) {
      setError('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  if (loading) {
    return (
      <Box p={6}>
        <Spinner size="lg" />
        <Text ml={2}>Loading notifications...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      p={6}
      shadow="md"
      transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out" // Smooth transition
      _hover={{ transform: "scale(1.01)", boxShadow: "lg" }} // Hover effect
    >
      <SimpleGrid columns={2} justifyContent="space-between" mb={4}>
        <Text fontSize="xl" fontWeight="semibold" mb={2} align="left">
          Notifications
        </Text>
        <GridItem colSpan={1 / 3} style={{ justifySelf: "end" }}>
          {/* Add button or other content if needed */}
        </GridItem>
      </SimpleGrid>
      <Divider borderColor="gray.300" mb={4} />
      <Box
        maxH="290px"
        overflowY="auto" // Enable vertical scrolling
        sx={{
          '::-webkit-scrollbar': {
            width: '8px',
            backgroundColor: '#f0f0f0',
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#555',
            },
          },
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <HStack key={index} mb={4} spacing={4} align="start">
              <FcAdvertising size={"40px"} />
              <VStack align="start" spacing={1}>
                <Text fontSize="md" fontWeight="bold" color={notification.color}>
                  {notification.title}
                </Text>
                <Text fontSize="md" color={notification.color}>
                  {notification.description}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {notification.date}
                </Text>
              </VStack>
              <Box ml="auto" mr={3}>
                {notification.read ? (
                  <Badge colorScheme="green" variant="solid" py={1} px={2} borderRadius='full'>
                    Read
                  </Badge>
                ) : (
                  <Badge colorScheme="red" variant="solid" py={1} px={2} borderRadius='full'>
                    Unread
                  </Badge>
                )}
              </Box>
            </HStack>
          ))
        ) : (
          <Text>No notifications available</Text>
        )}
      </Box>
    </Box>
  );
};

export default AnnouncementCard;
