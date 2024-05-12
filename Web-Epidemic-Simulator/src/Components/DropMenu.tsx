import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ShareIcon from '@mui/icons-material/Share';
import React from 'react';

const actions = [
    { icon: <FileDownloadIcon />, name: '(Coming soon) Export config', operation: 'export' },
    { icon: <UploadIcon />, name: '(Coming soon) Import config', operation: 'upload' },
    { icon: <ShareIcon />, name: 'Share', operation: 'share' },
  ];

const DropMenu: React.FC = () => {
    const handleClick = (operation: string) => {
        if(operation === 'share') {
            const shareData = {
                title: 'Epidemic Simulator',
                text: 'Check out this epidemic simulator!',
                url: 'https://alexrajya.github.io/Web-Epidemic-Simulator/',
            }
            navigator.share(shareData);
        }
    }

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
                    onClick={() => handleClick(action.operation)}
                />
            ))}
        </SpeedDial>
    );
};

export default DropMenu;