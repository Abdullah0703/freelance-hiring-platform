import { Card, Flex, Icon, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { FaBriefcase, FaUser } from 'react-icons/fa';
import { IoTicketSharp } from "react-icons/io5";

const iconMap = {
    'Total Billers': FaUser,
    'Total Clients': FaUser,
    'Total Jobs': FaBriefcase,
    'Support Tickets': IoTicketSharp
};

const AdminCard = ({ title, value, iconColor = "blue.500", linktext }) => {
    const IconComponent = iconMap[title];
    const handleLinkClick = (event) => {
        event.preventDefault(); // Prevent default anchor tag behavior
        if (linktext === "View Billers") {
            window.location.href = "/billers"
        } else if (linktext === "View Clients") {
            window.location.href = "/clients";
        } else if (linktext === "View Tickets") {
            window.location.href = "/support"
        }
        else {
            window.location.href = "/jobs";
        }
    };

    return (
        <Card
            p={4}
            bg="white"
            shadow="lg"
            borderRadius="lg"
            position="relative"
            transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
            _hover={{ transform: "scale(1.05)", shadow: "xl" }}
        >
            <Flex justify="space-between" align="center" mb={2}>
                <Text fontSize="lg">{title}</Text>
                {IconComponent && (
                    <Icon
                        as={IconComponent}
                        w={6}
                        h={6}
                        color={iconColor}
                        position="absolute"
                        top={4}
                        right={4}
                    />
                )}
            </Flex>
            <Text fontSize="2xl" fontWeight="bold">{value}</Text>
            <Link
                href="#"
                color="green.500"
                fontSize="sm"
                position="absolute"
                bottom={4}
                right={4}
                _hover={{ textDecoration: "underline" }}
                onClick={handleLinkClick}
            >
                {linktext}
            </Link>
        </Card>
    );
};

export default AdminCard;
