import React from "react";
import SignIn from "views/auth/signIn";

export default function Auth() {
  document.documentElement.dir = "ltr";
  return (
    <div
      className="min-h-screen relative w-full bg-[var(--surface-primary)]"
      style={{ transition: "all 0.25s cubic-bezier(.4,0,.2,1)" }}
    >
      <SignIn />
    </div>
  );
}
