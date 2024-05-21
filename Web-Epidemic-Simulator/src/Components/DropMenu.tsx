import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ShareIcon from "@mui/icons-material/Share";
import GitHubIcon from "@mui/icons-material/GitHub";
import React, { useRef } from "react";
import { IConfiguration } from "../Simulation/Configuration";

const actions = [
  {
    icon: <FileDownloadIcon />,
    name: "Export Config",
    operation: "export",
  },
  {
    icon: <UploadIcon />,
    name: "Import Config",
    operation: "upload",
  },
  { icon: <ShareIcon />, name: "Share", operation: "share" },
  { icon: <GitHubIcon />, name: "Source", operation: "source" },
];

interface DropMenuProps {
  configToExport: IConfiguration;
  onConfigImport: (config: IConfiguration) => void;
}

const DropMenu: React.FC<DropMenuProps> = ({
  configToExport,
  onConfigImport,
}: DropMenuProps) => {
  const inputFile = useRef<HTMLInputElement | null>(null);

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
      const json = JSON.stringify(configToExport);
      const blob = new Blob([json], { type: "application/json" });

      // create a link element
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "config.json"; // replace this with your desired file name
      document.body.appendChild(link);

      // programmatically click the link to trigger the download
      link.click();
      document.body.removeChild(link);
    } else if (operation === "upload") {
      if (inputFile.current) {
        inputFile.current.click();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (file) {
      file.text().then((text) => {
        const config = JSON.parse(text) as IConfiguration;
        onConfigImport(config);
      });
    }
  };

  return (
    <>
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <SpeedDial
        ariaLabel="Extra actions"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
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
    </>
  );
};

export default DropMenu;
