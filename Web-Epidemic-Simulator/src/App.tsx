import { useEffect, useState } from 'react'
import './App.css'
import { Grid } from './Simulation/Grid';
import { Configuration } from './Simulation/Configuration';

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

  return (
    <>
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
        setGrid(new Grid())}
        }>
        Reset
      </button>
    </>
  )
}

export default App
