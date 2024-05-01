import { describe, expect, it } from 'vitest';
import { Grid } from './Grid';

describe('Grid', () => {
  describe('UpdateOverallCount', () => {
    it('should update the overall counts correctly', () => {
        const grid = new Grid(2, 2, [10, 20, 30, 40]);
        grid.cells[0].incubated.push(5);
        grid.cells[0].infected.push(10);
        grid.cells[1].infected.push(10);
        grid.cells[1].recovered = 10;

        // Call the method to update the overall counts
        grid.UpdateOverallCount();

        // Assert that the overall counts are updated correctly
        expect(grid.populationCount).toBe(135);
        expect(grid.incubatedCount).toBe(5);
        expect(grid.infectedCount).toBe(20);
        expect(grid.recoveredCount).toBe(10);
    });
  });

  describe('SetAsInfected', () => {
    it('should add infected to the user clicked cell and update overall counts', () => {
      const grid = new Grid(2, 2, [10, 20, 30, 40]);
      const index = 0;

      // Call the method to set the cell as infected
      grid.SetAsInfected(index);

      // Assert that the infected count is updated correctly
      expect(grid.cells[index].InfectedCount).toBe(1);

      // Assert that the overall counts are updated correctly
      expect(grid.populationCount).toBe(101);
      expect(grid.incubatedCount).toBe(0);
      expect(grid.infectedCount).toBe(1);
      expect(grid.recoveredCount).toBe(0);
    });
  });

  describe('GetNeighbours', () => {
    it('should return the correct populated neighbours', () => {
      const grid = new Grid(3, 3, [10, 20, 30, 40, 50, 60, 70, 80, 90]);

      // Test case 1: index = 0 (top-left corner)
      let neighbours = grid.GetNeighbours(0);
      expect(neighbours.sort()).toEqual([1, 3, 4]);

      // Test case 2: index = 4 (center)
      neighbours = grid.GetNeighbours(4);
      expect(neighbours.sort()).toEqual([0, 1, 2, 3, 5, 6, 7, 8]);

      // Test case 3: index = 8 (bottom-right corner)
      neighbours = grid.GetNeighbours(8);
      expect(neighbours.sort()).toEqual([4, 5, 7]);

      // Test case 4: index = 1 (top edge)
      neighbours = grid.GetNeighbours(1);
      expect(neighbours.sort()).toEqual([0, 2, 3, 4, 5]);

      // Test case 5: index = 7 (bottom edge)
      neighbours = grid.GetNeighbours(7);
      expect(neighbours.sort()).toEqual([3, 4, 5, 6, 8]);

      // Test case 6: index = 3 (left edge)
      neighbours = grid.GetNeighbours(3);
      expect(neighbours.sort()).toEqual([0, 1, 4, 6, 7]);

      // Test case 7: index = 5 (right edge)
      neighbours = grid.GetNeighbours(5);
      expect(neighbours.sort()).toEqual([1, 2, 4, 7, 8]);
    });

    it('should return an empty array if no populated neighbours exist', () => {
      const grid = new Grid(2, 2, [0, 0, 0, 0]);

      // Test case: index = 0 (top-left corner)
      const neighbours = grid.GetNeighbours(0);
      expect(neighbours).toEqual([]);
    });
  });
});
