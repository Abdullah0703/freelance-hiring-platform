// Chakra imports
import { Box, Container, Grid, Heading, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { Banner } from "./components/Banner"
import { GeneralInformation } from "./components/General"
// Assets
import banner from "../../../images/banner.png"
import React from "react";

import { BASE_URL, user } from '../../../API/constants'

export default function Overview({ sideBarWidth }) {
  const bgColor = useColorModeValue("gray.100", "gray.700");

  return (

    <Box py={8} w="auto" minH="100vh">
      <Container maxW="container.xxl" justifySelf="center">
        <Box
          ml={{ base: 0, lg: sideBarWidth === "small" ? 14 : 60 }}
          transition="margin 0.3s ease-in-out"
        >
          <Box ml={5}>
            <Heading as="h1" size="xl" mb={4}>
              Profile
            </Heading>
            <Grid>
              <Banner
                gridArea='2'
                banner={banner}
                avatar={`${BASE_URL}/uploads/profile/${user.profilePicture}`}
                name={user.fname}
                job={user.designation}
                userId={user.userId}
              />
            </Grid>
            <Grid
            >
              <GeneralInformation
                gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
                minH='365px'
                pe='20px'
              />
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
