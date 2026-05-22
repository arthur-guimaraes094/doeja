import React from "react";
import EggplantSvg from "./EggplantSvg";
import TomatoSvg from "./TomatoSvg";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-decorations">
        <div className="decor-eggplant">
          <EggplantSvg />
        </div>
        <div className="decor-tomato">
          <TomatoSvg />
        </div>
      </div>
    </footer>
  );
}
