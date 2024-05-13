import { describe, expect, it, vi } from "vitest";
import { Grid } from "./Grid";
import { Configuration, Preset } from "./Configuration";

describe("Grid", () => {
  describe("UpdateOverallCount", () => {
    it("should update the overall counts correctly", () => {
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

  describe("SetAsInfected", () => {
    it("should add infected to the user clicked cell and update overall counts", () => {
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

  describe("GetNeighbours", () => {
    it("should return the correct populated neighbours", () => {
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

    it("should return an empty array if no populated neighbours exist", () => {
      const grid = new Grid(2, 2, [0, 0, 0, 0]);

      // Test case: index = 0 (top-left corner)
      const neighbours = grid.GetNeighbours(0);
      expect(neighbours).toEqual([]);
    });
  });

  describe("FindClosestBigCity", () => {
    it("should return the index of the closest big city", () => {
      const grid = new Grid(
        3,
        3,
        [10000, 20000, 30000, 40000, 50000, 60000, 10000, 80000, 10000]
      );

      // Test case 1: index = 0 (top-left corner)
      let closestBigCityIndex = grid.FindClosestBigCity(0);
      expect(closestBigCityIndex).toBe(4);

      // Test case 2: index = 4 (center)
      closestBigCityIndex = grid.FindClosestBigCity(4);
      expect(closestBigCityIndex).toBe(4); //Is a big city

      // Test case 3: index = 8 (bottom-right corner)
      closestBigCityIndex = grid.FindClosestBigCity(8);
      expect(closestBigCityIndex).toBe(5);

      // Test case 4: index = 1 (top edge)
      closestBigCityIndex = grid.FindClosestBigCity(1);
      expect(closestBigCityIndex).toBe(4);

      // Test case 5: index = 7 (bottom edge)
      closestBigCityIndex = grid.FindClosestBigCity(7);
      expect(closestBigCityIndex).toBe(7);

      // Test case 6: index = 3 (left edge)
      closestBigCityIndex = grid.FindClosestBigCity(3);
      expect(closestBigCityIndex).toBe(4);

      // Test case 7: index = 5 (right edge)
      closestBigCityIndex = grid.FindClosestBigCity(5);
      expect(closestBigCityIndex).toBe(5);
    });

    it("should return undefined if no big cities exist", () => {
      const grid = new Grid(2, 2, [10000, 20000, 30000, 40000]);

      // Test case: index = 0 (top-left corner)
      const closestBigCityIndex = grid.FindClosestBigCity(0);
      expect(closestBigCityIndex).toBeUndefined();
    });
  });

  describe("SimImmigrations", () => {
    it("should simulate immigrations correctly", () => {
      const grid = new Grid(3, 3, [10, 20, 30, 40, 50000, 60, 70000, 80, 90]);
      const config = new Configuration(Preset.COVID_19);

      // Call the method to simulate immigrations
      grid.SimImmigrations(config);

      // Assert that the immigrants are added correctly
      expect(grid.immigrants.length).toBeGreaterThanOrEqual(57);

      // Assert that the immigrants' origin and current location are valid
      for (const immigrant of grid.immigrants) {
        expect(immigrant.origin).toBeGreaterThanOrEqual(0);
        expect(immigrant.origin).toBeLessThan(grid.cells.length);
        expect(immigrant.neigh).toBeGreaterThanOrEqual(0);
        expect(immigrant.neigh).toBeLessThan(grid.cells.length);
      }
    });
  });

  describe("SimReturnImmigrations", () => {
    it("should return immigrants to their origin cells and clear the immigrants array", () => {
      const originalPopulations = [10, 20, 30, 40];
      const grid = new Grid(2, 2, originalPopulations);
      const config = new Configuration(Preset.COVID_19);
      grid.SimImmigrations(config);
      expect(grid.immigrants.length).toBe(12);
      expect(grid.cells[3].susAway).toBe(20);

      // Call the method to simulate returning immigrants
      grid.SimReturnImmigrations();

      grid.cells.forEach((cell) => {
        expect(cell.infAway).toBe(0);
        expect(cell.susAway).toBe(0);
        expect(cell.PopulationCount).toBe(originalPopulations[cell.Index]);
      });

      // Assert that the immigrants array is cleared
      expect(grid.immigrants.length).toBe(0);
    });
  });

  describe("Next tests", () => {
    it("should step the simulation forward by 1 day", () => {
      const grid = new Grid(2, 2, [10, 20, 30, 40]);
      const simulateImmigrationsSpy = vi.spyOn(grid, "SimImmigrations");
      const simulateReturnImmigrationsSpy = vi.spyOn(
        grid,
        "SimReturnImmigrations"
      );
      const updateOverallCountSpy = vi.spyOn(grid, "UpdateOverallCount");
      grid.cells.forEach((cell) => {
        vi.spyOn(cell, "SimNaturalDeaths");
        vi.spyOn(cell, "SimVirusMorbidity");
        vi.spyOn(cell, "SimBirths");
        vi.spyOn(cell, "SimInfections");
        vi.spyOn(cell, "SimRecoveries");
      });
      const config = new Configuration(Preset.COVID_19);

      // Call the Next method to step the simulation forward
      grid.Next(config);

      // Assert that SimImmigrations is called
      expect(simulateImmigrationsSpy).toHaveBeenCalledWith(config);

      // Assert that SimNaturalDeaths, SimVirusMorbidity, SimBirths, and SimInfections are called for each cell
      grid.cells.forEach((cell) => {
        expect(cell.SimNaturalDeaths).toHaveBeenCalledWith(
          config.naturalDeathRate
        );
        expect(cell.SimVirusMorbidity).toHaveBeenCalledWith(
          config.ageDist,
          config.ageMort
        );
        expect(cell.SimBirths).toHaveBeenCalledWith(config.birthRate);
        expect(cell.SimInfections).toHaveBeenCalled();
      });

      // Assert that SimReturnImmigrations is called
      expect(simulateReturnImmigrationsSpy).toHaveBeenCalled();

      // Assert that SimRecoveries is called for each cell
      grid.cells.forEach((cell) => {
        expect(cell.SimRecoveries).toHaveBeenCalledWith(config.infPeriod);
      });

      // Assert that UpdateOverallCount is called
      expect(updateOverallCountSpy).toHaveBeenCalled();
    });
  });
});
