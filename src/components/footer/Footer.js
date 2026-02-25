import React from "react";
import {Flex, Link as LinkText, Text,} from "@chakra-ui/react";
import {homepage} from "variables/links";
import {config} from "config/config";
import {Locale} from "../../utils/Language";
import {useTextColor} from "../../utils/colors";

export default function Footer({children}) {
    const textColor = useTextColor();

    return (
        <Flex
            zIndex='1'
            direction={{
                base: "column",
                xl: "row",
            }}
            alignItems={{
                base: "center",
                xl: "start",
            }}
            justifyContent='space-between'
            px={{base: "30px", md: "50px"}}
            pb='30px'>
            <Text
                color={textColor}
                textAlign={{
                    base: "center",
                    xl: "start",
                }}
                mb={{base: "20px", xl: "0px"}}
                fontSize="sm"
                opacity={0.7}
            >
                &copy; {new Date().getFullYear()}
                <Text as='span' fontWeight='500' ms='4px'>
                    {config.name} Dashboard.
                    <Locale
                        zh=" 版權所有。基於"
                        en=" All Rights Reserved. Built with"
                    />
                    <LinkText
                        mx='3px'
                        color='brand.400'
                        href={homepage}
                        target='_blank'
                        fontWeight='600'>
                        Discord Dashboard
                    </LinkText>
                </Text>
            </Text>
            {children}
        </Flex>
    );
}
