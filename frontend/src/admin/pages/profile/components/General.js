import React, { useState, useEffect } from "react";
import { SimpleGrid, Text, useColorModeValue, Button, Box, useToast } from "@chakra-ui/react";
import { Card } from "./Card";
import { Information } from "./Information";
import { updateUser } from "../../../../API/userprofile";

export function GeneralInformation(props) {
  const { ...rest } = props;
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    phoneNumber: false,
    skills: false
  });
  const [editValues, setEditValues] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    skills: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null); 
  const toast = useToast();

  useEffect(() => {
    // Load user data from local storage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setEditValues({
        name: storedUser.userName,
        email: storedUser.email,
        phoneNumber: storedUser.phoneNumber,
        skills: storedUser.skills
      });
    } else {
      console.error("No user data found in local storage.");
    }
  }, []);

  const handleEdit = (field) => {
    setIsEditing(prevState => ({
      ...prevState,
      [field]: true
    }));
  };

  const handleChange = (e, field) => {
    setEditValues(prevValues => ({
      ...prevValues,
      [field]: e.target.value
    }));
  };

  const handleSave = async () => {
    if (!user) return; // Early exit if user is not available

    setIsLoading(true);
    try {
      // Update user information
      console.log("User data: ",user ,"user id ",user.userId ,"edit values: ",editValues);
      await updateUser(user.userId, editValues);

      // Update local storage
      const updatedUser = {
        ...user,
        userName: editValues.name,
        email: editValues.email,
        phoneNumber: editValues.phoneNumber,
        skills: editValues.skills
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "Update Successful.",
        description: "Your information has been updated.",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });

      setUser(updatedUser);
    } catch (error) {
      toast({
        title: "Update Failed.",
        description: "There was an error updating your information.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setIsEditing({
        name: false,
        email: false,
        phoneNumber: false,
        skills: false
      });
    }
  };

  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  if (!user) return <Text>Loading...</Text>; // Handle loading state

  return (
    <Card mb={{ base: "0px", "2xl": "20px" }} {...rest}>
      <Text
        color={textColorPrimary}
        fontWeight='bold'
        fontSize='2xl'
        mt='10px'
        mb='4px'
      >
        General Information
      </Text>
      <Text color={textColorSecondary} fontSize='md' me='26px' mb='40px'>
        Welcome to your profile! Here, you'll find a snapshot of your essential information and key details. From personal insights to professional achievements, this space is designed to keep you informed and empowered.
      </Text>
      <SimpleGrid columns='2' gap='20px'>
        <Information
          boxShadow={cardShadow}
          title='Name'
          value={editValues.name}
          isEditing={isEditing.name}
          onEdit={() => handleEdit('name')}
          onChange={(e) => handleChange(e, 'name')}
        />
        <Information
          boxShadow={cardShadow}
          title='Email'
          value={editValues.email}
          isEditing={isEditing.email}
          onEdit={() => handleEdit('email')}
          onChange={(e) => handleChange(e, 'email')}
        />
        <Information
          boxShadow={cardShadow}
          title='Contact No.'
          value={editValues.phoneNumber}
          isEditing={isEditing.phoneNumber}
          onEdit={() => handleEdit('phoneNumber')}
          onChange={(e) => handleChange(e, 'phoneNumber')}
        />
        {user.role === 'ADMIN' && (
          <Information
            boxShadow={cardShadow}
            title='Role'
            value={user.role}
          />
        )}
        {user.role === 'BILLER' && (
          <Information
            boxShadow={cardShadow}
            title='Skills'
            value={editValues.skills}
            isEditing={isEditing.skills}
            onEdit={() => handleEdit('skills')}
            onChange={(e) => handleChange(e, 'skills')}
          />
        )}
      </SimpleGrid>
      <Box mt={4} textAlign="right">
        <Button
          colorScheme="whatsapp"
          onClick={handleSave}
          isLoading={isLoading}
          loadingText="Saving"
        >
          Save Changes
        </Button>
      </Box>
    </Card>
  );
}
