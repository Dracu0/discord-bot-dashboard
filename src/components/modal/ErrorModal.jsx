import React from "react";
import Modal from "./Modal";

export default function ErrorModal({ header, error, onClose }) {
    return (
        <Modal isOpen={error != null} onClose={onClose} header={header}>
            <p>{error}</p>
        </Modal>
    );
}
