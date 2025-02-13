import React from "react";
import { Box, Button, VStack, Link as ChakraLink, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const SupportCard = ({ data }) => {
    return (
        <Box
            direction="column"
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="lg"
            p={6}
            shadow="md"
        >
            <VStack align="left" spacing={4} mb={4}>
                <Text fontSize="xl" fontWeight="semibold">
                    Support
                </Text>
                <Button colorScheme="whatsapp" as={RouterLink} to={data.liveChatLink}>
                    Start Live Chat
                </Button>
            </VStack>

            <VStack align="left" spacing={4} mt={4}>
                <Text fontSize="lg" fontWeight="semibold">
                    FAQs and Resources:
                </Text>
                {data.faqsAndResources.map((faq, index) => (
                    <ChakraLink key={index} as={RouterLink} to={faq.link} color="blue.500">
                        {faq.title}
                    </ChakraLink>
                ))}
            </VStack>
        </Box>
    );
};

export default SupportCard;
