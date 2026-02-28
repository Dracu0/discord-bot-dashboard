import { Text } from "@mantine/core";
import React from "react";
import Modal from "./Modal";

export default function ErrorModal({header, error, onClose}) {

    return <Modal isOpen={error != null} onClose={onClose} header={header}>
        <Text>{error}</Text>
    </Modal>
}