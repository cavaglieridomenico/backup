export interface TimeSplit {
  hours: string
  minutes: string
  seconds: string
}
export interface StateComponent {
  isVip: boolean,
  accessCode: string | null
}

type GenericObject = Record<string, any>
