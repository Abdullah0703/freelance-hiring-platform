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
import AddBiller from "./AddBiller";
import EditBiller from "./EditBiller";

const Drawers = ({
    isOpen,
    onClose,
    drawerType,
    data,
    handleAddUpdateDeleteItem,
}) => {

    const renderDrawer = () => {
        switch (drawerType) {
            case "addNew":
                return (
                    <AddBiller onClose={onClose} handleAddUpdateDeleteItem={handleAddUpdateDeleteItem} />
                )
            case "edit":
                return (
                    <EditBiller
                        selectedItem={data}
                        onClose={onClose}
                        handleAddUpdateDeleteItem={handleAddUpdateDeleteItem} 
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
                    {drawerType === "addNew" && "Add New Biller"} {/* Updated text */}
                    {drawerType === "edit" && "Edit Biller Details"} {/* Updated text */}
                </DrawerHeader>
                <DrawerBody>{renderDrawer()}</DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default Drawers;
