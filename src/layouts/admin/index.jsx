import AdminFooter from "components/footer/FooterAdmin";
import Profile from "views/admin/profile";
import { UserDataProvider } from "contexts/UserDataContext";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => { document.documentElement.dir = "ltr"; }, []);

  return (
    <div className="min-h-screen bg-(--surface-secondary)">
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-5 md:py-10 lg:px-6 xl:px-7.5">
        <UserDataProvider>
          <Profile />
          <AdminFooter />
        </UserDataProvider>
        <Outlet />
      </div>
    </div>
  );
}
