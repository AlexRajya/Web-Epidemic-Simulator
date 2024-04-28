import { Cell } from "./Cell";
import { Configuration } from "./Configuration";
import { cellsPopulation } from "./Data/GermanyPopulationDensity";
import { ConvertTo2DArray } from "./Helpers/ConvertTo2DArray";
import { IImmigrant } from "./IImmigrant";

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

    constructor() {
      this.cellsCount = this.RowsCount * this.ColsCount;
      this.cells = new Array(this.cellsCount);
      // Assign population to each cell
      for(let i = 0; i < this.cellsCount; i++) {
        this.cells[i] = new Cell(cellsPopulation[i], cellsPopulation[i] * 2.5, i);
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
    }
  
    get RowsCount(){return this.rows;}
    get ColsCount(){return this.cols;}
    get GetCells(){return this.cells;}
    get PopulationOverallCount(){return this.populationCount;}
    get InfectedOverallCount(){return this.infectedCount;}
    get IncubatedOverallCount(){return this.incubatedCount;}
    get RecoveredOverallCount(){return this.recoveredCount;}
    get SusceptibleOverallCount(){return this.susceptibleCount;}
  
    UpdateOverallCount(){//Get total count from all cells
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
  
    GetNeighbours(index: number){//Find neighbours of cell at index
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
  
    FindClosestBigCity(index: number){//Find closest city of pop > 50000 to cell at index
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
  
    SimImmigrations(config: Configuration){ //Sim immigrations to neighbouring cells/Large cities
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
  
    SimReturnImmigrations() { //Return immigrants to original cells  
      let imm;
      for (let i = 0; i < this.immigrants.length; i++){
        imm = this.immigrants[i];
        (this.cells[imm.origin]).ReturnImmigrants(imm.newInf);
      }
      this.immigrants = [];
    }
  
    ResetCells() { //Reset grid
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
  
    SetAsInfected(index: number) { //Add infected to user clicked cell
      this.cells[index].AddInfected(this.cells[index].PopulationCount / 10);
      this.UpdateOverallCount();
    }
  
    Next(config: Configuration) { //Step the simulation forward (1 day)
      this.SimImmigrations(config);
      // Simulates natural deaths, deaths caused by the virus and new births.
      for(let i = 0; i < this.cellsCount; i++) {
        this.cells[i].SimNaturalDeaths(config.naturalDeathRate);
        this.cells[i].SimVirusMorbidity(config.ageDist, config.ageMort);
        this.cells[i].SimBirths(config.birthRate);
        //update immigrants list with updated infectious/recovered immigrants
        this.immigrants = this.cells[i].SimInfections(config.contactInfectionRate, config.incPeriod, i, this.immigrants);
      }
  
      //return immigrants to original cells
      this.SimReturnImmigrations();
      for(let i = 0; i < this.cellsCount; i++) {
        this.cells[i].SimRecoveries(config.infPeriod);
      }
      this.UpdateOverallCount();
    }
  }
  