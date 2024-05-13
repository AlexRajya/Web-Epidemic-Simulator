export enum Preset {
  COVID_19,
  INFLUENZA,
  COVID_19_MASKS,
  COVID_19_LOCKDOWN,
}

//Configuration class
export class Configuration {
  constructor(preset: Preset = Preset.COVID_19) {
    this.loadPredefinedSettings(preset);
  }

  immigrationRate_: number = 0;
  birthRate_: number = 0;
  naturalDeathRate_: number = 0;
  virusMorbidity_: number = 0;
  incPeriod_: number = 0;
  contactInfectionRate_: number = 0;
  infPeriod_: number = 0;
  illImmigrationRate_: number = 0;
  ageMort: number[] = []; //TODO: use constructor properly
  ageDist: number[] = [];

  get immigrationRate() {
    return this.immigrationRate_;
  }
  get birthRate() {
    return this.birthRate_;
  }
  get naturalDeathRate() {
    return this.naturalDeathRate_;
  }
  get virusMorbidity() {
    return this.virusMorbidity_;
  }
  get incPeriod() {
    return this.incPeriod_;
  }
  get contactInfectionRate() {
    return this.contactInfectionRate_;
  }
  get infPeriod() {
    return this.infPeriod_;
  }
  get illImmigrationRate() {
    return this.illImmigrationRate_;
  }

  loadPredefinedSettings(id: Preset) {
    //Load preset
    if (id == Preset.COVID_19) {
      //COVID-19
      this.immigrationRate_ = 0.5;
      this.birthRate_ = 0.0001;
      this.naturalDeathRate_ = 0.0001;
      this.ageMort = [
        0, 0.0005, 0.00105, 0.001875, 0.00295, 0.008, 0.027, 0.07975, 0.159,
      ];
      this.ageDist = [
        //For Germany
        0.092, 0.096, 0.112, 0.128, 0.125, 0.162, 0.124, 0.088, 0.069,
      ];
      this.incPeriod_ = 3;
      this.contactInfectionRate_ = 0.4;
      this.infPeriod_ = 9;
      this.illImmigrationRate_ = 0.15;
    } else if (id == Preset.INFLUENZA) {
      //Influenza
      this.immigrationRate_ = 0.5;
      this.birthRate_ = 0.0001;
      this.naturalDeathRate_ = 0.0001;
      this.ageMort = [
        0, 0.0005, 0.00105, 0.001875, 0.00295, 0.008, 0.027, 0.07975, 0.159,
      ];
      this.ageDist = [
        //For Germany
        0.092, 0.096, 0.112, 0.128, 0.125, 0.162, 0.124, 0.088, 0.069,
      ];
      this.incPeriod_ = 2;
      this.contactInfectionRate_ = 0.35;
      this.infPeriod_ = 4;
      this.illImmigrationRate_ = 0.15;
    } else if (id == Preset.COVID_19_LOCKDOWN) {
      //COVID-19 Lockdown
      this.immigrationRate_ = 0.05;
      this.birthRate_ = 0.0001;
      this.naturalDeathRate_ = 0.0001;
      this.ageMort = [
        0, 0.0005, 0.00105, 0.001875, 0.00295, 0.008, 0.027, 0.07975, 0.159,
      ];
      this.ageDist = [
        //For Germany
        0.092, 0.096, 0.112, 0.128, 0.125, 0.162, 0.124, 0.088, 0.069,
      ];
      this.incPeriod_ = 3;
      this.contactInfectionRate_ = 0.35;
      this.infPeriod_ = 9;
      this.illImmigrationRate_ = 0.01;
    } else if (id == Preset.COVID_19_MASKS) {
      //COVID-19 Masks
      this.immigrationRate_ = 0.5;
      this.birthRate_ = 0.0001;
      this.naturalDeathRate_ = 0.0001;
      this.ageMort = [
        0, 0.0005, 0.00105, 0.001875, 0.00295, 0.008, 0.027, 0.07975, 0.159,
      ];
      this.ageDist = [
        //For Germany
        0.092, 0.096, 0.112, 0.128, 0.125, 0.162, 0.124, 0.088, 0.069,
      ];
      this.incPeriod_ = 3;
      this.contactInfectionRate_ = 0.15;
      this.infPeriod_ = 9;
      this.illImmigrationRate_ = 0.15;
    }
  }
}
