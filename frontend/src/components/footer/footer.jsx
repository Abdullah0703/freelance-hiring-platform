import { Box, Text, useColorModeValue } from "@chakra-ui/react";

const Footer = () => {
    const bgColor = useColorModeValue("white", "gray.700");
    return (
    <Box bg={bgColor} p={4} bottom="0" width="100%" >
      {/* <Text textAlign="center" color="gray.600" fontWeight="bold">
        Designed and developed by{" "}
        <Link
          color="blue.500"
          href="https://www.cognisoftlabs.com" // Replace with your desired website URL
          target="_blank" // Open link in a new tab
          rel="noopener noreferrer" // Recommended for security
        >
          Cognisoft Labs
        </Link>
      </Text> */}
      <Text textAlign="center" color="gray.600" fontWeight="bold">
        Copyright © 2024
      </Text>
    </Box>
  );
};

export default Footer;
