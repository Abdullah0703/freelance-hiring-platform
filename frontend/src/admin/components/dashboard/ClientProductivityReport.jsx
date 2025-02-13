import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
const ClientProductivityReport = () => {

    if (!reportData) {
        return <Text>No data available</Text>;
    }

    const renderFields = (data) => {
        return Object.entries(data).map(([key, value]) => {
            if (Array.isArray(value)) {
                return (
                    <Box key={key} mt={6}>
                        <Heading as="h3" size="md" mb={4}>
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </Heading>
                        {value.map((item, index) => (
                            <Text key={index}>
                                <strong>#{item.id}:</strong> {item.issue} ({item.status})
                            </Text>
                        ))}
                    </Box>
                );
            } else if (typeof value === 'object') {
                return (
                    <Box key={key} mt={6}>
                        <Heading as="h3" size="md" mb={4}>
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </Heading>
                        {renderFields(value)}
                    </Box>
                );
            } else {
                return (
                    <Text key={key}>
                        <strong>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</strong> {value}
                    </Text>
                );
            }
        });
    };

    return (
        <Box p={6} bg="white" borderWidth="1px" borderRadius="lg" shadow="md">
            <Heading as="h2" size="lg" mb={4}>
                {reportData.title}
            </Heading>
            <VStack spacing={4} align="start">
                {renderFields(reportData)}
            </VStack>
        </Box>
    );
}

export default ClientProductivityReport