import React, { useContext } from "react";
import AdminNavbarLinks from "components/navbar/NavbarLinksAdmin";
import NavAlert from "./NavAlert";
import { PageInfoContext } from "../../contexts/PageInfoContext";
import { useLocale } from "../../utils/Language";

export default function AdminNavbar() {
    const { info } = useContext(PageInfoContext);
    const locale = useLocale();
    const rootText = info?.section || locale({ zh: "頁面", en: "Pages" });
    const trail = info?.trail?.length ? info.trail : [info?.title || "Loading..."];

    return (
        <NavAlert rootText={rootText} childText={trail}>
            <AdminNavbarLinks />
        </NavAlert>
    );
}
