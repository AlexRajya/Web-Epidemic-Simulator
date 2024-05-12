import { Box, AppBar, Toolbar, Typography, Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import './HeaderBar.css';

const HeaderBar: React.FC = () => {
    const [openAboutDialog, setOpenAboutDialog] = React.useState(false);

    const handleClickOpen = () => {
        setOpenAboutDialog(true);
    };
    const handleClose = () => {
        setOpenAboutDialog(false);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <CoronavirusIcon fontSize='large'/>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign:"left", padding: "10px" }}>
                        Epidemic Simulation
                    </Typography>
                    <Button startIcon={<InfoIcon />} color="inherit" onClick={handleClickOpen}>
                        About
                    </Button>
                    <Button startIcon={<GitHubIcon/>} color="inherit" href='https://github.com/AlexRajya/Web-Epidemic-Simulator' sx={{color: "white"}}>
                        Source 
                    </Button>
                </Toolbar>
            </AppBar>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={openAboutDialog}
            >
                <DialogTitle className='dialog' sx={{ m: 0, p: 2}} id="customized-dialog-title">
                    Epidemic Simulator Info
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers className='dialog'>
                    <Typography gutterBottom>
                        <p>
                            This web app aims to simulate and visualise the spread of an epidemic through 2D cellular automata and the SEIR model. 
                            For this particular simulation, we are simulating the spread of an epidemic through Germany. We took real population data and
                            condensed it down into a 36x36 grid.
                        </p>
                        <p>
                            The simulation starts by infecting a small percentage of the population of a random cell in the grid. 
                            The simulation will then simulate individuals travelling to neighbouring cells and to large cities to simulate travelling for work thus spreading the virus.
                        </p>
                        <p>
                            To begin, simply press the start button.
                        </p>
                    </Typography>
                </DialogContent>
        </Dialog>
      </Box>
    );
};

export default HeaderBar;