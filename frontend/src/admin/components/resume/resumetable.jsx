import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
} from '@chakra-ui/react';

const renderDetails = (details) => {
    if (typeof details === 'object' && !Array.isArray(details)) {
        return (
            <ul>
                {Object.entries(details).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {renderDetails(value)}
                    </li>
                ))}
            </ul>
        );
    }

    if (Array.isArray(details)) {
        return (
            <ul>
                {details.map((item, index) => (
                    <li key={index}>{renderDetails(item.name || item)}</li>
                ))}
            </ul>
        );
    }

    return details;
};

const ResumeTable = ({ resumeData }) => {
    return (
        <Table variant="simple" mt={4}>
            <TableCaption placement="top" fontSize="xl" fontWeight="bold">
                Resume Details
            </TableCaption>
            <Thead>
                <Tr>
                    <Th>Category</Th>
                    <Th>Details</Th>
                </Tr>
            </Thead>
            <Tbody>
                {Object.entries(resumeData).map(([category, details]) => (
                    <Tr key={category}>
                        <Td>{category}</Td>
                        <Td>{renderDetails(details)}</Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};

export default ResumeTable;
