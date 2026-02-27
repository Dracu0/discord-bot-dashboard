import {
    Button,
    Modal as ModalBase,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useColorModeValue,
    useToken
} from "@chakra-ui/react";
import {Locale, useLocale} from "utils/Language";
import hexToRgba from "hex-to-rgba";
import {useNeuRaised} from "../../utils/colors";

export function EmptyModal({children, isOpen, onClose, ...props}) {
    const modalBg = useColorModeValue("secondaryGray.300", "navy.900");
    const [overlayBg] = useToken("colors", [modalBg])
    const neuShadow = useNeuRaised();

    return <ModalBase isCentered isOpen={isOpen} onClose={onClose} {...props}>
        <ModalOverlay
            bg={hexToRgba(overlayBg, 0.3)}
            backdropFilter='blur(16px)'
        />
        <ModalContent
            bg={modalBg}
            rounded={{base: "16px", md: "24px"}}
            shadow={neuShadow}
            border="1px solid"
            borderColor={useColorModeValue(
                "rgba(255,255,255,0.5)",
                "rgba(139, 92, 246, 0.1)"
            )}
        >
            {children}
        </ModalContent>
    </ModalBase>
}

export default function Modal({header, children, isOpen, onClose, ...props}) {
    const locale = useLocale()

    return <EmptyModal isOpen={isOpen} onClose={onClose} {...props}>
        <ModalHeader fontFamily="'Space Grotesk', sans-serif">{locale(header)}</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
            {children}
        </ModalBody>

        <ModalFooter>
            <Button onClick={onClose}>
                <Locale zh="關閉" en="Close"/>
            </Button>
        </ModalFooter>
    </EmptyModal>
}