// Chakra Imports
import {Flex, MenuItem, MenuList, Text, useColorModeValue,} from "@chakra-ui/react";
import {useContext} from "react";
import {UserDataContext} from "contexts/UserDataContext";
import {Link} from "react-router-dom";
import {useLogout} from "../../api/internal";
import {Locale} from "../../utils/Language";
import {useCardBg, useNeuRaised, useTextColor} from "../../utils/colors";

export default function UserOptionMenu() {
    const menuBg = useCardBg()
    const textColor = useTextColor();
    const neuShadow = useNeuRaised();
    const borderColor = useColorModeValue("rgba(255,255,255,0.6)", "rgba(139,92,246,0.1)");
    const user = useContext(UserDataContext);
    const logout = useLogout()

    return (
        <MenuList
            boxShadow={neuShadow}
            p="0px"
            mt="10px"
            borderRadius="20px"
            bg={menuBg}
            border="1px solid"
            borderColor={borderColor}
            zIndex={1500}
        >
            <Flex w="100%" mb="0px">
                <Text
                    ps="20px"
                    pt="16px"
                    pb="10px"
                    w="100%"
                    borderBottom="1px solid"
                    borderColor={borderColor}
                    fontSize="sm"
                    fontWeight="700"
                    color={textColor}
                >
                    👋&nbsp; <Locale zh="歡迎" en="Welcome"/>, {user.username}
                </Text>
            </Flex>
            <Flex flexDirection="column" p="10px">
                <Link to="/admin">
                    <MenuItem borderRadius="8px" px="14px">
                        <Locale zh="個人信息" en="Profile" />
                    </MenuItem>
                </Link>
                <MenuItem
                    color="red.400"
                    borderRadius="8px"
                    px="14px"
                    onClick={logout.mutate}
                    disabled={logout.isLoading}
                >
                    <Text fontSize="sm">
                        <Locale zh="登出" en="Log out" />
                    </Text>
                </MenuItem>
            </Flex>
        </MenuList>
    );
}
