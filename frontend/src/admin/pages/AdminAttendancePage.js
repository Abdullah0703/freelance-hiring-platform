// src\admin\pages\AdminEmployeesPage.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Center,
  Container,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import EmployeeList from "../components/employees/EmployeeList";
import { getAllEmployees } from "../../API/api";


const AdminEmployeesPage = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState([]); // State to hold employees data
  // ... (other state declarations)

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const employeesData = await getAllEmployees();
        setEmployees(employeesData); // Set the fetched employees data in state
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []); // Fetch employees data when the co

  const handleAddOrUpdateEmployee = async () => {
    setIsLoading(true);
    try {
      const employeesData = await getAllEmployees();
      setEmployees(employeesData); // Set the fetched employees data in state
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg={bgColor} py={8} minH="100vh">
      <Container maxW="container.xl" mr="0">
        <Heading as="h1" size="xl" mb={4}>
          Attendance Managements
        </Heading>
        {isLoading ? ( // Display loader when isLoading is true
          <Center>
            <div className="loader">
              <div className="cover"></div>
            </div>
          </Center>
        ) : (
          <EmployeeList employees={employees.employees} handleAddOrUpdateEmployee={handleAddOrUpdateEmployee} />
        )}
      </Container>
    </Box>
  );
};

export default AdminEmployeesPage;
