import React from 'react'
import { Box, Container, Heading, useColorModeValue } from '@chakra-ui/react'

import WorkLogList from './component/WorkLogList';

const Task = ({ sideBarWidth }) => {
    const bgColor = useColorModeValue('gray.100', 'gray.700');

    return (
        <Box bg={bgColor} py={8} w="auto" minH="100vh">
            <Container maxW="container.xxl" justifySelf="center">
                <Box
                    ml={{ base: 0, lg: sideBarWidth === "small" ? 14 : 60 }}
                    transition="margin 0.3s ease-in-out"
                >
                    <Heading pb={2}>WorkLog</Heading>
                    {/* <Layout /> */}
                    {/* <AddWorkLog /> */}
                    <WorkLogList/>
                </Box>
            </Container>
        </Box>
    )
}

export default Task