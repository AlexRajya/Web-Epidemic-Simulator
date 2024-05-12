import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ShareIcon from '@mui/icons-material/Share';
import React from 'react';

const actions = [
    { icon: <FileDownloadIcon />, name: '(Coming soon) Export config' },
    { icon: <UploadIcon />, name: '(Coming soon) Import config' },
    { icon: <ShareIcon />, name: 'Share' },
  ];

const DropMenu: React.FC = () => {
    return (
        <SpeedDial
            ariaLabel="SpeedDial tooltip example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
        >
            {actions.map((action) => (
            <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
            />
            ))}
        </SpeedDial>
    );
};

export default DropMenu;