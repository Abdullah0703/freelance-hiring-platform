import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Flex,
    Text,
    VStack,
    HStack,
    Divider,
    Button,
    Avatar,
    Textarea,
    IconButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    useColorModeValue,
    Spacer,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    useToast
} from '@chakra-ui/react';
import { BsSend } from "react-icons/bs";
import { PiChatsFill } from "react-icons/pi";
import { AiOutlinePaperClip } from "react-icons/ai";

const ChatScreen = ({ sideBarWidth }) => {
    const bgColor = useColorModeValue('gray.50', 'gray.800');
    const chatBgColor = useColorModeValue('white', 'gray.700');
    const messageBgColor = useColorModeValue('gray.100', 'gray.600');
    const headerBgColor = useColorModeValue('gray.100', 'gray.700');

    const [selectedChat, setSelectedChat] = useState(null);
    const [receiverId, setReceiverId] = useState(0);
    const [newMessage, setNewMessage] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const supportData = location.state;
    const messageBoxRef = useRef(null);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const toast = useToast();

    const hardcodedChats = [
        { id: 1, name: 'Alice', messages: [{ id: 1, text: 'Hello', sender: 'Alice' }] },
        { id: 2, name: 'Bob', messages: [{ id: 1, text: 'Hi there', sender: 'Bob' }] },
    ];
    
    const faqData = [
        { question: 'FAQ 1: Issue Description', answer: 'Details about issue 1.' },
        { question: 'FAQ 2: How to Solve Issue', answer: 'Details about issue 2.' },
    ];
    // useEffect(() => {
    //     const storedChats = JSON.parse(localStorage.getItem('chats')) || [];
    //     const initialChats = storedChats.length > 0 ? storedChats : [
    //         { id: 1, name: 'Alice', messages: [{ id: 1, text: 'Hello', sender: 'Alice' }] },
    //         { id: 2, name: 'Bob', messages: [{ id: 1, text: 'Hi there', sender: 'Bob' }] },
    //     ];

    //     if (supportData) {
    //         const supportChat = {
    //             id: 3,
    //             name: 'Support',
    //             messages: [{
    //                 id: 1,
    //                 text: `Job ID: ${supportData.jobId}, Job Name: ${supportData.jobName}, Issue: ${supportData.issue}`,
    //                 sender: "Client"
    //             }]
    //         };
    //         if (!initialChats.some(chat => chat.id === supportChat.id)) {
    //             initialChats.push(supportChat);
    //         }
    //         setSelectedChat(supportChat);
    //     }
    //     setChats(initialChats);
    //     setLoading(false);
    // }, [supportData]);
    useEffect(() => {
        const storedChats = JSON.parse(localStorage.getItem('chats')) || [];
        const initialChats = storedChats.length > 0 ? storedChats : [
            { id: 1, name: 'Alice', messages: [{ id: 1, text: 'Hello', sender: 'Alice' }] },
            { id: 2, name: 'Bob', messages: [{ id: 1, text: 'Hi there', sender: 'Bob' }] },
        ];

        if (supportData) {
            const supportChat = {
                id: 3,
                name: 'Support',
                messages: [{
                    id: 1,
                    text: `Job ID: ${supportData.jobId}, Job Name: ${supportData.jobName} 
                    `,
                    sender: "Client"
                }]
            };
            if (!initialChats.some(chat => chat.id === supportChat.id)) {
                initialChats.push(supportChat);
            }
            setSelectedChat(supportChat);
            setExpandedIndex(0); // Open the first FAQ accordion by default
        }
        setChats(initialChats);
        setLoading(false);
    }, [supportData]);
    
    useEffect(() => {
        localStorage.setItem('chats', JSON.stringify(chats));
    }, [chats]);

    useEffect(() => {
        scrollToBottom();
    }, [selectedChat, chats]);

    const scrollToBottom = () => {
        if (messageBoxRef.current) {
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim() === '' || !selectedChat) return;

        const newMessages = [{ id: (selectedChat.messages.length + 1), text: newMessage, sender: 'you' }];
        const updatedChats = chats.map(chat => chat.id === selectedChat.id
            ? { ...chat, messages: [...(chat.messages || []), ...newMessages] }
            : chat
        );

        setChats(updatedChats);
        setNewMessage('');
        setSelectedChat(prev => ({ ...prev, messages: [...(prev.messages || []), ...newMessages] }));
    };

    const handleEnterPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleChatClick = (chatId, chat) => {
        setSelectedChat(chat);
        setReceiverId(chatId);
    };
    const handleFaqClick = (faq) => {
        toast({
            title: "Support Ticket Raised",
            description: `You raised a support ticket for: "${faq}".`,
            status: "success",
            duration: 2000,
            position: "top-right",
            isClosable: true,
        });
    };
    const handleDrawerOpen = () => setIsDrawerOpen(true);
    const handleDrawerClose = () => setIsDrawerOpen(false);

    if (loading) {
        return <Box p={4}>Loading...</Box>;
    }

    return (
        <>
            <Box bg={bgColor} h="80vh" display="flex" flexDirection="column">
                <Flex flex={1} overflow="hidden">
                    <Box
                        ml={{ base: 0, lg: sideBarWidth === "small" ? 14 : 60 }}
                        transition="margin 0.3s ease-in-out"
                        w="full"
                        display={{ base: "block", md: "flex" }}
                    >
                        <Box
                            w={{ base: "full", md: "15rem" }}
                            bg={chatBgColor}
                            p={4}
                            borderRight="1px"
                            borderColor="gray.200"
                            boxShadow="md"
                            display={{ base: "none", md: "block" }}
                            overflowY="auto"
                        >
                            <Text fontSize={{ base: "sm", md: "xl" }} fontWeight="bold" mb={4}>
                                All Chats
                            </Text>
                            <VStack align="start" spacing={2}>
                                {chats.map((chat) => (
                                    <Box
                                        key={chat.id}
                                        p={2}
                                        borderRadius="lg"
                                        cursor="pointer"
                                        _hover={{ bg: 'green.200' }}
                                        onClick={() => handleChatClick(chat.id, chat)}
                                        bg={selectedChat?.id === chat.id ? 'green.100' : 'transparent'}
                                        w="full" // **Changed**
                                    >
                                        <HStack spacing={2} align="center">
                                            <Avatar name={chat.name} size="md" />
                                            <Text
                                                fontSize="md"
                                                fontWeight={selectedChat?.id === chat.id ? 'bold' : 'normal'}
                                            >
                                                {chat.name}
                                            </Text>
                                        </HStack>
                                    </Box>
                                ))}
                            </VStack>
                        </Box>
                        <Box w="full" bg={chatBgColor} boxShadow="md" borderRadius="lg" display="flex" flexDirection="column">
                            <Flex
                                align="center"
                                p={4}
                                borderBottom="1px"
                                borderColor="gray.200"
                                bg={headerBgColor}
                            >
                                {selectedChat && (
                                    <>
                                        <VStack align="start">
                                            <HStack spacing={4}>
                                                <Avatar name={selectedChat.name} size="md" />
                                                <Text fontSize="xl" fontWeight="bold">
                                                    {selectedChat.name}
                                                </Text>
                                            </HStack>
                                        </VStack>
                                        <Spacer />
                                        <Button
                                            leftIcon={<PiChatsFill />}
                                            onClick={handleDrawerOpen}
                                            colorScheme="whatsapp"
                                        >
                                            Start New Chat
                                        </Button>
                                    </>
                                )}
                            </Flex>
                            <Box
                                flex={1}
                                p={4}
                                ref={messageBoxRef}
                                overflowY="auto"
                                bg={messageBgColor}
                            >
                                <VStack align="start" spacing={4}>
                                    {selectedChat && selectedChat.messages.map((msg, index) => (
                                        <Box
                                            key={index}
                                            alignSelf={msg.sender === "you" ? "flex-end" : "flex-start"}
                                            p={2}
                                            borderRadius="lg"
                                            bg={msg.sender === "you" ? 'white' : 'white'}
                                        >
                                            <HStack spacing={4}>
                                                <Avatar name={msg.sender} size="sm" />
                                                <VStack align="start" spacing={1}>
                                                    <Text fontWeight="bold">{msg.sender}</Text>
                                                    <Text>{msg.text}</Text>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                    ))}
                                    {selectedChat && selectedChat.name === "Support" && (
                                        <Box
                                            p={2}
                                            borderRadius="lg"
                                            bg="white"
                                            w="full"
                                        >
                                            <Accordion
                                                allowToggle
                                               
                                                index={expandedIndex} // This controls which accordion is expanded
                                                onChange={(index) => setExpandedIndex(index)} // Update state when accordion is toggled
                                            >
                                                <AccordionItem>
                                                    <AccordionButton onClick={() => handleFaqClick("FAQ 1: Issue Description")}>
                                                        <Box as="span" flex="1" textAlign="left">
                                                            FAQ 1: Issue Description
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                    <AccordionPanel pb={4}>
                                                        Details about issue 1.
                                                    </AccordionPanel>
                                                </AccordionItem>

                                                <AccordionItem>
                                                    <AccordionButton onClick={() => handleFaqClick("FAQ 2: Issue Description")}>
                                                        <Box as="span" flex="1" textAlign="left">
                                                            FAQ 2: Issue Description
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                    <AccordionPanel pb={4}>
                                                        Details about issue 2.
                                                    </AccordionPanel>
                                                </AccordionItem>

                                                <AccordionItem>
                                                    <AccordionButton onClick={() => handleFaqClick("FAQ 3: Issue Description")}>
                                                        <Box as="span" flex="1" textAlign="left">
                                                            FAQ 3: Issue Description
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                    <AccordionPanel pb={4}>
                                                        Details about issue 3.
                                                    </AccordionPanel>
                                                </AccordionItem>
                                            </Accordion>
                                        </Box>
                                    )}
                                </VStack>

                            </Box>
                            <Divider />
                            <Box p={2} bg={chatBgColor}>
                                <Flex align="center" gap={2}>
                                    <IconButton
                                        icon={<AiOutlinePaperClip />}
                                        aria-label="Attach file"
                                        colorScheme="gray"
                                        variant="outline"
                                    />
                                    <Textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        size="sm"
                                        onKeyPress={handleEnterPress}
                                        resize="none"
                                        borderColor="gray.300"
                                        _focus={{ borderColor: 'green.300' }}
                                        borderRadius={'md'}
                                        rows={1}
                                    />
                                    <IconButton
                                        icon={<BsSend />}
                                        aria-label="Send"
                                        colorScheme="whatsapp"
                                        variant="solid"
                                        onClick={handleSendMessage}
                                    />
                                </Flex>
                            </Box>
                        </Box>
                    </Box>
                </Flex>
            </Box>

            <Drawer
                isOpen={isDrawerOpen}
                placement="right"
                onClose={handleDrawerClose}
                size="md"
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>New Chat</DrawerHeader>

                    <DrawerBody>
                        <VStack align="start" spacing={4}>
                            <Box p={2} bg={chatBgColor}>
                                <Text fontSize="lg" fontWeight="bold" mb={2}>Available Chats</Text>
                                <VStack align="start" spacing={2}>
                                    {chats.map((chat) => (
                                        <Box
                                            key={chat.id}
                                            p={2}
                                            borderRadius="lg"
                                            cursor="pointer"
                                            _hover={{ bg: 'green.200' }} // **Changed**
                                            onClick={() => handleChatClick(chat.id, chat)}
                                            bg={selectedChat?.id === chat.id ? 'green.100' : 'transparent'}
                                            w="full" // **Changed**
                                        >
                                            <HStack spacing={2} align="center">
                                                <Avatar name={chat.name} size="md" />
                                                <Text
                                                    fontSize="md"
                                                    fontWeight={selectedChat?.id === chat.id ? 'bold' : 'normal'}
                                                >
                                                    {chat.name}
                                                </Text>
                                            </HStack>
                                        </Box>
                                    ))}
                                </VStack>
                            </Box>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default ChatScreen;
