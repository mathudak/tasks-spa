import { ETaskType, ITask, IVacuumClean, IWashDishes } from "src/app/core/interfaces";

export const EmptyWashDishFields: IWashDishes = {
  durationInHours: 0
}

export const EmptyVacuumCleanFields: IVacuumClean = {
  room: '',
  who: ''
}

export const EmptyTask: ITask = {
  name: '',
  type: ETaskType.VACUUM_CLEAN,
  fields: EmptyVacuumCleanFields
}
