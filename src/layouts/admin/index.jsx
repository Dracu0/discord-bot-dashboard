import AdminFooter from "components/footer/FooterAdmin";
import Profile from "views/admin/profile";
import { UserDataProvider } from "contexts/UserDataContext";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  document.documentElement.dir = "ltr";

  return (
    <div className="min-h-screen relative px-4 sm:px-5 md:px-10 lg:px-20 xl:px-[120px]">
      <UserDataProvider>
        <Profile />
        <div>
          <AdminFooter />
        </div>
      </UserDataProvider>
      <Outlet />
    </div>
  );
}
