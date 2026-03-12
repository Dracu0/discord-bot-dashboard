import AdminFooter from "components/footer/FooterAdmin";
import Navbar from "components/navbar/NavbarAdmin";
import { ErrorBoundary } from "components/ErrorBoundary";
import { PageInfoProvider } from "contexts/PageInfoContext";
import Profile from "views/admin/profile";
import { UserDataProvider } from "contexts/UserDataContext";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => { document.documentElement.dir = "ltr"; }, []);

  return (
    <div className="min-h-screen bg-(--surface-secondary)">
      <div className="mx-auto min-h-screen max-w-7xl px-4 pb-6 sm:px-5 md:pb-7 lg:px-6 xl:px-7.5">
        <UserDataProvider>
          <PageInfoProvider>
            <Navbar clip={false} />
            <main
              id="main-content"
              className="min-h-screen"
              style={{ animation: "fadeSlideUp 0.3s ease both" }}
            >
              <ErrorBoundary>
                <Profile />
                <Outlet />
              </ErrorBoundary>
            </main>
            <AdminFooter />
          </PageInfoProvider>
        </UserDataProvider>
      </div>
    </div>
  );
}
