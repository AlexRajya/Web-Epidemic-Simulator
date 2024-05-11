import React from 'react';
import { Cell as CellClass } from '../Simulation/Cell.tsx';

export interface CellProps {
    cell: CellClass
}

const Cell: React.FC<CellProps> = ({ cell }: CellProps) => {
    const cellColour = (cell: CellClass): string => {  
        const percentInfected = ((cell.IncubatedCount + cell.InfectedCount) / cell.PopulationCount) * 100;
        if(percentInfected > 90){
          return "red";
        }else if(percentInfected > 60){
          return "orange";
        }else if(percentInfected > 30){
          return "yellow";
        }else {
            return cell.PopulationCount ? "white" : "gray";
        }
    }

    return (
        <div 
            style={{ backgroundColor: cellColour(cell), border: "1px solid black", width: "10px", height: "10px"}} 
        /> 
    );
};

export default Cell;