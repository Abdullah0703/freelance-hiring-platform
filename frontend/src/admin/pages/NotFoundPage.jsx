import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { BsArrow90DegUp } from "react-icons/bs";

const NotFoundPage = () => {
  return (
    <Flex direction="column" align="center" justify="center" minH="80vh">
        <BiErrorCircle fontSize="5rem" color='red'/>
        <Heading mb={4}>Page Not Found</Heading>
        <Text>The page you're looking for doesn't exist.</Text>
        <Text>If you believe this is an error, please contact support.</Text>
        <Button as={Link} to="/" mt={10} variant="outline" colorScheme='green' leftIcon={<BsArrow90DegUp/>}>Go Back</Button>
    </Flex>
  )
}

export default NotFoundPage