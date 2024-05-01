import { describe, expect, test } from 'vitest'
import { Cell } from './Cell';
import { IImmigrant } from './IImmigrant';

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

describe('SimNaturalDeaths tests', () => {
    test('It should simulate natural deaths for susceptible individuals', () => {
        const cell = new Cell(100, 1000, 1);
        const probOfNaturalDeath = 0.1;

        cell.SimNaturalDeaths(probOfNaturalDeath);

        expect(cell.susceptible).toBe(90);
    });

    test('It should simulate natural deaths for incubated individuals', () => {
        const cell = new Cell(100, 1000, 1);
        const probOfNaturalDeath = 0.1;
        cell.incubated.push(5);
        cell.incubated.push(10);

        cell.SimNaturalDeaths(probOfNaturalDeath);

        expect(cell.incubated).toEqual([4, 9]);
    });

    test('It should simulate natural deaths for infected individuals', () => {
        const cell = new Cell(100, 1000, 1);
        const probOfNaturalDeath = 0.1;
        cell.infected.push(5);
        cell.infected.push(10);

        cell.SimNaturalDeaths(probOfNaturalDeath);

        expect(cell.infected).toEqual([4, 9]);
    });

    test('It should simulate natural deaths for recovered individuals', () => {
        const cell = new Cell(100, 1000, 1);
        const probOfNaturalDeath = 0.1;
        cell.recovered = 10;

        cell.SimNaturalDeaths(probOfNaturalDeath);

        expect(cell.recovered).toBe(9);
    });
});

describe('SimVirusMorbidity tests', () => {
    test('It should simulate deaths caused by the virus', () => {
        const cell = new Cell(100, 1000, 1);
        const ageDist = [0.2, 0.3, 0.5];
        const ageMort = [0.1, 0.2, 0.3];
        cell.infected = [10, 20, 30];

        cell.SimVirusMorbidity(ageDist, ageMort);

        expect(cell.infected).toEqual([8, 16, 23]);
    });
});

describe('SimBirths tests', () => {
    test('It should simulate natural births and increase the susceptible count', () => {
        const cell = new Cell(100, 1000, 1);
        const prob = 0.1;

        cell.SimBirths(prob);

        expect(cell.susceptible).toBe(110);
    });

    test('It should not simulate natural births if the population exceeds the limit', () => {
        const cell = new Cell(100, 100, 1);
        const prob = 0.1;

        cell.SimBirths(prob);

        expect(cell.susceptible).toBe(100);
    });
});

describe('SimInfections tests', () => {
    test('It should simulate new infections and update the population counts', () => {
        const cell = new Cell(100, 1000, 1);
        const probOfCatchingInfection = 0.9;
        const incPeriod = 3;
        const index = 1;
        const immigrants: IImmigrant[] = [
            { neigh: 1, infPop: 5, susPop: 10, newInf: 1, origin: 0 },
            { neigh: 2, infPop: 3, susPop: 8, newInf: 0, origin: 0 },
            { neigh: 1, infPop: 2, susPop: 5, newInf: 0, origin: 0 }
        ];

        const updatedImmigrants = cell.SimInfections(probOfCatchingInfection, incPeriod, index, immigrants);

        expect(updatedImmigrants).toEqual([
            { neigh: 1, infPop: 5, susPop: 10, newInf: 2, origin: 0 },
            { neigh: 2, infPop: 3, susPop: 8, newInf: 0, origin: 0 },
            { neigh: 1, infPop: 2, susPop: 5, newInf: 0, origin: 0 }
        ]);
        expect(cell.incubated).toEqual([5]);
        expect(cell.susceptible).toBe(95);
        expect(cell.infected).toEqual([0]);
    });

    test('It should handle cases where the population count is 0', () => {
        const cell = new Cell(0, 1000, 1);
        const probOfCatchingInfection = 0.2;
        const incPeriod = 3;
        const index = 1;
        const immigrants: IImmigrant[] = [
            { neigh: 1, infPop: 5, susPop: 10, newInf: 0, origin: 0},
            { neigh: 2, infPop: 3, susPop: 8, newInf: 0, origin: 0 },
            { neigh: 1, infPop: 2, susPop: 5, newInf: 0, origin: 0 }
        ];

        const updatedImmigrants = cell.SimInfections(probOfCatchingInfection, incPeriod, index, immigrants);

        expect(updatedImmigrants).toEqual(immigrants);
        expect(cell.incubated).toEqual([]);
        expect(cell.susceptible).toBe(0);
        expect(cell.infected).toEqual([]);
    });
});

describe('SimRecoveries tests', () => {
    test('It should simulate recoveries and update the recovered count', () => {
        const cell = new Cell(100, 1000, 1);
        cell.infected = [10, 20, 30];
        const infectionLifespan = 2;

        cell.SimRecoveries(infectionLifespan);

        expect(cell.infected).toEqual([20, 30]);
        expect(cell.recovered).toBe(10);
    });

    test('It should not update the recovered count if there are no infected individuals', () => {
        const cell = new Cell(100, 1000, 1);
        const infectionLifespan = 2;

        cell.SimRecoveries(infectionLifespan);

        expect(cell.infected).toEqual([]);
        expect(cell.recovered).toBe(0);
    });

    test('It should not update the recovered count if the infection lifespan is greater than the number of infected individuals', () => {
        const cell = new Cell(100, 1000, 1);
        cell.infected = [10, 20, 30];
        const infectionLifespan = 4;

        cell.SimRecoveries(infectionLifespan);

        expect(cell.infected).toEqual([10, 20, 30]);
        expect(cell.recovered).toBe(0);
    });
});