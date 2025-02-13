import { ArrowBackIcon } from "@chakra-ui/icons";
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
} from "@chakra-ui/react";
import React from "react";
import AddWorkLog from "./AddWorkLog";
import EditWorkLog from "./EditWorkLog";
import ShowTask from "./Show";


const Drawers = ({
    isOpen,
    onClose,
    drawerType,
    handleAddUpdateDeleteItem,
    data,
    role
}) => {
    const renderDrawer = () => {
        switch (drawerType) {
            case "addNew":
                return (
                    <AddWorkLog onClose={onClose} handleAddUpdateDeleteItem={handleAddUpdateDeleteItem} />
                )
            case "edit":
                return (
                    <EditWorkLog
                        selectedItem={data}
                        onClose={onClose}
                        handleAddUpdateDeleteItem={handleAddUpdateDeleteItem}
                    />
                );
            case "show":
                return (
                    <ShowTask
                        selectedItem={data}
                        onClose={onClose}
                        handleAddUpdateDeleteItem={handleAddUpdateDeleteItem}
                        role={role}
                    />
                );
            default:
                return null;
        }

    };

    return (
        <Drawer isOpen={isOpen} placement="right" size='lg' onClose={onClose}>
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
                    {drawerType === "addNew" && "Add New WorkLog"} {/* Updated text */}
                    {drawerType === "edit" && "Edit WorkLog Details"} {/* Updated text */}
                </DrawerHeader>
                <DrawerBody>{renderDrawer()}</DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default Drawers;
