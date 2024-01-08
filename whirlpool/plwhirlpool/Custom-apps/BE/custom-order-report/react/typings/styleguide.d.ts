declare module 'vtex.styleguide' {
  import { ComponentType } from 'react'

  export const Checkbox: ComponentType<InputProps>
  export const DatePicker: ComponentType<InputProps>
  export const Layout: ComponentType<InputProps>
  export const PageBlock: ComponentType<InputProps>
  export const Button: ComponentType<InputProps>

  interface InputProps {
    [key: string]: any
  }
}
