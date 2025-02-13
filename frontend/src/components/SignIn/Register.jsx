import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
  useColorMode,
  Image,
  InputRightElement,
  IconButton,
  InputGroup,
  useToast,
} from "@chakra-ui/react";

// Assets
import signInImage from "./signInImage.png";
import LogoWhite from "../../images/logo.png";
import LogoBlack from "../../images/logo.png";
import { FaCommentsDollar, FaEye, FaEyeSlash } from "react-icons/fa";
import GradientBorder from "./GradientBorder";
import { signupUser } from "../../API/auth";
import { Link } from "react-router-dom";


const Register = () => {
  const { colorMode } = useColorMode();
  const logo = colorMode === "light" ? LogoBlack : LogoWhite;
  const titleColor = useColorModeValue("black", "white");
  const textColor = useColorModeValue("black", "white");
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("CLIENT");
  const [btnLoading, setBtnLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      userName,
      address,
      email,
      password,
      phoneNumber,
      role,
    };

    try {
      setBtnLoading(true);
      console.log(data)
      const response = await signupUser(data);
      toast({
        title: "Registration Successful",
        description: "You have successfully registered",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      setBtnLoading(false);
      setTimeout(() => {

      }, 3000);
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Error Registering",
        description: error.response.data.error || "Registration Failed",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      setBtnLoading(false);
    }
  };

  return (
    <Flex position="relative" bg={bgColor}>
      <Flex
        minH="max-content"
        h={{ base: "120vh", lg: "fit-content" }}
        w="100%"
        maxW="1044px"
        mx="auto"
        pt={{ sm: "100px", md: "0px" }}
        flexDirection="column"
        me={{ base: "auto", lg: "50px", xl: "auto" }}
      >
        <Flex
          alignItems="center"
          justifyContent="start"
          style={{ userSelect: "none" }}
          mx={{ base: "auto", lg: "unset" }}
          ms={{ base: "auto", lg: "auto" }}
          w={{ base: "100%", md: "50%", lg: "450px" }}
          px="50px"
        >
          <Flex
            direction="column"
            w="100%"
            background="transparent"
            mt={{ base: "25px", md: "25px", lg: "25px", xl: "25px" }}
            mb={{ base: "100px", md: "100px", lg: "100px", xl: "100px" }}
          >
            <form onSubmit={handleSubmit}>
              <Image mt={20} mb={15} src={logo} />
              <Heading color={titleColor} fontSize="32px" mb="10px">
                Register
              </Heading>
              <Text
                mb="36px"
                ms="4px"
                color={textColor}
                fontWeight="bold"
                fontSize="14px"
              >
                Enter your details to register
              </Text>
              <FormControl>
                <FormLabel
                  ms="4px"
                  fontSize="sm"
                  fontWeight="normal"
                  color={textColor}
                >
                  User Name
                </FormLabel>
                <GradientBorder
                  mb="24px"
                  w={{ base: "100%", lg: "fit-content" }}
                  borderRadius="20px"
                >
                  <Input
                    color={textColor}
                    bg={bgColor}
                    border="transparent"
                    borderRadius="20px"
                    fontSize="sm"
                    size="lg"
                    w={{ base: "100%", md: "346px" }}
                    maxW="100%"
                    h="46px"
                    placeholder="Enter your username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </GradientBorder>
              </FormControl>
              <FormControl>
                <FormLabel
                  ms="4px"
                  fontSize="sm"
                  fontWeight="normal"
                  color={textColor}
                >
                  Address
                </FormLabel>
                <GradientBorder
                  mb="24px"
                  w={{ base: "100%", lg: "fit-content" }}
                  borderRadius="20px"
                >
                  <Input
                    color={textColor}
                    bg={bgColor}
                    border="transparent"
                    borderRadius="20px"
                    fontSize="sm"
                    size="lg"
                    w={{ base: "100%", md: "346px" }}
                    maxW="100%"
                    h="46px"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </GradientBorder>
              </FormControl>
              <FormControl>
                <FormLabel
                  ms="4px"
                  fontSize="sm"
                  fontWeight="normal"
                  color={textColor}
                >
                  Email
                </FormLabel>
                <GradientBorder
                  mb="24px"
                  w={{ base: "100%", lg: "fit-content" }}
                  borderRadius="20px"
                >
                  <Input
                    color={textColor}
                    bg={bgColor}
                    border="transparent"
                    borderRadius="20px"
                    fontSize="sm"
                    size="lg"
                    w={{ base: "100%", md: "346px" }}
                    maxW="100%"
                    h="46px"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </GradientBorder>
              </FormControl>
              <FormControl>
                <FormLabel
                  ms="4px"
                  fontSize="sm"
                  fontWeight="normal"
                  color={textColor}
                >
                  Password
                </FormLabel>
                <GradientBorder
                  mb="24px"
                  w={{ base: "100%", lg: "fit-content" }}
                  borderRadius="20px"
                >
                  <InputGroup>
                    <Input
                      color={textColor}
                      bg={bgColor}
                      border="transparent"
                      borderRadius="20px"
                      fontSize="sm"
                      size="lg"
                      w={{ base: "100%", md: "346px" }}
                      maxW="100%"
                      h="46px"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <IconButton
                        size="md"
                        bg={bgColor}
                        onClick={handleTogglePassword}
                        icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                      />
                    </InputRightElement>
                  </InputGroup>
                </GradientBorder>
              </FormControl>
              <FormControl>
                <FormLabel
                  ms="4px"
                  fontSize="sm"
                  fontWeight="normal"
                  color={textColor}
                >
                  Phone Number
                </FormLabel>
                <GradientBorder
                  mb="24px"
                  w={{ base: "100%", lg: "fit-content" }}
                  borderRadius="20px"
                >
                  <Input
                    color={textColor}
                    bg={bgColor}
                    border="transparent"
                    borderRadius="20px"
                    fontSize="sm"
                    size="lg"
                    w={{ base: "100%", md: "346px" }}
                    maxW="100%"
                    h="46px"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </GradientBorder>
              </FormControl>
              <Button
                id="register-button"
                variant="solid"
                colorScheme="whatsapp"
                fontSize="md"
                type="submit"
                w="100%"
                maxW="350px"
                h="45"
                mb="20px"
                mt="20px"
                isLoading={btnLoading}
              >
                REGISTER
              </Button>

              <Button
                as={Link}
                to="/"
                variant="solid"
                colorScheme="blue"
                fontSize="md"
                w="100%"
                maxW="350px"
                h="45"
                mb="20px"
                mt="20px"
              >
                SIGN IN
              </Button>
            </form>
          </Flex>
        </Flex>
        <Box
          display={{ base: "none", lg: "block" }}
          overflowX="hidden"
          h="100%"
          maxW={{ md: "50vw", lg: "50vw" }}
          minH="100vh"
          w="960px"
          position="absolute"
          left="0px"
        >
          <Box
            bgImage={signInImage}
            w="100%"
            h="100%"
            bgSize="cover"
            bgPosition="50%"
            position="absolute"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Text
              textAlign="center"
              color="transparent"
              letterSpacing="8px"
              fontSize="36px"
              fontWeight="bold"
              bgClip="text !important"
              bg="linear-gradient(94.56deg, #FFFFFF 79.99%, #21242F 102.65%)"
            >
              DR Billerz
            </Text>
            <Text
              mt={10}
              textAlign="center"
              color="white"
              letterSpacing="8px"
              fontSize="14px"
              fontWeight="500"
            ></Text>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Register;
