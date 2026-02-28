import { Box } from "@mantine/core";
import AdminFooter from "components/footer/FooterAdmin";
import Profile from "views/admin/profile";
import { UserDataProvider } from "contexts/UserDataContext";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  document.documentElement.dir = "ltr";

  return (
    <Box mih="100vh" pos="relative" px={{ base: 16, sm: 20, md: 80, xl: 120 }}>
      <UserDataProvider>
        <Profile />
        <Box>
          <AdminFooter />
        </Box>
      </UserDataProvider>
      <Outlet />
    </Box>
  );
}
