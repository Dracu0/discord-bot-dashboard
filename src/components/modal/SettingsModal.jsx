import {EmptyModal} from "./Modal";
import Settings from "../card/Settings";

export function SettingsModal({isOpen, onClose}) {

    return <EmptyModal isOpen={isOpen} onClose={onClose}>
        <Settings />
    </EmptyModal>
}