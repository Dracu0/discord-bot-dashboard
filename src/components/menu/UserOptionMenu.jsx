import { Flex, Menu, Text } from "@mantine/core";
import { useContext } from "react";
import { UserDataContext } from "contexts/UserDataContext";
import { Link } from "react-router-dom";
import { useLogout } from "../../api/internal";
import { Locale } from "../../utils/Language";
import { useCardBg, useTextColor } from "../../utils/colors";

export default function UserOptionMenu() {
    const menuBg = useCardBg();
    const textColor = useTextColor();
    const user = useContext(UserDataContext);
    const logout = useLogout();

    return (
        <Menu.Dropdown
            p={0}
            style={{
                borderRadius: 20,
                backgroundColor: menuBg,
                zIndex: 1500,
            }}
        >
            <Flex w="100%" mb={0}>
                <Text
                    ps={20}
                    pt={16}
                    pb={10}
                    w="100%"
                    style={{ borderBottom: "1px solid var(--mantine-color-default-border)" }}
                    fz="sm"
                    fw={700}
                    c={textColor}
                >
                    👋&nbsp; <Locale zh="歡迎" en="Welcome" />, {user.username}
                </Text>
            </Flex>
            <Flex direction="column" p={10}>
                <Menu.Item component={Link} to="/admin" style={{ borderRadius: 8 }} px={14}>
                    <Locale zh="個人信息" en="Profile" />
                </Menu.Item>
                <Menu.Item
                    c="red"
                    style={{ borderRadius: 8 }}
                    px={14}
                    onClick={logout.mutate}
                    disabled={logout.isPending}
                >
                    <Text fz="sm">
                        <Locale zh="登出" en="Log out" />
                    </Text>
                </Menu.Item>
            </Flex>
        </Menu.Dropdown>
    );
}
