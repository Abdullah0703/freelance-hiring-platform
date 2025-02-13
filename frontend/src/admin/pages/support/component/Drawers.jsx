import React from "react";
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    Button,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import EditTicket from "./EditTicket";
import ShowTicket from "./ShowTicket"; // Import the new ShowTicket component

const Drawers = ({
    isOpen,
    onClose,
    drawerType,
    itemData,
    editTicket,
    handleResolve // Add this prop for handling ticket resolution
}) => {
    
    const renderDrawer = () => {

        console.log("this:",itemData)
        switch (drawerType) {
            case "edit":
                return (
                    <EditTicket
                        selectedItem={itemData}
                        onClose={onClose}
                        editTicket={editTicket}
                    />
                );
            case "show":
                return (
                    <ShowTicket
                        selectedItem={itemData}
                        onClose={onClose}
                        handleResolve={handleResolve} // Pass the resolve handler
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Drawer isOpen={isOpen} placement="right" size="full" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader>
                    <Button
                        leftIcon={<ArrowBackIcon />}
                        onClick={onClose}
                        variant="ghost"
                        alignItems="center"
                        justifyContent="center"
                    />
                    {drawerType === "edit" && "Edit Ticket Details"}
                    {drawerType === "show" && "Ticket Details"}
                </DrawerHeader>
                <DrawerBody>{renderDrawer()}</DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default Drawers;
