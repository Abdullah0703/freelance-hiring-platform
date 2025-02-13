// src\components\common\DeleteAlert.jsx
import React from 'react';
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from '@chakra-ui/react';

function DeleteAlert({ isOpen, onClose, onConfirmDelete ,HeaderText ,BodyText }) {
  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={undefined} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {HeaderText}
          </AlertDialogHeader>

          <AlertDialogBody>
            {BodyText}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme="red" onClick={onConfirmDelete} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default DeleteAlert;
