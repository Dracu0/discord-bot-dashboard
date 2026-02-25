import {useColorModeValue, useToken} from "@chakra-ui/react";
import hexToRgba from "hex-to-rgba";

export function useAlertBg() {
    const [secondaryGray300, navy900] = useToken("colors", ["secondaryGray.300", "navy.900"])

    return useColorModeValue(
        hexToRgba(secondaryGray300, 0.5),
        hexToRgba(navy900, 0.5)
    );
}

export function useBrandBg() {
    return useColorModeValue("brand.500", "brand.400");
}

export function useTextColor() {
    return useColorModeValue("navy.700", "white");
}

export function useDetailColor() {
    return useColorModeValue("secondaryGray.900", "secondaryGray.600");
}

export function useNoteColor() {
    return useColorModeValue("secondaryGray.700", "secondaryGray.600");
}

export function useSuccessBg() {
    return useColorModeValue("green.300", "green.500");
}

export function useIconColor() {
    return useColorModeValue("brand.500", "white");
}

export function useCardBg() {
    return useColorModeValue("white", "navy.800");
}

export function useNeuRaised() {
    return useColorModeValue(
        "6px 6px 14px #d1cbe0, -6px -6px 14px #ffffff",
        "6px 6px 14px #110d1e, -6px -6px 14px #2f254a"
    );
}

export function useNeuInset() {
    return useColorModeValue(
        "inset 3px 3px 6px #d1cbe0, inset -3px -3px 6px #ffffff",
        "inset 3px 3px 6px #110d1e, inset -3px -3px 6px #2f254a"
    );
}

export function useNeuFlat() {
    return useColorModeValue(
        "2px 2px 5px #d1cbe0, -2px -2px 5px #ffffff",
        "2px 2px 5px #110d1e, -2px -2px 5px #2f254a"
    );
}

export function useSurfaceBg() {
    return useColorModeValue("secondaryGray.300", "navy.900");
}