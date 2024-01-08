declare module '*.css' {
  type Styles = {
    [selector: string]: string
  }

  const styles: Styles

  export default styles
}

declare module '*.css'

declare module '*.svg'
