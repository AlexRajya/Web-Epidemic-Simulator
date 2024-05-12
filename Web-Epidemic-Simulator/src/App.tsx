import { useEffect, useState } from 'react'
import './App.css'
import { Grid } from './Simulation/Grid';
import { Configuration } from './Simulation/Configuration';
import { ConvertTo2DArray, PickRandomCell } from './Simulation/Helpers/ConvertTo2DArray';
import Cell from './Components/Cell';
import { cellsPopulation } from './Simulation/Data/GermanyPopulationDensity';
import { Button } from '@mui/material';
import HeaderBar from './Components/HeaderBar';
import DropMenu from './Components/DropMenu';
import Footer from './Components/Footer';

function App() {
  const cols = 36, rows = 36;
  const [grid, setGrid] = useState<Grid>(new Grid(rows, cols, cellsPopulation));
  const [populationCount, setPopulationCount] = useState<number>(grid.PopulationOverallCount);
  const [susceptibleCount, setSusceptibleCount] = useState<number>(grid.SusceptibleOverallCount);
  const [incubatedCount, setIncubatedCount] = useState<number>(grid.IncubatedOverallCount);
  const [infectedCount, setInfectedCount] = useState<number>(grid.InfectedOverallCount);
  const [recoveredCount, setRecoveredCount] = useState<number>(grid.RecoveredOverallCount);
  const [config] = useState<Configuration>(new Configuration());
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        grid.Next(config);
        updateCounts(grid);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [running, grid, config]);

  useEffect(() => {
    const startGrid = new Grid(rows, cols, cellsPopulation);
    startGrid.SetAsInfected(PickRandomCell(startGrid, cols, rows));
    setGrid(startGrid);
  }, []);

  const updateCounts = (newGrid: Grid): void => {
    setPopulationCount(newGrid.PopulationOverallCount);
    setSusceptibleCount(newGrid.SusceptibleOverallCount);
    setInfectedCount(newGrid.InfectedOverallCount);
    setIncubatedCount(newGrid.IncubatedOverallCount);
    setRecoveredCount(newGrid.RecoveredOverallCount);
  }

  return (
    <>
      <HeaderBar />
      <div style={{display: "flex", alignContent: "center", justifyContent: "center", marginTop: "10%"}}>
        <div className='grid'>
          {ConvertTo2DArray(grid.cells, rows).map((rowOfCells, index) => 
            <div style={{display: 'flex'}} key={"row-" + index}>
              {rowOfCells.map((cell) => 
                <Cell
                  cell={cell}
                  key={"cell-" + cell.Index}
                /> 
              )}
            </div>
          )}
        </div>
        <div style={{width: "300px", marginTop: "auto", marginBottom: "auto"}}>
          <Button 
              style={{marginRight: "10px"}} 
              variant="contained"
              onClick={() => {
                grid.Next(config);
                updateCounts(grid);
              }
          }>
            Next day
          </Button>
          <Button variant="contained" onClick={() => {
            setRunning(!running)}
          }>
            {running ? 'Stop' : 'Start'}
          </Button>
          <p>
            <span className='displayText'>Total population: </span> 
            {populationCount}
          </p>
          <p>
            <span className='displayText susceptible'>Total susceptible: </span> 
            {susceptibleCount}
          </p>
          <p>
            <span className='displayText incubated'>Total incubating:</span>
            {incubatedCount}
          </p>
          <p>
            <span className='displayText infected'>Total infected:</span>
            {infectedCount}
          </p>
          <p>
            <span className='displayText recovered'>Total recovered:</span>
            {recoveredCount}
          </p>
          <Button variant="contained" onClick={() => {
              const startGrid = new Grid(rows, cols, cellsPopulation);
              updateCounts(startGrid);
              setGrid(startGrid);
              startGrid.SetAsInfected(PickRandomCell(grid, cols, rows));
            } 
          }>
            Reset
          </Button>
        </div>
      </div>
      <DropMenu />
      <Footer />
    </>
  )
}

export default App
