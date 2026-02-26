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
        "4px 4px 12px #d1cbe0, -4px -4px 12px #faf8fe",
        "4px 4px 12px #110d1e, -4px -4px 12px #352a54"
    );
}

export function useNeuInset() {
    return useColorModeValue(
        "inset 3px 3px 6px #d1cbe0, inset -3px -3px 6px #faf8fe",
        "inset 3px 3px 6px #110d1e, inset -3px -3px 6px #352a54"
    );
}

export function useNeuFlat() {
    return useColorModeValue(
        "2px 2px 5px #d1cbe0, -2px -2px 5px #faf8fe",
        "2px 2px 5px #110d1e, -2px -2px 5px #352a54"
    );
}

export function useNeuSubtle() {
    return useColorModeValue(
        "1px 1px 3px #d1cbe0, -1px -1px 3px #faf8fe",
        "1px 1px 3px #110d1e, -1px -1px 3px #352a54"
    );
}

export function useNeuHover() {
    return useColorModeValue(
        "6px 6px 16px #d1cbe0, -6px -6px 16px #faf8fe",
        "6px 6px 16px #0e0a19, -6px -6px 16px #352a54"
    );
}

export function useNeuElevated() {
    return useColorModeValue(
        "8px 8px 24px #d1cbe0, -4px -4px 12px #faf8fe",
        "8px 8px 24px #110d1e, -4px -4px 12px #352a54"
    );
}

export function useSurface1() {
    return useColorModeValue("white", "navy.800");
}

export function useSurface2() {
    return useColorModeValue("gray.100", "navy.700");
}

export function useSurfaceBg() {
    return useColorModeValue("secondaryGray.300", "navy.900");
}