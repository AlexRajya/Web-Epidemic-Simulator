import { useEffect, useState } from 'react'
import './App.css'
import { Grid } from './Simulation/Grid';
import { Configuration } from './Simulation/Configuration';
import { ConvertTo2DArray } from './Simulation/Helpers/ConvertTo2DArray';
import { Cell } from './Simulation/Cell';
import { cellsPopulation } from './Simulation/Data/GermanyPopulationDensity';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';

function App() {
  const cols = 36, rows = 36;
  const [grid, setGrid] = useState<Grid>(new Grid(rows, cols, cellsPopulation));
  const [populationCount, setPopulationCount] = useState<number>(grid.PopulationOverallCount);
  const [susceptibleCount, setSusceptibleCount] = useState<number>(grid.SusceptibleOverallCount);
  const [incubatedCount, setIncubatedCount] = useState<number>(grid.IncubatedOverallCount);
  const [infectedCount, setInfectedCount] = useState<number>(grid.InfectedOverallCount);
  const [recoveredCount, setRecoveredCount] = useState<number>(grid.RecoveredOverallCount);
  const [config] = useState<Configuration>(new Configuration());

  useEffect(() => {
    const startGrid = new Grid(rows, cols, cellsPopulation);
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

  const updateCounts = (newGrid: Grid): void => {
    setPopulationCount(newGrid.PopulationOverallCount);
    setSusceptibleCount(newGrid.SusceptibleOverallCount);
    setInfectedCount(newGrid.InfectedOverallCount);
    setIncubatedCount(newGrid.IncubatedOverallCount);
    setRecoveredCount(newGrid.RecoveredOverallCount);
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <CoronavirusIcon fontSize='large'/>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign:"left", padding: "10px" }}>
              Epidemic Simulation
            </Typography>
            <Button variant="text" href='https://github.com/AlexRajya/Web-Epidemic-Simulator' sx={{color: "white"}}>
              Source
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <div style={{display: "flex", alignContent: "center", justifyContent: "center", marginTop: "10%"}}>
        <div>
          {ConvertTo2DArray(grid.cells, rows).map((rowOfCells, index) => 
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
        <div style={{width: "300px", marginTop: "auto", marginBottom: "auto"}}>
          <Button variant="contained" onClick={() => {
              grid.Next(config);
              updateCounts(grid);
            }
          }>
            Next day
          </Button>
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
          <Button variant="contained" onClick={() => {
              const startGrid = new Grid(rows, cols, cellsPopulation);
              updateCounts(startGrid);
              setGrid(startGrid);
              startGrid.SetAsInfected(1001);
            } 
          }>
            Reset
          </Button>
        </div>
      </div>
    </>
  )
}

export default App
