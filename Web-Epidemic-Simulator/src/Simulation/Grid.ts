import { Cell } from "./Cell";
import { Configuration } from "./Configuration";

import { ConvertTo2DArray } from "./Helpers/ConvertTo2DArray";
import { IImmigrant } from "./IImmigrant";

/**
 * Represents a grid in the simulation.
 */
export class Grid {
    rows: number = 36;
    cols: number = 36;
    cellsCount: number;
    cells: Cell[];
    //rename these to totalX
    populationCount: number = 0;
    susceptibleCount: number = 0;
    incubatedCount: number = 0;
    infectedCount: number = 0;
    recoveredCount: number = 0;
    nearestCities: number[] = [];
    immigrants: IImmigrant[] = [];
    largeCities: number[] = [];

    constructor(rows: number, cols: number, cellsStartPopulations: number[]) {
      this.cellsCount = rows * cols;
      if(cellsStartPopulations.length != this.cellsCount) throw new Error("Invalid population data provided")

      this.cells = new Array(this.cellsCount);
      // Assign population to each cell
      for(let i = 0; i < this.cellsCount; i++) {
        this.cells[i] = new Cell(cellsStartPopulations[i], cellsStartPopulations[i] * 2.5, i);
      }
  
      //find nearest city over population 50000 for every cell
      for (let i = 0; i < this.cellsCount; i++){
        this.nearestCities.push(this.FindClosestBigCity(i));
      }
  
      //find all large Cities
      for (let i = 0; i < this.cellsCount; i++){
        if (this.cells[i].PopulationCount >= 50000){
          this.largeCities.push(i);
        }
      }
  
      this.UpdateOverallCount();
    }
  
    get RowsCount(){return this.rows;}
    get ColsCount(){return this.cols;}
    get GetCells(){return this.cells;}
    get PopulationOverallCount(){return this.populationCount;}
    get InfectedOverallCount(){return this.infectedCount;}
    get IncubatedOverallCount(){return this.incubatedCount;}
    get RecoveredOverallCount(){return this.recoveredCount;}
    get SusceptibleOverallCount(){return this.susceptibleCount;}
  
    /**
     * Updates the overall count of population, incubated, infected, and recovered individuals in the grid.
     */
    UpdateOverallCount(){
      //reset counts
      this.populationCount = 0;
      this.incubatedCount = 0;
      this.infectedCount = 0;
      this.recoveredCount = 0;
      for (let i = 0; i < this.cells.length; i++){
        this.populationCount += this.cells[i].PopulationCount;
        this.incubatedCount += this.cells[i].IncubatedCount;
        this.infectedCount += this.cells[i].InfectedCount;
        this.recoveredCount += this.cells[i].RecoveredCount;
      }
    }
  
    /**
     * Retrieves the populated neighbors of a cell at the specified index.
     * @param index - The index of the cell.
     * @returns An array of indices representing the populated neighbors.
     */
    GetNeighbours(index: number){
      const neighbours: number[] = [];
      let possibleUp, possibleDown, possibleLeft, possibleRight;
      if (index / this.ColsCount >= 1) {
        neighbours.push(index - this.ColsCount); // up
        possibleUp = true;
      }
      if (index % this.ColsCount != this.ColsCount - 1) {
        neighbours.push(index + 1); // right
        possibleRight = true;
      }
      if (Math.floor(index / this.RowsCount) < this.RowsCount - 1) {
        neighbours.push(index + this.ColsCount); // down
        possibleDown = true;
      }
      if (index % this.ColsCount != 0) {
        neighbours.push(index - 1); //left
        possibleLeft = true;
      }
      // Moore neighbourhood (diagonals)
      if (possibleUp && possibleRight) {
        neighbours.push(index - this.ColsCount + 1);
      }
      if (possibleUp && possibleLeft) {
        neighbours.push(index - this.ColsCount - 1);
      }
      if (possibleDown && possibleRight) {
        neighbours.push(index + this.ColsCount + 1);
      }
      if (possibleDown && possibleLeft) {
        neighbours.push(index + this.ColsCount - 1);
      }
      //check if neighbours have population
      const populatedNeighbours = [];
      for (let i = 0; i < neighbours.length; i++){
        if (this.cells[neighbours[i]].PopulationCount > 0){
          populatedNeighbours.push(neighbours[i]);
        }
      }
      return populatedNeighbours;
    }
  
    /**
     * Finds the closest city with a population greater than 50000 to the cell at the given index.
     * @param index - The index of the cell.
     * @returns The index of the closest big city.
     */
    FindClosestBigCity(index: number){
      if (this.cells[index].PopulationCount >= 50000){
        //return if cell is itself a big city
        return index
      }else{
        const bigCities = [];
        const twoD = ConvertTo2DArray(this.cells);
        let row;
  
        //find big cities
        for (let i = 0; i < twoD.length; i++){
          row = twoD[i];
          for (let j = 0; j < row.length; j++){
            if(row[j].PopulationCount >= 50000){
              bigCities.push([j,i]);
            }
          }
        }

        if(bigCities.length == 0) return;
  
        //find XY of current cell
        const xy = [];
        for (let i = 0; i < twoD.length; i++){
          row = twoD[i];
          for (let j = 0; j < row.length; j++){
            if(row[j] == this.cells[index]){
              xy.push(j);//x
              xy.push(i);//y
            }
          }
        }
  
        //Find closest big city
        let x;
        let y;
        let smallest = 10000;//large num to be replaced by smaller distance
        let smallestIndex = [0,0];
        let distance;
        for (let i = 0; i < bigCities.length; i++){
          x = (bigCities[i])[0];
          y = (bigCities[i])[1];
          //pythagoras to find out distance between cells given x1,x2,y1,y2
          distance = Math.sqrt( (x - xy[0])*(x - xy[0]) + (y - xy[1])*(y - xy[1]) )
          if (distance < smallest){
            smallest = distance;
            smallestIndex = [x,y];
          }
        }
        return twoD[smallestIndex[1]][smallestIndex[0]].Index;
      }
    }
  
    /**
     * Simulates immigrations to neighbouring cells and large cities.
     * @param config - The configuration object for the simulation.
     */
    SimImmigrations(config: Configuration){
      const randomCells = [];
      for (let i = 0; i < 25; i++){
        const random = Math.floor(Math.random() * (1296 - 0 + 1) + 0);
        randomCells.push(random);
      }
      for (let i = 0; i < this.cells.length; i++){
        if (this.cells[i].PopulationCount > 0){
          const neighbours = this.GetNeighbours(i);
          //nearest big city for cell at index I
          neighbours.push(this.nearestCities[i]);
  
          //random big city
          if (randomCells.includes(i)){
            const random = Math.floor(Math.random() * ((this.largeCities.length) - 0 + 1) + 0);
            neighbours.push(this.largeCities[random]);
          }
  
          //equal amount go to all neighbours and big city/random city
          //No need to move rec/inc as they cant infected/be infected so makes no difference if they are simulated
          const toMoveArray = this.cells[i].GetImmigrants(config.immigrationRate, config.illImmigrationRate);
          const toMoveInf = Math.floor(toMoveArray[0] / neighbours.length);
          const toMoveSus = Math.floor(toMoveArray[1] / neighbours.length);
          //add devide by neighbours.length
          for(let j = 0; j < neighbours.length; j++) {
            //store immigrants origin and current location for move back later
            const immigrant: IImmigrant = {
              origin: i,
              neigh: neighbours[j],
              susPop: toMoveSus,
              infPop: toMoveInf,
              newInf: 0
            }
            this.immigrants.push(immigrant);
          }
        }
      }
    }
  
    /**
     * Returns immigrants to their original cells.
     */
    SimReturnImmigrations() {
      let imm;
      for (let i = 0; i < this.immigrants.length; i++){
        imm = this.immigrants[i];
        (this.cells[imm.origin]).ReturnImmigrants(imm.newInf);
      }
      this.immigrants = [];
    }
  
    /**
     * Resets the grid by creating new cells and finding the nearest city for each cell.
     * Also updates the overall count.
     * DEVNOTE: Currently unused.
     */
    ResetCells(cellsPopulation: number[]) {
      this.cells = new Array(this.cellsCount);
      for(let i = 0; i < this.cellsCount; i++) {
        this.cells[i] = new Cell(cellsPopulation[i], cellsPopulation[i] * 2.5, i);
      }
  
      //find nearest city over population 50000 for every cell
      for (let i = 0; i < this.cellsCount; i++){
        this.nearestCities.push(this.FindClosestBigCity(i));
      }
      this.UpdateOverallCount();
    }
  
    /**
     * Sets a cell as infected.
     * @param index - The index of the cell to set as infected.
     */
    SetAsInfected(index: number) { //Add infected to user clicked cell
      this.cells[index].AddInfected(this.cells[index].PopulationCount / 10);
      this.UpdateOverallCount();
    }
  
    /**
     * Steps the simulation forward by one day.
     * @param {Configuration} config - The configuration object for the simulation.
     */
    Next(config: Configuration) { //Step the simulation forward (1 day)
      this.SimImmigrations(config);
      // Simulates natural deaths, deaths caused by the virus and new births.
      this.cells.forEach((cell, index) => {
        cell.SimNaturalDeaths(config.naturalDeathRate);
        cell.SimVirusMorbidity(config.ageDist, config.ageMort);
        cell.SimBirths(config.birthRate);
        //update immigrants list with updated infectious/recovered immigrants
        this.immigrants = cell.SimInfections(config.contactInfectionRate, config.incPeriod, index, this.immigrants);
      });
  
      //return immigrants to original cells
      this.SimReturnImmigrations();

      this.cells.forEach((cell) => {
        cell.SimRecoveries(config.infPeriod);
      });
      
      this.UpdateOverallCount();
    }
  }
  