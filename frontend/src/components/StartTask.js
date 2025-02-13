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

function StartTask({ isOpen, onClose, onConfirmStart, pending, inProgress }) {
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
                        {inProgress ? "Complete Task" : "Start Task"}

                    </AlertDialogHeader>

                    <AlertDialogBody>
                        {inProgress ? "Are you sure you want to complete this task?" : "Are you sure you want to start this task?"}


                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button onClick={onClose} isDisabled={btnLoading}>Cancel</Button>
                        <Button
                            colorScheme="green"
                            onClick={() => {
                                onConfirmStart();
                                setBtnLoading(true);
                            }}
                            ml={3}
                            isLoading={btnLoading}
                        >
                           {inProgress ? "Complete" : "Start"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}

export default StartTask;
