export enum ETaskType {
  WASH_DISHES = 'wash-dishes',
  VACUUM_CLEAN = "vacuum-clean"  
}

export interface IWashDishes {
  durationInHours: number;
}

export interface IVacuumClean {
  who: string;
  room: string;
}

export interface ITask {
  id?: string;
  name: string;
  type: ETaskType;
  fields: IWashDishes | IVacuumClean;
}