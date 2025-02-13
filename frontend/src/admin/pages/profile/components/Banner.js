// Chakra imports
import { Avatar, Box, Button, Text, useColorModeValue, useToast } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { Card } from "./Card";
import { uploadProfilePicture } from "../../../../API/userprofile";

export function Banner(props) {
  const { banner, avatar, name, job, userId } = props; // Include userId in props
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const toastTitle = avatar ? "updated" : "uploaded";

  const fileInputRef = useRef(null);

  // Function to handle file input change and upload profile picture
  const handleFileChange = async (event) => {
    setIsLoading(true);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("profile", file);

    try {
       const response = await uploadProfilePicture(formData, userId);
      toast({
        title: `Profile picture ${toastTitle}`,
        description: `Your profile picture has been ${toastTitle} successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
      localStorage.removeItem('user')
      localStorage.setItem('user', JSON.stringify(response.user));
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      // Add any additional logic after successful upload
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      // Handle error if necessary
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card mb={{ base: "0px", lg: "20px" }} align="center">
      <Box
        bg={`url(${banner})`}
        bgSize="cover"
        borderRadius="16px"
        h="131px"
        w="100%"
      />
      <Avatar
        mx="auto"
        src={avatar}
        h="120px" // Increase the height
        w="120px" // Increase the width
        mt="-60px" // Adjust the margin-top for positioning
        border="4px solid"
        borderColor={borderColor}
      />

      <Text color={textColorPrimary} fontWeight="bold" fontSize="xl" mt="10px">
        {name}
      </Text>
      <Text color={textColorSecondary} fontSize="sm">
        {job}
      </Text>
      {/* Input field for uploading profile picture */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Button onClick={() => fileInputRef.current.click()} mt="10px" isLoading={isLoading}>
        {avatar ? "Update Profile Picture" : "Upload Profile Picture"}
      </Button>
    </Card>
  );
}
