import { IImmigrant } from "./IImmigrant";

/**
 * Represents a cell in the simulation.
 * A cell represents a single location in the simulation grid with a population in various stages of infection.
 */
export class Cell {
    populationLimit: number = 0;
    susceptible: number = 0;
    incubated: number[] = []; //This array represents a queue
    infected: number[] = []; //This array represents a queue
    recovered: number = 0;
    susAway: number = 0;
    infAway: number = 0;
    index_: number = 0;

    constructor(population: number, populationLimit: number, index: number) {
      this.populationLimit = populationLimit;
      this.susceptible = population;
      this.index_ = index;
    }
  
    get PopulationCount() { //Return overall population count
      return Math.round(this.IncubatedCount + this.InfectedCount +
        this.recovered + this.susceptible - this.susAway - this.infAway);
    }
  
    get InfectedCount() {return Math.round((this.infected).reduce((a, b) => a + b, 0));}
    get IncubatedCount() {return Math.round((this.incubated).reduce((a, b) => a + b, 0));}
    get SusceptibleCount() {return this.susceptible;}
    get RecoveredCount() {return Math.round(this.recovered);}
    get Index() {return this.index_;}
  
    /**
     * Adds a value to the infected queue.
     * @param val - The value to add to the infected queue.
     */
    AddInfected(val: number) {
      this.infected.push(val);//Add to infected queue
    }
  
    /**
     * Calculates the number of immigrants to be moved from the current cell.
     * @param immigrationRate - The rate of immigration for susceptible individuals.
     * @param illImmigrationRate - The rate of immigration for infected individuals.
     * @returns An array containing the number of infected and susceptible individuals to be moved.
     */
    GetImmigrants(immigrationRate: number, illImmigrationRate: number) {
      const toMoveInf = this.InfectedCount * illImmigrationRate;
      this.infAway = Math.floor(toMoveInf);
      //no need to remove from counts as taken away from equations
      const toMoveSus = this.susceptible * immigrationRate;
      this.susAway = Math.floor(toMoveSus);
  
      return [toMoveInf, toMoveSus];
    }
  
    /**
     * Adds newly infected individuals to the incubated queue and updates the susceptible, susAway, and infAway properties.
     * @param newInfected - The number of newly infected individuals to add to the incubated queue.
     */
    ReturnImmigrants(newInfected: number) {
      //add newly infected to incubated queue
      if (this.incubated.length > 0){
        this.incubated[this.incubated.length - 1] += newInfected;
      }else{
        this.incubated.push(newInfected);
      }

      this.susceptible -= newInfected;
      if (this.susceptible < 0){
        this.susceptible = 0;//Rounding may cause negative in rare cases
      }
      this.susAway = 0;
      this.infAway = 0;
    }
  
    /**
     * Simulates natural deaths in the cell population based on the given probability.
     * @param probOfNaturalDeath - The probability of natural death.
     */
    SimNaturalDeaths(probOfNaturalDeath: number) {
      this.susceptible -=  Math.round(this.susceptible * probOfNaturalDeath);
      //Apply natural death prob to all in queue
      for (let i = 0; i < this.incubated.length; i++) {
        this.incubated[i] -= Math.round(this.incubated[i] * probOfNaturalDeath);
      }
      //Apply natural death prob to all in queue
      for (let i = 0; i < this.infected.length; i++) {
        this.infected[i] -= Math.round(this.infected[i] * probOfNaturalDeath);
      }

      this.recovered -= Math.round(this.recovered * probOfNaturalDeath);
    }
  
    /**
     * Simulates deaths caused by the virus based on age distribution and mortality rates.
     * @param ageDist - An array representing the age distribution.
     * @param ageMort - An array representing the mortality rates for each age group.
     */
    SimVirusMorbidity(ageDist: number[], ageMort: number[]) { 
      for (let i = 0; i < this.infected.length; i++) {
        for (let j  = 0; j < ageMort.length; j++){
          this.infected[i] -= Math.round(this.infected[i]*ageDist[j]*ageMort[j]);
        }
      }
    }
  
    /**
     * Simulates natural births in the cell.
     * @param prob - The probability of a birth occurring.
     */
    SimBirths(prob: number) {
      let newBorns = Math.round(this.PopulationCount * prob);
      if(this.PopulationCount + newBorns > this.populationLimit) {
        newBorns = 0;
      }
      this.susceptible += newBorns;
    }
  
    /**
     * Simulates new infections in the cell.
     * @param probOfCatchingInfection - The probability of catching an infection.
     * @param incPeriod - The incubation period for the infection.
     * @param index - The index of the cell.
     * @param immigrants - An array of immigrants.
     * @returns An array of immigrants.
     */
    SimInfections(probOfCatchingInfection: number, incPeriod: number, index: number, immigrants: IImmigrant[]){
      //Get counts from immigrants
      let immigrantsInf = 0;
      let immigrantsSus = 0;

      immigrants.forEach((immigrant) => {
        if (immigrant.neigh == index){
          immigrantsInf += immigrant.infPop;
          immigrantsSus += immigrant.susPop;
        }
      })

      const immigrantsPop = immigrantsInf+immigrantsSus;
  
      if (this.PopulationCount > 0){
        //Calc infection prob using total inf + immigrants
        const percentageInfected = ((this.InfectedCount + immigrantsInf) - this.infAway)
                                / ((this.PopulationCount + immigrantsPop) - this.susAway - this.infAway);
        
        let infectionProb = probOfCatchingInfection * percentageInfected;
        if (infectionProb < 0){
          infectionProb = 0;
        }else if (infectionProb > 1){
          infectionProb = 1;
        }
  
        //Add newly infected
        let newIncubated = Math.round(this.susceptible * infectionProb);
        this.incubated.push(newIncubated);
        this.susceptible -= newIncubated;
        if (this.susceptible < 0){
          this.susceptible = 0;
        }
        //check if any incubated turns into infectious based on length of queue
        if (this.incubated.length > incPeriod){
          const newInfected = this.incubated[0];
          this.infected.push(newInfected);
          this.incubated.shift();
        }else{
          this.infected.push(0);
        }
  
        //Sim immigrants becoming infected
        immigrants.forEach((immigrant) => {
          if (immigrant.neigh == index){
            newIncubated = Math.round(immigrant.susPop * infectionProb);
            immigrant.newInf += newIncubated;
          }
        });
      }
      return immigrants;
    }
    
    /**
     * Simulates recovering from the virus.
     * @param infectionLifespan - The lifespan of the infection.
     */
    SimRecoveries(infectionLifespan: number) {
      if (this.infected.length > infectionLifespan){
        const newRecovered = this.infected.shift();
        if(newRecovered){
          this.recovered += newRecovered;
        }
      }
    }
  }