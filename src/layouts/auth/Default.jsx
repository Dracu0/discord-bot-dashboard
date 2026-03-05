import React from "react";
import FixedPlugin from "components/fixedPlugin/FixedPlugin";

function AuthIllustration({ children }) {
  return (
    <div className="relative min-h-screen bg-[var(--surface-primary)] flex overflow-hidden">
      {/* Decorative glow orbs */}
      <div
        className="absolute hidden sm:block md:w-[500px] md:h-[500px] w-[250px] h-[250px]"
        style={{
          top: "-20%",
          left: "-10%",
          borderRadius: "50%",
          background: "var(--accent-primary)",
          filter: "blur(180px)",
          opacity: 0.15,
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute hidden sm:block md:w-[400px] md:h-[400px] w-[200px] h-[200px]"
        style={{
          bottom: "-15%",
          right: "-5%",
          borderRadius: "50%",
          background: "#22D3EE",
          filter: "blur(160px)",
          opacity: 0.1,
          pointerEvents: "none",
        }}
      />

      <div className="flex w-full min-h-screen justify-center items-center px-5 md:px-0">
        {children}
      </div>
      <FixedPlugin />
    </div>
  );
}

export default AuthIllustration;
