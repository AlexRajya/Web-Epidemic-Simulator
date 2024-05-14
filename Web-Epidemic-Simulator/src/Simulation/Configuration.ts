export interface IConfiguration {
  immigrationRate: number;
  birthRate: number;
  naturalDeathRate: number;
  incPeriod: number;
  contactInfectionRate: number;
  infPeriod: number;
  illImmigrationRate: number;
  ageMort: number[];
  ageDist: number[];
}

export const covid19 = {
  immigrationRate: 0.5,
  birthRate: 0.0001,
  naturalDeathRate: 0.0001,
  incPeriod: 3,
  contactInfectionRate: 0.4,
  infPeriod: 9,
  illImmigrationRate: 0.15,
  ageMort: [
    0, 0.0005, 0.00105, 0.001875, 0.00295, 0.008, 0.027, 0.07975, 0.159,
  ],
  ageDist: [
    //For Germany
    0.092, 0.096, 0.112, 0.128, 0.125, 0.162, 0.124, 0.088, 0.069,
  ],
};
