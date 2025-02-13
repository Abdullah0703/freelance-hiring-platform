import {
    Box,
    Container,
    useColorModeValue
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BillerProfile from "./component/BillerProfile";
import Loading from "../../../components/Loading/Loading";

const Attendance = ({ sideBarWidth }) => {
    const [billerData, setBillerData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const bgColor = useColorModeValue("gray.100", "gray.700");
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

        const fetchData = () => {
            const billerFromState = location.state?.biller;
            if (billerFromState) {
                setBillerData(billerFromState);
                localStorage.setItem("selectedBiller", JSON.stringify(billerFromState));
                setIsLoading(false);
            } else {
                const storedBiller = localStorage.getItem("selectedBiller");
                if (storedBiller) {
                    setBillerData(JSON.parse(storedBiller));
                }
                setIsLoading(false);
            }
        };

        if (isMounted) {
            fetchData();
        }

        // Cleanup function
        return () => {
            isMounted = false;
            setIsLoading(false);
        };
    }, [location.state]);

    return (
        <Box bg={bgColor} py={8} w="auto" minH="100vh">
            <Container maxW="container.xxl" justifySelf="center">
                <Box
                    ml={{ base: 0, lg: sideBarWidth === "small" ? 14 : 60 }}
                    transition="margin 0.3s ease-in-out"
                >
                    {isLoading ? (
                        <Loading /> // Display loading component
                    ) : billerData ? (
                        <BillerProfile billerProfileData={billerData} />
                    ) : (
                        <p>No biller data available</p>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default Attendance;