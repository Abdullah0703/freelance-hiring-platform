import { ChatIcon } from "@chakra-ui/icons";
import { Stack, Heading, Divider, Avatar, Box, CloseButton, Drawer, DrawerContent, Flex, HStack, Icon, IconButton, Image, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useColorMode, useColorModeValue, useDisclosure, VStack } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { BiSupport } from "react-icons/bi";
import {
  FiChevronDown,
  FiHome,
  FiMenu,
  FiMessageSquare,
} from "react-icons/fi";
import { BASE_URL } from "../../API/constants";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { PiBriefcaseBold, PiChartBar, PiHouseBold, PiUserBold, PiUsersBold } from "react-icons/pi";
import { SiPagespeedinsights } from "react-icons/si";
import { Link, useLocation } from 'react-router-dom';
import { SearchIcon } from "@chakra-ui/icons";
import NotificationsMenu from '../../admin/pages/notification/NotificationsMenu';
import { user } from '../../API/constants';
import './scrollbar.css';

const LogoBlack = require("../../images/logo.png");
const LogoWhite = require("../../images/logo.png");

let userId = 0;

const currentUser = JSON.parse(localStorage.getItem("user"));
const role = localStorage.getItem("role");

if (currentUser) {
  userId = currentUser.userId
}

let LinkItems = [
  { name: "Overview", icon: PiHouseBold, to: "/dashboard" },
  { name: "My Jobs", icon: PiBriefcaseBold, to: "/jobs" },
  { name: "Jobs", icon: PiBriefcaseBold, to: "/jobs" },
  { name: "My Billers", icon: FiHome, to: "/billers" },
  { name: "Billers", icon: PiUsersBold, to: "/billers" },
  { name: "Reports", icon: SiPagespeedinsights, to: "/reports" },
  { name: "Clients", icon: PiUsersBold, to: "/clients" },
  { name: "Productivity", icon: PiChartBar, to: "/task" },
  { name: "Assignment", icon: FiHome, to: "/task" },
  { name: "Invoices", icon: FiHome, to: "/" },
  // { name: "Attendance", icon: FiUserCheck, to: `/attendance/user/${userId}` },
  // { name: "Attendances", icon: FiUserCheck, to: "/attendance" },
  // { name: "Resumes", icon: FiFile, to: "/resume" },
  // { name: "Upload Resume", icon: FiFile, to: "/resumeupload"},
  // { name: "Chat", icon: FiMessageSquare, to: "/chat" },
  { name: "Support", icon: BiSupport, to: "/support" },
  { name: "Profile", icon: PiUserBold, to: "/profile" },
];

if (role) {
  if (role === "BILLER") {
    LinkItems = LinkItems.filter(
      (item) =>
        item.name === "Overview" ||
        item.name === "Clients" ||
        item.name === "Jobs" ||
        item.name === "Productivity" ||
        item.name === "Profile"
      // item.name === "Chat"
    )
  } else if (role === "CLIENT") {
    LinkItems = LinkItems.filter(
      (item) =>
        item.name === "Overview" ||
        item.name === "Billers" ||
        item.name === "Jobs" ||
        item.name === "Productivity" ||
        item.name === "Profile" ||
        // item.name === "Chat" ||
        item.name === "Support"
    )
  } else if (role === "ADMIN") {
    LinkItems = LinkItems.filter(
      (item) =>
        item.name === "Overview" ||
        item.name === "Billers" ||
        item.name === "Clients" ||
        item.name === "Jobs" ||
        // item.name === "Productivity" ||P
        item.name === "Reports" ||
        item.name === "Profile" ||
        // item.name === "Chat" ||
        item.name === "Support"
    )

  }
  else {
    const itemsToExclude = ["Attendance"]
    LinkItems = LinkItems.filter(item => !itemsToExclude.includes(item.name));
  }
}

if (role === "CLIENT") {
  LinkItems = LinkItems.map(item => {
    if (item.name === "Billers") {
      return { ...item, name: "My Billers" };
    }
    if (item.name === "Clients") {
      return { ...item, name: "My Clients" };
    }
    return item;
  });
}


const handleLogout = () => {
  localStorage.clear();
  window.location.href = '/';
};


const SidebarContent = ({ sideBarWidth, handleSidebarWidth, onClose, ...rest }) => {
  const { colorMode } = useColorMode();
  const logo = colorMode === "light" ? LogoBlack : LogoWhite;
  const [searchTerm, setSearchTerm] = useState('');
  const filteredLinkItems = useMemo(() => {
    if (searchTerm.trim() === '') {
      return LinkItems;
    }
    return LinkItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);
  return (
    <Box
      transition=".3s ease-in-out"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={sideBarWidth === "small" ? "60px" : { base: 'full', lg: 60 }}
      pos="fixed"
      h="full"
      overflowY="scroll"
      css={{
        '&::-webkit-scrollbar': {
          display: 'none', // Hide scrollbar for WebKit-based browsers
        },
        scrollbarWidth: 'none', // Hide scrollbar for Firefox
        '-ms-overflow-style': 'none', // Hide scrollbar for IE and Edge
      }}
      overflowX="hidden"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx={2} justifyContent="space-between" >
        <IconButton
          icon={sideBarWidth === "small" ? <GoSidebarCollapse /> : <GoSidebarExpand />}
          variant="ghost"
          colorScheme='green'
          display={{ base: 'none', lg: 'flex' }}
          onClick={handleSidebarWidth}
        />
        <Link to="/"> 
          <Image
            src={logo}
            w={150}
            loading="lazy"
            display={sideBarWidth === "small" ? "none" : "block"}
            transition={"margin 0.3s ease-in-out"}
            cursor="pointer" 
          />
        </Link>
        <CloseButton display={{ base: 'flex', lg: 'none' }} onClick={onClose} />
      </Flex>

      <Box>
        <Divider display={sideBarWidth === "small" ? "none" : "block"} />
        <Box mb={5} p={2} display={sideBarWidth === "small" ? "block" : "block"}>
          <Flex align="center">
            <Link to="/profile"> {/* Wrap the Avatar in a Link */}
              <Avatar
                size={sideBarWidth === "small" ? "md" : "lg"}
                src={`${BASE_URL}/uploads/profile/${user.profilePicture}`}
                cursor="pointer" // Add a pointer cursor to indicate clickability
              />
            </Link>
            {sideBarWidth !== "small" && (
              <Stack ml={1.5} spacing={1}>
                <Heading fontSize="lg">{user.userName}</Heading>
                <Text color='gray' fontSize={"sm"}>{user.email}</Text>
              </Stack>
            )}
          </Flex>
        </Box>
      </Box>

      <Input
        placeholder='Search'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={3}
        display={sideBarWidth === "small" ? "none" : "block"}
        borderRadius="md" // Reduced border radius
        borderColor={useColorModeValue('gray.300', 'gray.600')}
        _focus={{
          borderColor: useColorModeValue('teal.500', 'teal.300'),
          boxShadow: '0 0 0 1px #38B2AC',
        }}
        _placeholder={{ color: useColorModeValue('gray.500', 'gray.400') }}
        p={2} // Reduced padding
        fontSize="sm" // Adjust if needed
        bg={useColorModeValue('white', 'gray.800')}
        transition="all 0.2s ease-in-out"
        width={sideBarWidth === "small" ? "auto" : "80%"} // Adjust width as needed
        maxWidth="500px" // Set a maximum width if needed
        ml={4}
      />
      {filteredLinkItems.map((link) => (
        <Link to={link.to} key={link.name}>
          <NavItem to={link.to} sideBarWidth={sideBarWidth} icon={link.icon}>
            {link.name}
          </NavItem>
        </Link>
      ))}
      {/* {LinkItems.map((link) => (
        <Link to={link.to} >

          <NavItem key={link.name} to={link.to} sideBarWidth={sideBarWidth} icon={link.icon}>
            {link.name}
          </NavItem>
        </Link>
      ))} */}
    </Box>
  );
};

const NavItem = ({ icon, children, to, sideBarWidth, ...rest }) => {
  const location = useLocation(); // Get the current location
  // Determine if the current link matches the current route
  const isActive = location.pathname === to;
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        ml={2}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? "#6de90f" : "none"}
        color={isActive ? "white" : "inherit"}
        _hover={{
          bg: '#6de90f',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Tooltip
            hasArrow
            shouldWrapChildren
            label={children}
            placement="right"
            bg="whatsapp"
            display={sideBarWidth === "small" ? "flex" : "none"}
          >
            <Icon
              mr="4"
              fontSize="16"
              as={icon}
            />
          </Tooltip>
        )}
        <Box display={sideBarWidth === "small" ? "none" : "block"}>
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, sideBarWidth, handleColorModeToggle, ...rest }) => {
  const { colorMode } = useColorMode();
  const logo = colorMode === "light" ? LogoBlack : LogoWhite;
  return (
    <Flex
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', lg: 'space-between' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', lg: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Flex >
        <Link to="/"> {/* Wrap the Image in a Link */}
          <Image
            src={logo}
            w={150}
            loading="lazy"
            ml={sideBarWidth === "large" ? "250px" : "70px"}
            display={{
              base: "none",
              lg: sideBarWidth === "small" ? "flex" : "none",
            }}
            transition={"margin 0.3s ease-in-out"}
            cursor="pointer"
          />
        </Link>
      </Flex>



      <HStack spacing={{ base: '0', md: '6' }}>
        {/* <Link to="/chat">
          <IconButton
            icon={<ChatIcon />}
            aria-label="Go to Chat"
            style={{ backgroundColor: "#fff" }}
            fontSize="xl"
          />
        </Link> */}
        <NotificationsMenu />
        <Flex alignItems={'center'}>

          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  src={`${BASE_URL}/uploads/profile/${user.profilePicture}`}
                  name={user?.userName || ""}
                  bg={useColorModeValue("gray.200", "gray.600")}
                  color={useColorModeValue("black", "white")}
                />
                <VStack display={{ base: 'none', md: 'flex' }} alignItems="flex-start" spacing="1px" ml="2">
                  <Text fontSize="sm" fontWeight={'bold'}>{user?.fname}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {user?.userName}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem>
                <Link to="/profile">Profile</Link>
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const SideBar = ({ sideBarWidth, handleSidebarWidth }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { toggleColorMode } = useColorMode(); // Fetch color mode and its toggle function

  const handleColorModeToggle = () => {
    // Toggle color mode based on the current colorMode
    toggleColorMode();
  };

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent sideBarWidth={sideBarWidth} handleSidebarWidth={handleSidebarWidth} onClose={() => onClose} display={{ base: 'none', md: 'none', lg: "block" }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="sm"
      >
        <DrawerContent>
          <SidebarContent sideBarWidth="large" onClose={onClose} onClick={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav sideBarWidth={sideBarWidth} onOpen={onOpen} handleColorModeToggle={handleColorModeToggle} onClose={onClose} />

    </Box>
  );
};

export default SideBar;
