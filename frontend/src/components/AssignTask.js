import React, { useState, useEffect } from 'react';
import {
    Button,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Input,
    Stack,
    useToast,
} from '@chakra-ui/react';

import { assignTask } from '../API/task';


let userId = 0;

const user = JSON.parse(localStorage.getItem("user"));


if (user) {
    userId = user.userId
}




function AssignTask({ isOpen, onClose, HeaderText, BodyText, taskId, fetchTasks }) {
    const [btnLoading, setBtnLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [employees, setEmployees] = useState([]);
    const [assignedTo, setAssignedTo] = useState(null);

    const toast = useToast();

    useEffect(() => {
        if (isOpen) {
            // Load employees when modal is opened
            // fetchEmployees();
        }
    }, [isOpen]);

    // const fetchEmployees = async () => {
    //     try {
    //         // Call the getAllEmployees function to fetch employees
    //         const data = await getAllEmployees();
    //         console.log(data.employees);
    //         setEmployees(data.employees); // Set employees state
    //     } catch (error) {
    //         console.error('Error fetching employees:', error);
    //     }
    // };

    const handleAssignTask = async () => {
        try {
            setBtnLoading(true);

            console.log(assignedTo, taskId, userId)
            // Call the onAssignTask function with assignedTo and other necessary parameters
            await assignTask(assignedTo, userId, taskId);

            toast({
                title: "Task Assigned",
                description: `This task has been assigned sucessfully.`,
                status: "success",
                position: "top-right",
                duration: 3000,
                isClosable: true,
            });
            fetchTasks();
            onClose();
            setBtnLoading(false);

        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message === 'Task already assigned to the user') {
                // Display toast indicating that the task is already assigned to the user
                toast({
                    title: "Error Assigning task",
                    description: "Task already assigned to this user",
                    status: "error",
                    position: "top-right",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                // Display generic error toast if other errors occur
                console.error('Error assigning task:', error);
                toast({
                    title: "Error Assigning task",
                    description: "Please try again",
                    status: "error",
                    position: "top-right",
                    duration: 3000,
                    isClosable: true,
                });
            }
            setBtnLoading(false);

        }
    };

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={undefined} onClose={onClose} isCentered closeOnOverlayClick={false}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {HeaderText}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <Stack spacing={3}>
                            {/* Search bar */}
                            <Input
                                placeholder="Search employees"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {/* Display filtered employees */}
                            // Display filtered employees, excluding those with role 'admin'
                            {employees
                                .filter((employee) =>
                                    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                                    employee.role !== 'admin'
                                )
                                .map((employee) => (
                                    <Button
                                        key={employee.id}
                                        variant="outline"
                                        onClick={() => setAssignedTo(employee.userId)}
                                        colorScheme={assignedTo === employee.userId ? 'blue' : 'gray'}
                                    >
                                        {employee.name}
                                    </Button>
                                ))}

                        </Stack>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button onClick={onClose} isDisabled={btnLoading}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="green"
                            onClick={handleAssignTask}
                            ml={3}
                            isLoading={btnLoading}
                            isDisabled={!assignedTo}
                        >
                            Assign
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}

export default AssignTask;
