import { IImmigrant } from "./IImmigrant";

export class Cell {
    populationLimit: number;
    susceptible: number;
    incubated: number[] = []; //This array represents a queue
    infected: number[] = []; //This array represents a queue
    recovered: number = 0;
    susAway: number = 0;
    infAway: number = 0;
    index_: number;

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
  
    AddInfected(val: number) {
      this.infected.push(val);//Add to infected queue
    }
  
    GetImmigrants(immigrationRate: number, illImmigrationRate: number) {
      const toMoveInf = this.InfectedCount * illImmigrationRate;
      this.infAway = Math.floor(toMoveInf);
      //no need to remove from counts as taken away from equations
      const toMoveSus = this.susceptible * immigrationRate;
      this.susAway = Math.floor(toMoveSus);
  
      return [toMoveInf, toMoveSus];
    }
  
    ReturnImmigrants(newInf: number){ //Simulate immigrants returning to origin cell
      //add newly infected to incubated queue
      if (this.incubated.length > 0){
        this.incubated[(this.incubated.length - 1)] += newInf;
      }else{
        this.incubated[0] = newInf;
      }
      this.susceptible -= newInf;
      if (this.susceptible < 0){
        this.susceptible = 0;//Rounding may cause negative in rare cases
      }
      this.susAway = 0;
      this.infAway = 0;
    }
  
    SimNaturalDeaths(prob: number) { //Simulate natural deaths
      this.susceptible -=  Math.round(this.susceptible * prob);
      //Apply natural death prob to all in queue
      for (let i = 0; i < this.incubated.length; i++) {
        this.incubated[i] -=  Math.round(this.incubated[i] * prob);
      }
      //Apply natural death prob to all in queue
      for (let i = 0; i < this.infected.length; i++) {
        this.infected[i] -=  Math.round(this.infected[i] * prob);
      }

      this.recovered -= Math.round(this.recovered * prob);
    }
  
    SimVirusMorbidity(ageDist: number[], ageMort: number[]) { //Simulate deaths caused by virus
      for (let i = 0; i < this.incubated.length; i++) {
        for (let j  = 0; i < ageMort.length; i++){
          this.incubated[i] -= Math.round(this.incubated[i]*ageDist[j]*ageMort[j]);
        }
      }
      for (let i = 0; i < this.infected.length; i++) {
        for (let j  = 0; i < ageMort.length; i++){
          this.infected[i] -= Math.round(this.infected[i]*ageDist[j]*ageMort[j]);
        }
      }
    }
  
    SimBirths(prob: number) { //Simulate natural births
      let newBorns = Math.round(this.PopulationCount * prob);
      if(this.PopulationCount + newBorns > this.populationLimit) {
        newBorns = 0;
      }
      this.susceptible += newBorns;
    }
  
    SimInfections(prob: number, incPeriod: number, index: number, immigrants: IImmigrant[]){ //Sim new infections
      //Get counts from immigrants
      let immigrantsInf = 0;
      let immigrantsSus = 0;
      for (let i = 0; i < immigrants.length; i++){
        if (immigrants[i].neigh == index){
          immigrantsInf += immigrants[i].infPop;
          immigrantsSus += immigrants[i].susPop;
        }
      }
      const immigrantsPop = immigrantsInf+immigrantsSus;
  
      if (this.PopulationCount > 0){
        //Calc infection prob using total inf + immigrants
        const percentageInfected = ((this.InfectedCount + immigrantsInf) - this.infAway)
                                / ((this.PopulationCount + immigrantsPop) - this.susAway - this.infAway);
  
        let infectionProb = prob * percentageInfected;
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
        for (let i = 0; i < immigrants.length; i++){
          if (immigrants[i].neigh == index){
            newIncubated = Math.round(immigrants[i].susPop * infectionProb);
            immigrants[i].newInf += newIncubated;
          }
        }
      }
      return immigrants;
    }
    
    SimRecoveries(infLength: number) { //Simulate recovering from virus
      if (this.infected.length > infLength){
        const newRecovered = this.infected[0];
        this.infected.shift();
        this.recovered += newRecovered;
      }
    }
  }