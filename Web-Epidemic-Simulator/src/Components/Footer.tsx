import React, { memo } from "react";
import "./Footer.css";
import packageJson from "../../package.json";

const Footer: React.FC = memo(() => {
  return (
    <footer>
      Ⓒ Copyright Alex Rajya 2024 | All Rights Reserved | v{packageJson.version}
    </footer>
  );
});

export default Footer;
