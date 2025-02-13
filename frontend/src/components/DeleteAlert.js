import React, { useState, useEffect } from 'react';
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from '@chakra-ui/react';

function DeleteAlert({ isOpen, onClose, onConfirmDelete, HeaderText, BodyText }) {
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBtnLoading(false);
    }
  }, [isOpen]);

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={undefined} onClose={onClose} isCentered closeOnOverlayClick={false}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {HeaderText}
          </AlertDialogHeader>

          <AlertDialogBody>
            {BodyText}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onClose} isDisabled={btnLoading}>Cancel</Button>
            <Button
              colorScheme="red"
              onClick={() => {
                onConfirmDelete();
                setBtnLoading(true);
              }}
              ml={3}
              isLoading={btnLoading}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default DeleteAlert;
