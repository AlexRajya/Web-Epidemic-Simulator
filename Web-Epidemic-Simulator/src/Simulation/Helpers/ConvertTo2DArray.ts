import { Cell } from "../Cell";

//Convert array of cells into 2D array
export function ConvertTo2DArray(cells: Cell[], rowSize: number = 36) {
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