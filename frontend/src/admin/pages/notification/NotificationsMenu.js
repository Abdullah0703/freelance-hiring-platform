import React, { useEffect, useState } from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Box, Divider, Spinner, Badge } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { FaRegBell, FaInfoCircle } from 'react-icons/fa';
import { fetchNotifications, markNotificationAsRead } from '../../../API/notification';

const NotificationsMenu = () => {
    const [notifications, setNotifications] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const loadNotifications = async () => {
        try {
            setLoading(true); // Set loading state
            console.log('Loading notifications...');

            const user = localStorage.getItem('user');
            if (user) {
                const parsedUser = JSON.parse(user);
                setUserId(parsedUser.userId);
                console.log('User ID:', parsedUser.userId);

                // Fetch notifications
                const data = await fetchNotifications(parsedUser.userId);
                if (data.success) {
                    // Filter out read notifications and set the state
                    console.log("notifications fetched: ",data);
                    const unreadNotifications = data.notifications.filter(notification => !notification.read);
                    setNotifications(unreadNotifications);
                    console.log('Fetched notifications unread:', unreadNotifications);
                    // Calculate unread notifications count directly from the array
                    const count = unreadNotifications.length;
                    setUnreadCount(count);
                    console.log('Unread notifications count:', count);
                } else {
                    console.error('Failed to fetch notifications');
                    setError('Failed to fetch notifications');
                }
            } else {
                setError('User data not found');
                console.error('User data not found in localStorage');
            }
        } catch (error) {
            console.error('Error handling notifications:', error);
            setError('Error handling notifications');
        } finally {
            setLoading(false); // Reset loading state
            console.log('Finished loading notifications.');
        }
    };

    const markAllNotificationsAsRead = async () => {
        try {
            console.log('Marking all notifications as read...');
            const unreadNotifications = notifications.filter(notification => !notification.read);
            for (const notification of unreadNotifications) {
                await markNotificationAsRead(notification.notificationId);
                console.log('Marked as read:', notification.notificationId);
            }
            // Refresh notifications and unread notifications count
            await loadNotifications(); // Refresh after marking as read
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    useEffect(() => {
        // Load notifications only on initial render
        loadNotifications();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            console.log('Fetching new notifications... as 15 minutes have passed');
            loadNotifications();
        }, 15 * 60 * 1000); // 15 minutes

        return () => clearInterval(intervalId); // Clean up on unmount
    }, []);

    return (
        <>
            <Menu isOpen={isOpen} onOpen={() => {
                setIsOpen(true);
                loadNotifications(); // Fetch notifications when menu opens
            }} onClose={() => {
                setIsOpen(false);
                markAllNotificationsAsRead(); // Mark notifications as read when menu closes
            }}>
                <MenuButton
                    as={IconButton}
                    icon={
                        <Box position="relative">
                            <FaRegBell color={unreadCount > 0 ? 'red' : 'black'} />
                            {unreadCount > 0 && (
                                <Badge
                                    colorScheme="red"
                                    variant="solid"
                                    borderRadius="full"
                                    position="absolute"
                                    top="-1"
                                    right="-1"
                                    fontSize="xs"
                                    minWidth="16px"
                                    textAlign="center"
                                >
                                    {unreadCount}
                                </Badge>
                            )}
                        </Box>
                    }
                    aria-label="Notifications"
                    style={{ backgroundColor: "#fff" }}
                    fontSize="xl"
                />

                <MenuList className="menu-list" maxH="300px" overflowY="auto" bg="white">
                    {loading ? (
                        <MenuItem bg="white" _hover={{ bg: 'white' }}>
                            <Spinner size="lg" />
                            <Box ml={2}>Loading...</Box>
                        </MenuItem>
                    ) : error ? (
                        <MenuItem bg="white" _hover={{ bg: 'white' }}>{error}</MenuItem>
                    ) : notifications.length > 0 ? (
                        notifications.map(notification => (
                            <MenuItem key={notification.notificationId} bg="white" _hover={{ bg: 'white' }}>
                                <Box display="flex" alignItems="center" p={2}>
                                    <FaInfoCircle style={{ marginRight: '15px', color: 'green'}} size={20}/>
                                    <Box>
                                        <strong>{notification.title}</strong>
                                        <p>{notification.description}</p>
                                        <Divider />
                                    </Box>
                                </Box>
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem bg="white" _hover={{ bg: 'white' }}>No notifications available</MenuItem>
                    )}
                </MenuList>
            </Menu>
        </>
    );
};

export default NotificationsMenu;
