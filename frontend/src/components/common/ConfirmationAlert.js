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
function ConfirmationAlert({
    isOpen,
    onClose,
    onConfirm,
    HeaderText,
    BodyText,
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    confirmButtonColorScheme = "red",
}) {
    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={undefined} onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {HeaderText}
                    </AlertDialogHeader>

                    <AlertDialogBody>{BodyText}</AlertDialogBody>

                    <AlertDialogFooter>
                        <Button onClick={onClose} colorScheme="gray" variant="outline">
                            {cancelButtonText}
                        </Button>
                        <Button colorScheme={confirmButtonColorScheme} onClick={onConfirm} ml={3}>
                            {confirmButtonText}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}

export default ConfirmationAlert;
