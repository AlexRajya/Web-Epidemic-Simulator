import { useEffect, useState } from 'react'
import './App.css'
import { Grid } from './Simulation/Grid';
import { Configuration } from './Simulation/Configuration';
import { ConvertTo2DArray } from './Simulation/Helpers/ConvertTo2DArray';
import { Cell } from './Simulation/Cell';

function App() {
  const [grid, setGrid] = useState<Grid>(new Grid());
  const [populationCount, setPopulationCount] = useState<number>(grid.PopulationOverallCount);
  const [susceptibleCount, setSusceptibleCount] = useState<number>(grid.SusceptibleOverallCount);
  const [incubatedCount, setIncubatedCount] = useState<number>(grid.IncubatedOverallCount);
  const [infectedCount, setInfectedCount] = useState<number>(grid.InfectedOverallCount);
  const [recoveredCount, setRecoveredCount] = useState<number>(grid.RecoveredOverallCount);
  const [config] = useState<Configuration>(new Configuration());

  useEffect(() => {
    const startGrid = new Grid();
    startGrid.SetAsInfected(1001);
    setGrid(startGrid);
  }, []);

  const cellColour = (cell: Cell): string => {
      let colour = "gray";
      if(cell.PopulationCount){
        colour = "white";
      }

      const percentInfected = ((cell.IncubatedCount + cell.InfectedCount) / cell.PopulationCount) * 100;
      if(percentInfected > 90){
        colour = "red";
      }else if(percentInfected > 60){
        colour = "orange";
      }else if(percentInfected > 30){
        colour = "yellow";
      }

      return colour
  }

  return (
    <div style={{display: "flex"}}>
      <div style={{width: "600px"}}>
        {ConvertTo2DArray(grid.cells).map((rowOfCells, index) => 
          <div style={{display: 'flex'}} key={"row-" + index}>
            {rowOfCells.map((cell) => 
              <div 
                style={{ backgroundColor: cellColour(cell), border: "1px solid black", width: "10px", height: "10px"}} 
                key={"cell-" + cell.Index}
              /> 
            )}
          </div>
        )}
      </div>
      <div style={{width: "300px"}}>
        <button onClick={() => {
            grid.Next(config);
            setPopulationCount(grid.PopulationOverallCount);
            setSusceptibleCount(grid.SusceptibleOverallCount);
            setInfectedCount(grid.InfectedOverallCount);
            setIncubatedCount(grid.IncubatedOverallCount);
            setRecoveredCount(grid.RecoveredOverallCount);
          }
        }>
          Next day
        </button>
        <p>
          Total population: {populationCount}
        </p>
        <p>
          Total susceptible: {susceptibleCount}
        </p>
        <p>
          Total incubating: {incubatedCount}
        </p>
        <p>
          Total infected: {infectedCount}
        </p>
        <p>
          Total recovered: {recoveredCount}
        </p>
        <button onClick={() => {
            const startGrid = new Grid();
            setPopulationCount(startGrid.PopulationOverallCount);
            setSusceptibleCount(startGrid.SusceptibleOverallCount);
            setInfectedCount(startGrid.InfectedOverallCount);
            setIncubatedCount(startGrid.IncubatedOverallCount);
            setRecoveredCount(startGrid.RecoveredOverallCount);
            setGrid(startGrid);
            startGrid.SetAsInfected(1001);
          } 
        }>
          Reset
        </button>
      </div>
    </div>
  )
}

export default App
