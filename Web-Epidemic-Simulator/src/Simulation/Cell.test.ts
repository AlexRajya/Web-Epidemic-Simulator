import { describe, expect, test } from 'vitest'
import { Cell } from './Cell';

describe('GetPopulationCount tests', () => {
    test('It should take into account all stages in the count', () => {
        const cell = new Cell(100, 1000, 1);
        cell.infected.push(5);
        cell.incubated.push(5);
        cell.recovered = 10;

        expect(cell.PopulationCount).toBe(120);
    })
});

describe('GetInfectedCount tests', () => {
    test('It should take into account all elements in the queue for the count', () => {
        const cell = new Cell(100, 1000, 1);
        cell.infected.push(5);
        cell.infected.push(5);
        cell.infected.push(5);

        expect(cell.InfectedCount).toBe(15);
    })
});

describe('GetIncubatedCount tests', () => {
    test('It should take into account all elements in the queue for the count', () => {
        const cell = new Cell(100, 1000, 1);
        cell.incubated.push(5);
        cell.incubated.push(5);
        cell.incubated.push(5);

        expect(cell.IncubatedCount).toBe(15);
    })
});

describe('GetSusceptibleCount tests', () => {
    test('It should return the susceptible count', () => {
        const cell = new Cell(100, 1000, 1);
        expect(cell.SusceptibleCount).toBe(100);
    })
});

describe('GetRecoveredCount tests', () => {
    test('It should return the recovered count', () => {
        const cell = new Cell(100, 1000, 1);
        cell.recovered = 10;
        expect(cell.RecoveredCount).toBe(10);
    })
});

describe('GetImmigrants tests', () => {
    test('It should calculate the number of infected and susceptible individuals to move', () => {
        const cell = new Cell(100, 1000, 1);
        cell.infected.push(5);
        cell.infected.push(5);
        cell.infected.push(5);
        cell.susceptible = 100;

        const immigrationRate = 0.1;
        const illImmigrationRate = 0.2;

        const [toMoveInf, toMoveSus] = cell.GetImmigrants(immigrationRate, illImmigrationRate);

        expect(toMoveInf).toBe(3);
        expect(toMoveSus).toBe(10);
        expect(cell.infAway).toBe(3);
        expect(cell.susAway).toBe(10);
    });
});

describe('ReturnImmigrants tests', () => {
    test('It should add newly infected to the incubated queue', () => {
        const cell = new Cell(100, 1000, 1);
        cell.ReturnImmigrants(5);

        expect(cell.incubated).toEqual([5]);
    });

    test('It should decrease the susceptible count by the number of new infected', () => {
        const cell = new Cell(100, 1000, 1);
        cell.ReturnImmigrants(5);

        expect(cell.susceptible).toBe(95);
    });

    test('It should set the susceptible count to 0 if it becomes negative', () => {
        const cell = new Cell(3, 1000, 1);
        cell.ReturnImmigrants(5);

        expect(cell.susceptible).toBe(0);
    });

    test('It should reset the infAway and susAway counts to 0', () => {
        const cell = new Cell(100, 1000, 1);
        cell.infAway = 3;
        cell.susAway = 5;
        cell.ReturnImmigrants(5);

        expect(cell.infAway).toBe(0);
        expect(cell.susAway).toBe(0);
    });
});