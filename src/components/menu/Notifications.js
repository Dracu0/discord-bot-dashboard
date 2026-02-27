import {
    Flex,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Portal,
    Text,
    useColorModeValue,
    useDisclosure
} from "@chakra-ui/react";
import React, {useContext} from "react";
import {GuildContext} from "../../contexts/guild/GuildContext";
import {useQuery} from "react-query";
import {getNotifications} from "../../api/internal";
import {MdNotificationsNone} from "react-icons/md";
import {Locale} from "../../utils/Language";
import {QueryHolderSkeleton} from "../../contexts/components/AsyncContext";
import {NotificationItem} from "./NotificationItem";
import {useCardBg, useNeuRaised, useTextColor} from "../../utils/colors";

export function Notifications() {
    const navbarIcon = useColorModeValue("gray.400", "white");
    const textColor = useTextColor();
    const menuBg = useCardBg()
    const neuShadow = useNeuRaised();
    const borderColor = useColorModeValue("rgba(255,255,255,0.6)", "rgba(139,92,246,0.1)");
    const {isOpen, onOpen, onClose} = useDisclosure()

    const {id: serverId} = useContext(GuildContext)
    const query = useQuery(
        ["notifications", serverId],
        () => getNotifications(serverId),
        {
            enabled: isOpen
        },
    )

    return <Menu isOpen={isOpen} onClose={onClose}>
        <MenuButton p="0px" onClick={onOpen}>
            <Icon
                as={MdNotificationsNone}
                color={navbarIcon}
            />
        </MenuButton>
        <Portal>
        <MenuList
            boxShadow={neuShadow}
            p="20px"
            borderRadius="20px"
            bg={menuBg}
            border="1px solid"
            borderColor={borderColor}
            mt="22px"
            zIndex={1500}
            me={{base: "30px", md: "unset"}}
            minW={{base: "unset", md: "400px", xl: "450px"}}
            maxW={{base: "90vw", md: "unset"}}
        >
            <Text w="100%" mb="20px" fontSize="md" fontWeight="600" color={textColor}>
                <Locale zh="通知" en="Notifications" />
            </Text>
            <Flex direction="column" gap={3}>
                <QueryHolderSkeleton query={query} height="100px" count={2}>{() =>
                    query.data.map((item, key) => (
                        <MenuItem key={key} borderRadius="8px" p={0}>
                            <NotificationItem {...item} />
                        </MenuItem>
                    ))}
                </QueryHolderSkeleton>
            </Flex>
        </MenuList>
        </Portal>
    </Menu>
}