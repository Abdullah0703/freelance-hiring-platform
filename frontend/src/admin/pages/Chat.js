import React, { useState, useEffect, useRef } from 'react';


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
    useToast,
    CloseButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Heading,
    Center,
    Container,
    useColorModeValue,
} from '@chakra-ui/react';
import { BsDownload, BsSend } from "react-icons/bs";
import { PiChatsFill } from "react-icons/pi";
import { BASE_URL } from '../../API/constants';
import axios from 'axios';
import { getcontacts, getmessages, sendMessage } from '../../API/chat';
import Loading from '../../components/Loading/Loading';
const sampleChats = [
    {
        id: 1,
        username: 'John Doe',
        profilePicture: 'path/to/john_profile.jpg',
        messages: [
            { _id: 1, content: 'Hey, how are you?', sender: '12345' },
            { _id: 2, content: 'I am good, thanks! What about you?', sender: '67890' },
            { _id: 3, content: 'Doing well! Have you completed the project?', sender: '12345' },
        ],
    },
    {
        id: 2,
        username: 'Jane Smith',
        profilePicture: 'path/to/jane_profile.jpg',
        messages: [
            { _id: 1, content: 'Hello, can we reschedule our meeting?', sender: '67890' },
            { _id: 2, content: 'Sure, what time works for you?', sender: '12345' },
            { _id: 3, content: 'How about 3 PM tomorrow?', sender: '67890' },
        ],
    },
];
const selectedChat = {
    id: 1,
    username: 'John Doe',
    profilePicture: 'path/to/john_profile.jpg',
    messages: [
        { _id: 1, content: 'Hey, how are you?', sender: '12345' },
        { _id: 2, content: 'I am good, thanks! What about you?', sender: '67890' },
        { _id: 3, content: 'Doing well! Have you completed the project?', sender: '12345' },
    ],
};
const sampleMessages = [
    { _id: 1, content: 'Hey, how are you?', sender: '12345' },  // sender '12345' is the user
    { _id: 2, content: 'I am good, thanks! What about you?', sender: '67890' },  // sender '67890' is the other person
    { _id: 3, content: 'Doing well! Have you completed the project?', sender: '12345' },
];

const currentuser = JSON.parse(localStorage.getItem("user"));
let sender = null;
let senderId = null;

if (currentuser) {
    senderId = currentuser.userId;
} else {
    console.error("currentuser not found in local storage");
}


const ChatHome = ({ sideBarWidth }) => {
    const bgColor = useColorModeValue('gray.100', 'gray.700');

    const [selectedChat, setSelectedChat] = useState(sampleChats[0]);
    const [receiverId, setReceiverId] = useState(0);
    const [message, setMessage] = useState(sampleChats[0].messages);
    const [newMessage, setNewMessage] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isChatSelected, setChatSelected] = useState(false);
    const [chats, setChats] = useState(sampleChats);
    const [loading, setLoading] = useState(true);


    const handleChatSelected = () => {
        setChatSelected(true);
    }
    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    const getchatcontacts = async () => {
        try {
            const data = await getcontacts();
            console.log("chat data", data)
            setChats(data);
            console.log(data)// Update the state with the fetched favorite services
            setLoading(false);
        } catch (error) {
            console.error('Error fetching contacts', error);
            setLoading(false);
        }
    };
    const getmsgs = async (chatId) => {
        try {
            const data = await getmessages(chatId);
            if (Array.isArray(data)) {
                setMessage(data);
            } else if (data && Array.isArray(data.messages)) {
                setMessage(data.messages);
            } else {
                console.error('Invalid data structure for messages:', data);
            }
        } catch (error) {
            console.error('Error fetching messages', error);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(async () => {
            // Call the getmsgs function with the selected chatId
            if (selectedChat) {
                await getmsgs(receiverId);
            }
        }, 4000); // Adjust the interval duration (in milliseconds) as needed

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [selectedChat]);


    useEffect(() => {
        getchatcontacts();
    }, []);

    const [selectedFiles, setSelectedFiles] = useState([]);

    const messageBoxRef = useRef(null);

    const handleChatClick = function (chatId, chat) {
        setSelectedChat(chat);
        getmsgs(chatId);
        setReceiverId(chatId);
        setChatSelected(true);  // Optionally, you may set the chat as selected when clicking on it
    };

    useEffect(() => {
        // Scroll to the bottom when component mounts or when content changes
        scrollToBottom();
    }, [chats, selectedChat, message]);  // Add 'message' as a dependency to trigger a scroll when new messages are received

    const scrollToBottom = () => {
        if (messageBoxRef.current) {
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' && (selectedFiles?.length ?? 0) === 0) {
            console.log("1");
            return;
        }

        // Create new messages for both text and files
        const newMessages = [];

        if (newMessage.trim() !== '') {
            console.log("2");
            newMessages.push({ id: selectedChat?.messages?.length + 1 || 1, text: newMessage, sender: 'you' });
        }

        if ((selectedFiles?.length ?? 0) > 0) {
            console.log("3");

            for (const file of selectedFiles) {
                newMessages.push({ id: selectedChat?.messages?.length + 1 || 1, file: file, sender: 'you' });
            }
        }

        // Update state with the new messages
        setChats(prevChats => {
            const updatedChats = prevChats.map(chat => {
                if (chat.id === selectedChat.id) {
                    return {
                        ...chat,
                        messages: [...(chat.messages || []), ...newMessages]
                    };
                }
                return chat;
            });
            return updatedChats;
        });

        // Clear the message and selected files
        setNewMessage('');
        setSelectedFiles([]);

        // Send messages through API or socket
        for (const message of newMessages) {
            try {
                if (message.text) {
                    // Send text message through API
                    await sendMessage(senderId, receiverId, message.text, getmsgs);
                } else if (message.file) {
                    console.log("file", message.file)
                    await sendMessage(senderId, receiverId, message.file, getmsgs);
                    // Send file message through API
                    // Adjust this part based on your file sending mechanism
                }
            } catch (error) {
                console.error("Error sending message:", error);
                // Handle the error as needed
            }
        }
    };



    const handleDownload = async (filePath) => {
        // Extract the filename from the filePath
        const fileName = filePath.split('/').pop();
        console.log(fileName)
        try {
            const response = await axios({
                method: 'get',
                url: `${BASE_URL}/chat/download/${fileName}`,
                responseType: 'blob', // Specify responseType as 'blob' for binary data
            });

            // Create a blob from the response data
            const blob = new Blob([response.data]);

            // Create a link to trigger the download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
        } catch (error) {
            console.error('Error downloading file:', error);
            // Handle the error as needed
        }
    };


    const handleEnterPress = function (event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const removeSelectedFile = (fileIndex) => {
        const newSelectedFiles = [...selectedFiles];
        newSelectedFiles.splice(fileIndex, 1);
        setSelectedFiles(newSelectedFiles);
    };

    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <>
            <Box bg={bgColor} py={8} w="auto" minH="100vh">
                <Container maxW="container.xxl" justifySelf="center">
                    <Box
                        ml={{ base: 0, lg: sideBarWidth === "small" ? 14 : 60 }}
                        transition="margin 0.3s ease-in-out"
                    >
                        <Flex minH="80vh">
                            <Box
                                w="auto"
                                maxW="15rem"
                                bg="gray.100"
                                p={4}
                                borderRight="1px"
                                borderColor="gray.200"
                                display={{ base: "none", md: "block" }}
                            >
                                <Text fontSize={{ base: "sm", md: "xl" }} fontWeight="bold" mb={4}>
                                    All Chats
                                </Text>
                                <VStack align="start" spacing={2}>
                                    {chats.map(function (chat, index) {
                                        return (
                                            <HStack
                                                key={chat.id}
                                                p={2}
                                                borderRadius="lg"
                                                cursor="pointer"
                                                color="black"
                                                justify="center"
                                                align="center"
                                                onClick={function () {
                                                    handleChatClick(chat.id, chat);
                                                }}
                                            >
                                                <Avatar
                                                    size="sm"
                                                    name={chat.username}
                                                    src={`${BASE_URL}/${chat.profilePicture}`}
                                                />
                                                <Text
                                                    fontWeight={selectedChat === index ? 'semibold' : 'normal'}
                                                    mt={3}
                                                    fontSize={{ base: "xs", md: "sm", lg: "md" }}
                                                >
                                                    {chat.username}
                                                </Text>
                                            </HStack>
                                        );
                                    })}
                                </VStack>
                            </Box>


                            <Flex flex={1} direction="column" p={4}>
                                {selectedChat !== null ?
                                    (
                                        <>
                                            <Flex align="center">
                                                <IconButton
                                                    icon={<PiChatsFill />}
                                                    display={{ base: "flex", md: "none" }}
                                                    onClick={handleDrawerOpen}
                                                />


                                                <Text fontSize={{ base: "sm", md: "lg", lg: "xl" }} fontWeight="bold" mt={4} ml={2}>
                                                    {selectedChat.username}
                                                </Text>
                                            </Flex>
                                            <Box
                                                flex={1}
                                                p={4}
                                                borderWidth="1px"
                                                borderColor="gray.200"
                                                borderRadius="md"
                                                bg="white"
                                                overflowY="scroll"
                                                maxH="50vh"
                                                ref={messageBoxRef}
                                            >
                                                {message.map(function (message, index) {
                                                    return (
                                                        <Flex
                                                            key={message._id}
                                                            mb={2}
                                                            justify={message.sender == `${senderId}` ? 'end' : 'start'}
                                                        >
                                                            {message.filePath ? (
                                                                <Box
                                                                    bg={message.sender == senderId ? 'blue.200' : 'gray.200'}
                                                                    p={2}
                                                                    borderRadius={message.sender == senderId ? "10px 10px 10px 0px" : "10px 10px 0px 10px"}
                                                                    fontWeight="semibold"
                                                                    display="flex"
                                                                    alignItems="center"
                                                                >
                                                                    <a target="_blank" rel="noreferrer">
                                                                        {message.filePath.split('/').pop()}
                                                                    </a>
                                                                    <IconButton
                                                                        icon={<BsDownload />}
                                                                        size="xs"
                                                                        ml={2}
                                                                        onClick={() => handleDownload(message.filePath)}
                                                                    />
                                                                </Box>
                                                            ) : (
                                                                <Text
                                                                    bg={message.sender == `${senderId}` ? 'blue.200' : 'gray.200'}
                                                                    p={2}
                                                                    borderRadius={message.sender == `${senderId}` ? "10px 10px 10px 0px" : "10px 10px 0px 10px"}
                                                                    whiteSpace="pre-line"
                                                                    textAlign={message.sender == `${senderId}` ? "start" : "end"}
                                                                >
                                                                    {message.content}
                                                                </Text>
                                                            )}
                                                        </Flex>
                                                    );
                                                })}
                                            </Box>
                                            <Divider my={4} />
                                            <HStack>
                                                {selectedFiles.length > 0 ? (
                                                    <HStack
                                                        // bg="blue.200"
                                                        flex={1}
                                                        minH="100px"
                                                        justify="center"
                                                        align="center"
                                                        border="1px solid gray"
                                                        borderRadius="lg"
                                                    >
                                                        {selectedFiles.map((file, index) => (
                                                            <Box
                                                                key={index}
                                                                // h="90px"
                                                                my={4}
                                                                bg="gray.200"
                                                                borderRadius="lg"
                                                                position="relative"
                                                                // border="1px solid gray"
                                                                boxShadow="md"
                                                                maxW="8rem"

                                                            >
                                                                <CloseButton
                                                                    size="sm"
                                                                    colorScheme='red'
                                                                    color="red"
                                                                    justifySelf="end"
                                                                    alignSelf="end"
                                                                    _hover={{
                                                                        bg: "red.100"
                                                                    }}
                                                                    onClick={() => removeSelectedFile(index)}
                                                                />
                                                                <Text
                                                                    p={2}
                                                                    borderRadius="10px"
                                                                    whiteSpace="pre-line"
                                                                    textAlign="start"
                                                                    maxW={{ base: "5rem", md: "8rem" }}
                                                                    maxH={{ base: "40px", md: "60px" }}
                                                                    overflow="hidden"
                                                                    fontSize={{ base: "xs", md: "md" }}
                                                                >
                                                                    {file.name}
                                                                </Text>
                                                            </Box>
                                                        ))}
                                                    </HStack>
                                                ) : (
                                                    <Textarea
                                                        flex={1}
                                                        value={newMessage}
                                                        onChange={function (e) {
                                                            setNewMessage(e.target.value);
                                                        }}
                                                        onKeyPress={handleEnterPress}
                                                        placeholder="Enter Message"
                                                        minHeight="100px"
                                                        resize="none"
                                                        shadow="md"
                                                    />
                                                )}

                                                <VStack>
                                                    <IconButton
                                                        colorScheme="blue"
                                                        onClick={handleSendMessage}
                                                        disabled={!message && selectedFiles.length === 0}
                                                        icon={<BsSend />}
                                                    />
                                                </VStack>
                                            </HStack>
                                        </>
                                    ) : (
                                        <Center>
                                            <Flex direction="column" minH="80vh">
                                                <Heading mt={10}>
                                                    Please select a chat to open.
                                                </Heading>
                                                <Button
                                                    mt="30vh"
                                                    leftIcon={<PiChatsFill />}
                                                    variant="solid"
                                                    colorScheme="whatsapp"
                                                    display={{ base: "flex", md: "none" }}
                                                    onClick={handleDrawerOpen}
                                                >
                                                    Open Chats
                                                </Button>
                                            </Flex>
                                        </Center>
                                    )
                                }
                            </Flex>
                        </Flex>
                        <Drawer
                            isOpen={isDrawerOpen}
                            placement="left"
                            onClose={handleDrawerClose}
                        >
                            <DrawerOverlay>
                                <DrawerContent>
                                    <DrawerCloseButton />
                                    <DrawerHeader>All Chats</DrawerHeader>
                                    <DrawerBody >
                                        <VStack align="start" spacing={2}>
                                            {chats.map(function (chat, index) {
                                                return (
                                                    <HStack
                                                        key={chat.id}
                                                        p={2}
                                                        borderRadius="lg"
                                                        cursor="pointer"
                                                        color="black"
                                                        justify="center"
                                                        align="center"
                                                        onClick={function () {
                                                            handleChatClick(index);
                                                        }}
                                                    >
                                                        <Avatar
                                                            size="sm"
                                                            name={chat.name}
                                                        />
                                                        <Text
                                                            fontWeight={selectedChat === index ? 'semibold' : 'normal'}
                                                            mt={3}
                                                            fontSize={{ base: "xs", md: "md" }}
                                                        >
                                                            {chat.name}
                                                        </Text>
                                                    </HStack>
                                                );
                                            })}
                                        </VStack>
                                    </DrawerBody>
                                </DrawerContent>
                            </DrawerOverlay>
                        </Drawer>
                    </Box>
                </Container>
            </Box>
        </>

    );
};

export default ChatHome;
