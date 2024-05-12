import { Cell } from "../Cell";
import { Grid } from "../Grid";

//Convert array of cells into 2D array
export function ConvertTo2DArray(cells: Cell[], rowSize: number) {
    let temp = [];
    const twoD = [];
    for (let i = 0; i < cells.length; i++){
      temp.push(cells[i]);
      if (temp.length == rowSize){
        twoD.push(temp);
        temp = [];
      }
    }
    return twoD;
}

export function PickRandomCell(grid: Grid, cols: number, rows: number) {
  let cell = Math.floor(Math.random() * cols * rows);
  while (grid.cells[cell].PopulationCount === 0) {
    cell = Math.floor(Math.random() * cols * rows);
  }
  return cell;
}

