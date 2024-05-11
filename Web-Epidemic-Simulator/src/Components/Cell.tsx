import React from 'react';
import { Cell as CellClass } from '../Simulation/Cell.tsx';
import Popover from '@mui/material/Popover';
import { Typography } from '@mui/material';
import './Cell.css';

export interface CellProps {
    cell: CellClass
}

const Cell: React.FC<CellProps> = ({ cell }: CellProps) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const cellColour = (cell: CellClass): string => {  
        const percentInfected = ((cell.IncubatedCount + cell.InfectedCount) / cell.PopulationCount) * 100;
        return `rgb(${100 + percentInfected}, ${100 - percentInfected}, ${100 - percentInfected})`;
    }

    return (
        <>
            <div
                className='Cell'
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                style={{ backgroundColor: cellColour(cell)}} 
            /> 
            {cell.PopulationCount > 0 && (<Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{backgroundColor: "#242424", color: "white", padding: "4px"}}>
                    Population: {cell.PopulationCount}<br/>
                    Susceptible: {cell.SusceptibleCount}<br/>
                    Incubated: {cell.IncubatedCount}<br/>
                    Infected: {cell.InfectedCount}<br/>
                    Recovered: {cell.RecoveredCount}
                </Typography>
            </Popover>)}
        </>
    );
};

export default Cell;