declare module 'vtex.styleguide' {
  import { ReactNode } from 'react'

  export const Input: ReactNode<InputProps>
  export const Checkbox: ReactNode<InputProps>
  export const Button: any

  interface InputProps {
    [key: string]: any
  }
}
