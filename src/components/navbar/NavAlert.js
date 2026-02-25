import React from "react";
import {Box, Breadcrumb, BreadcrumbItem, Flex, Text, useColorModeValue} from "@chakra-ui/react";
import {useAlertBg, useCardBg, useDetailColor, useNeuRaised, useTextColor} from "../../utils/colors";

export default function NavAlert({rootText, childText, children, clip = true}) {
    let mainText = useTextColor();
    let secondaryText = useDetailColor();
    const navbarBg = useAlertBg();
    const menuBg = useCardBg();
    const neuShadow = useNeuRaised();
    const brandAccent = useColorModeValue("brand.500", "brand.400");
    const margin = "5vw";
    const clipMargin = {base: "12px", md: "30px", lg: "30px", xl: "30px"};

    return (
        <Box
            zIndex={30}
            position="fixed"
            boxShadow="none"
            bg={navbarBg}
            borderColor="transparent"
            filter="none"
            backdropFilter="blur(24px) saturate(180%)"
            backgroundPosition="center"
            backgroundSize="cover"
            borderRadius="20px"
            borderWidth="1.5px"
            borderStyle="solid"
            transition="box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease"
            alignItems={{xl: "center"}}
            minH="75px"
            justifyContent={{xl: "center"}}
            lineHeight="25.6px"
            mx="auto"
            pb="8px"
            px={{
                sm: "15px",
                md: "10px",
            }}
            ps={{
                xl: "12px",
            }}
            pt="8px"
            left={clip ? "unset" : margin}
            right={clip ? clipMargin : margin}
            top={{base: "12px", md: "16px", xl: "18px"}}
            w={clip && {
                base: "calc(100vw - 6%)",
                md: "calc(100vw - 8%)",
                lg: "calc(100vw - 6%)",
                xl: "calc(100vw - 350px)",
                "2xl": "calc(100vw - 365px)",
            }}
        >
            <Flex
                w="100%"
                flexDirection={{
                    base: "column",
                    md: "row",
                }}
                alignItems={{xl: "center"}}
            >
                <Box mb={{sm: "8px", md: "0px"}}>
                    <Breadcrumb>
                        <BreadcrumbItem fontSize="sm" mb="5px">
                            <Text color={brandAccent} fontWeight="600">{rootText}</Text>
                        </BreadcrumbItem>
                        {
                            Array.isArray(childText)?
                                childText.map((text, key) =>
                                    <BreadcrumbItem key={key} color={secondaryText} fontSize="sm">
                                        <Text color={secondaryText}>{text}</Text>
                                    </BreadcrumbItem>
                                ) :
                                <BreadcrumbItem color={secondaryText} fontSize="sm">
                                    <Text color={secondaryText}>{childText}</Text>
                                </BreadcrumbItem>
                        }
                    </Breadcrumb>
                    <Text
                        color={mainText}
                        fontWeight="bold"
                        fontSize="34px"
                        fontFamily="'Space Grotesk', sans-serif"
                        letterSpacing="-0.02em"
                    >
                        {Array.isArray(childText)? childText[childText.length - 1] : childText}
                    </Text>
                </Box>
                <Flex
                    ms="auto"
                    w={{sm: "100%", md: "auto"}}
                    alignItems="center"
                    flexDirection="row"
                    bg={menuBg}
                    p="10px"
                    borderRadius="20px"
                    boxShadow={neuShadow}
                    border="1px solid"
                    borderColor={useColorModeValue(
                        "rgba(255,255,255,0.6)",
                        "rgba(139, 92, 246, 0.1)"
                    )}
                    overflow="visible"
                >
                    {children}
                </Flex>
            </Flex>
        </Box>
    );
}