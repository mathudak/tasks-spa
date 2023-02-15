import { IVacuumClean, IWashDishes } from "src/app/core/interfaces";

export const EmptyCommonFields: any = {
  name: '',
  type: ''
}

export const EmptyWashDishFields: IWashDishes = {
  durationInHours: 0
}

export const EmptyVacuumCleanFields: IVacuumClean = {
  room: '',
  who: ''
}

