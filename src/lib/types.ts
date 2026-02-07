export interface NeoObject {
  id: string;
  name: string;
  nasaJplUrl: string;
  absoluteMagnitude: number;
  estimatedDiameter: {
    minKm: number;
    maxKm: number;
  };
  isPotentiallyHazardous: boolean;
  closeApproachData: CloseApproach[];
}

export interface CloseApproach {
  date: string;
  dateFull: string;
  velocity: {
    kmPerHour: number;
  };
  missDistance: {
    astronomical: number;
    lunar: number;
    kilometers: number;
  };
}
