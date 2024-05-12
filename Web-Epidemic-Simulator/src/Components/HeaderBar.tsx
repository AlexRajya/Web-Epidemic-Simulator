import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import React from 'react';

const HeaderBar: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <CoronavirusIcon fontSize='large'/>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign:"left", padding: "10px" }}>
                        Epidemic Simulation
                    </Typography>
                    <Button color="inherit">
                        About
                    </Button>
                    <Button color="inherit" href='https://github.com/AlexRajya/Web-Epidemic-Simulator' sx={{color: "white"}}>
                        Source
                    </Button>
                </Toolbar>
            </AppBar>
      </Box>
    );
};

export default HeaderBar;