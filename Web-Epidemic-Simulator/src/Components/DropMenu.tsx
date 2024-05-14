import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ShareIcon from "@mui/icons-material/Share";
import GitHubIcon from "@mui/icons-material/GitHub";
import React from "react";
import { IConfiguration } from "../Simulation/Configuration";

const actions = [
  {
    icon: <FileDownloadIcon />,
    name: "Export config",
    operation: "export",
  },
  {
    icon: <UploadIcon />,
    name: "(Coming soon) Import config",
    operation: "upload",
  },
  { icon: <ShareIcon />, name: "Share", operation: "share" },
  { icon: <GitHubIcon />, name: "Source", operation: "source" },
];

interface DropMenuProps {
  configToExport: IConfiguration;
}

const DropMenu: React.FC<DropMenuProps> = ({
  configToExport,
}: DropMenuProps) => {
  const handleClick = (operation: string) => {
    if (operation === "share") {
      const shareData = {
        title: "Epidemic Simulator",
        text: "Check out this epidemic simulator!",
        url: "https://alexrajya.github.io/Web-Epidemic-Simulator/",
      };
      navigator.share(shareData);
    } else if (operation === "source") {
      window.open(
        "https://github.com/AlexRajya/Web-Epidemic-Simulator",
        "_blank"
      );
    } else if (operation === "export") {
      // convert it to json
      const json = JSON.stringify(configToExport);
      // create a blob from the json
      const blob = new Blob([json], { type: "application/json" });
      // create a link element
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "config.json"; // replace this with your desired file name
      // append the link to the body
      document.body.appendChild(link);
      // programmatically click the link to trigger the download
      link.click();
      // remove the link after downloading
      document.body.removeChild(link);
    }
  };

  return (
    <SpeedDial
      ariaLabel="SpeedDial tooltip example"
      sx={{ position: "absolute", bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => handleClick(action.operation)}
        />
      ))}
    </SpeedDial>
  );
};

export default DropMenu;
