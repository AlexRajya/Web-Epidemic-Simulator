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
});