import { useEffect, useState } from "react";
import "./App.css";
import { Grid } from "./Simulation/Grid";
import {
  ConvertTo2DArray,
  PickRandomCell,
} from "./Simulation/Helpers/ConvertTo2DArray";
import Cell from "./Components/Cell";
import { cellsPopulation } from "./Simulation/Data/GermanyPopulationDensity";
import { Button, ThemeProvider, createTheme } from "@mui/material";
import HeaderBar from "./Components/HeaderBar";
import DropMenu from "./Components/DropMenu";
import Footer from "./Components/Footer";
import { Grid as GridComponent } from "@mui/material";
import EditSettings from "./Components/EditSettings";
import { IConfiguration, covid19 } from "./Simulation/Configuration";
import { LineChart } from "@mui/x-charts/LineChart";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const cols = 36,
    rows = 36;
  const [grid, setGrid] = useState<Grid>(new Grid(rows, cols, cellsPopulation));
  const [populationCount, setPopulationCount] = useState<number>(
    grid.PopulationOverallCount
  );
  const [susceptibleCount, setSusceptibleCount] = useState<number>(
    grid.SusceptibleOverallCount
  );
  const [incubatedCount, setIncubatedCount] = useState<number>(
    grid.IncubatedOverallCount
  );
  const [infectedCount, setInfectedCount] = useState<number>(
    grid.InfectedOverallCount
  );
  const [recoveredCount, setRecoveredCount] = useState<number>(
    grid.RecoveredOverallCount
  );
  const [config, setConfig] = useState<IConfiguration>(covid19);
  const [running, setRunning] = useState<boolean>(false);

  const [infectedHistory, setInfectedHistory] = useState<number[]>([]);
  const [dayCount, setDayCount] = useState<number>(0);
  const [daysList, setDaysList] = useState<number[]>([]);

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        infectedHistory.push(grid.InfectedOverallCount);
        daysList.push(dayCount);
        grid.Next(config);
        setDayCount(dayCount + 1);
        updateCounts(grid);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [running, grid, config, infectedHistory, daysList, dayCount]);

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
  };

  const onConfigChange = (newConfig: IConfiguration) => {
    setConfig(newConfig);
  };

  return (
    <GridComponent
      container
      spacing={4}
      direction="column"
      justifyContent="space-evenly"
      alignItems="center"
    >
      <GridComponent item xs={12}>
        <HeaderBar />
      </GridComponent>
      <GridComponent item xs={12}>
        <div className="grid">
          {ConvertTo2DArray(grid.cells, rows).map((rowOfCells, index) => (
            <div style={{ display: "flex" }} key={"row-" + index}>
              {rowOfCells.map((cell) => (
                <Cell cell={cell} key={"cell-" + cell.Index} />
              ))}
            </div>
          ))}
        </div>
      </GridComponent>
      <GridComponent item xs={12}>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            variant="contained"
            onClick={() => {
              grid.Next(config);
              updateCounts(grid);
            }}
          >
            Next day
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setRunning(!running);
            }}
          >
            {running ? "Stop" : "Start"}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              const startGrid = new Grid(rows, cols, cellsPopulation);
              setDayCount(0);
              setDaysList([]);
              setInfectedHistory([]);

              updateCounts(startGrid);
              setGrid(startGrid);
              startGrid.SetAsInfected(PickRandomCell(grid, cols, rows));
            }}
          >
            Reset
          </Button>
          <EditSettings
            onSettingsChange={onConfigChange}
            currentSettings={config}
          />
        </div>
      </GridComponent>
      <GridComponent item xs={12}>
        <div
          style={{
            width: "300px",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          <p>
            <span className="displayText">Total population: </span>
            {populationCount}
          </p>
          <p>
            <span className="displayText susceptible">Total susceptible: </span>
            {susceptibleCount}
          </p>
          <p>
            <span className="displayText incubated">Total incubating:</span>
            {incubatedCount}
          </p>
          <p>
            <span className="displayText infected">Total infected:</span>
            {infectedCount}
          </p>
          <p>
            <span className="displayText recovered">Total recovered:</span>
            {recoveredCount}
          </p>
        </div>
      </GridComponent>

      <GridComponent item xs={12}>
        <ThemeProvider theme={darkTheme}>
          <LineChart
            xAxis={[
              {
                id: "Day",
                data: daysList,
                colorMap: {
                  type: "continuous",
                  color: ["#f17575", "#f17575"],
                },
              },
            ]}
            series={[
              {
                data: infectedHistory,
                area: true,
              },
            ]}
            width={400}
            height={200}
            margin={{ left: 70 }}
            grid={{ vertical: true, horizontal: true }}
          />
        </ThemeProvider>
      </GridComponent>
      <DropMenu configToExport={config} onConfigImport={onConfigChange} />
      <GridComponent item xs={12}>
        <Footer />
      </GridComponent>
    </GridComponent>
  );
}

export default App;
