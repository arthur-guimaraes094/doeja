import React from "react";
import EggplantSvg from "./EggplantSvg";
import TomatoSvg from "./TomatoSvg";

export default function Footer() {
  return (
    <footer className="bg-footer-bg border-t-project-style h-20 relative mt-auto">
      <div className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none">
        <div className="absolute bottom-2.5 left-[2%] md:left-[5%] pointer-events-auto transition-transform duration-300 hover:scale-110 hover:-rotate-5">
          <EggplantSvg />
        </div>
        <div className="absolute bottom-2.5 right-[2%] md:right-[5%] pointer-events-auto transition-transform duration-300 hover:scale-110 hover:rotate-5">
          <TomatoSvg />
        </div>
      </div>
    </footer>
  );
}

