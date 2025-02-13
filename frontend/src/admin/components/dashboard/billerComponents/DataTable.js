import React, { useEffect, useState } from "react";
import {
  Text,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Button,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { getAllJobs } from "../../../../API/job";
// const DataTable = ({ title, buttonLabel }) => {
//   const [jobs, setJobs] = useState([]);
//   const bgColor = useColorModeValue("white", "gray.700");
//   const borderColor = useColorModeValue("gray.200", "gray.600");

//   useEffect(() => {
//     const fetchJobs = async () => {
//       const data = await getAllJobs();
//       console.log("Fetched jobs data:", data);
//       setJobs(data.jobs || []); // Ensure to set an empty array if data.jobs is undefined
//     };

//     fetchJobs();
//   }, []); // Empty dependency array ensures this runs once when component mounts

//   return (
//     <TableContainer
//       bg={bgColor}
//       borderWidth="1px"
//       borderColor={borderColor}
//       borderRadius="lg"
//       pt={6}
//       pb={10}
//       shadow="md"
//       textAlign="center"
//       minH={'100%'}
//       overflowX="auto"
//       transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
//       _hover={{ transform: "scale(1.01)", boxShadow: "lg" }}
//     >
//       <SimpleGrid columns={2} justifyContent="space-between" mb={4} px={4}>
//         <Text fontSize="xl" fontWeight="semibold" mb={2} align={"left"}>
//           {title}
//         </Text>
//         <GridItem colSpan={1 / 3} style={{ justifySelf: "end" }}>
//           <Link to='/jobs'>
//             <Button variant="solid" colorScheme="whatsapp" color={'white'} size={{ base: "sm" }}>
//               {buttonLabel}
//             </Button>
//           </Link>
//         </GridItem>
//       </SimpleGrid>
//       <Table variant="simple" size={'md'}>
//         <Thead>
//           <Tr bg="gray.100" color="white">
//             <Th>Job #</Th>
//             <Th>Title</Th>
//             <Th>Description</Th>
//             <Th>Duration</Th>
//           </Tr>
//         </Thead>
//         <Tbody>
//           {jobs.length > 0 ? (
//             jobs.map((item, index) => (
//               <Tr key={index}>
//                 <Td>{item.jobId}</Td>
//                 <Td>{item.title}</Td>
//                 <Td>{item.description}</Td>
//                 <Td>{item.duration}</Td>
//               </Tr>
//             ))
//           ) : (
//             <Tr>
//               <Td colSpan="3" style={{ textAlign: 'center' }}>No jobs available</Td>
//             </Tr>
//           )}
//         </Tbody>
//       </Table>
//     </TableContainer>
//   );
// };
const DataTable = ({ title, buttonLabel }) => {
  const [jobs, setJobs] = useState([]);
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs(); // Fetch jobs
        console.log("Fetched jobs data:", data);
        setJobs(data.jobs || []); // Set jobs data or an empty array if no jobs found
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]); // Handle error case and set an empty array
      }
    };

    fetchJobs();
  }, []);

  return (
    <TableContainer
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      pt={6}
      pb={10}
      shadow="md"
      textAlign="center"
      minH={'100%'}
      overflowX="auto"
      transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
      _hover={{ transform: "scale(1.01)", boxShadow: "lg" }}
    >
      <SimpleGrid columns={2} justifyContent="space-between" mb={4} px={4}>
        <Text fontSize="xl" fontWeight="semibold" mb={2} align={"left"}>
          {title}
        </Text>
        <GridItem colSpan={1 / 3} style={{ justifySelf: "end" }}>
          <Link to='/jobs'>
            <Button variant="solid" colorScheme="whatsapp" color={'white'} size={{ base: "sm" }}>
              {buttonLabel}
            </Button>
          </Link>
        </GridItem>
      </SimpleGrid>
      <Table variant="simple" size={'md'}>
        <Thead>
          <Tr bg="gray.100" color="white">
            <Th>Job #</Th>
            <Th>Title</Th>
            <Th>Description</Th>
            <Th>Duration</Th>
          </Tr>
        </Thead>
        <Tbody>
          {jobs.length > 0 ? (
            jobs.map((item, index) => (
              <Tr key={index}>
                <Td>{item.jobId}</Td>
                <Td>{item.title}</Td>
                <Td>{item.description}</Td>
                <Td>{item.duration}</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="4" style={{ textAlign: 'center' }}>No jobs available for this biller</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
