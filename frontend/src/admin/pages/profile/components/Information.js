import React from "react";
import { Box, Text, useColorModeValue, Input } from "@chakra-ui/react";

export function Information({ title, value, isEditing, onEdit, onChange }) {
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const bg = useColorModeValue("gray.100", "navy.700");
  // Determine input type based on the title
  const inputType = title === "Contact No." ? "number" : "text";
  return (
    <Box
      borderRadius={10}
      p={4} // Adjust the padding as needed
      bg={bg}
    >
      <Text fontWeight='500' color={textColorSecondary} fontSize='sm'>
        {title}
      </Text>
      {isEditing ? (
        <Input
          value={value}
          onChange={onChange}
          mt={2}
          size='sm'
          type={inputType} // Use the dynamic type here
          min={0} // Optional: Prevent negative numbers
        />
      ) : (
        <Text color={textColorPrimary} fontWeight='500' fontSize='md' onClick={onEdit}>
          {value}
        </Text>
      )}
    </Box>
  );
}
