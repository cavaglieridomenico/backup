declare module 'vtex.styleguide' {
  import { ComponentType } from 'react'

  export const Input: ComponentType<InputProps>

  interface InputProps {
    [key: string]: any
  }

  export const Checkbox: ComponentType<CheckboxProps>

  interface CheckboxProps {
    [key: string]: any
  }

  export const Spinner: ComponentType<SpinnerProps>

  interface SpinnerProps {
    [key: string]: any
  }
}
