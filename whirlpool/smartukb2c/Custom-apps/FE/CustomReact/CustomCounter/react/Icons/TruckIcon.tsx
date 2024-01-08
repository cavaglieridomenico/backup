// @ts-nocheck
import React from 'react';
import styles from "../styles.css"
export interface Props {
  className?: string;
}

export default class TruckIcon extends React.Component<Props> {
  render() {
    return ( 
<svg className={this.props.className} style={{height:"30px", width:"30px"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 22">
        <path className={styles.iconColor} fill-rule="evenodd" d="M25.242 5.965h4.04l2.444 4.03h-6.484v-4.03zm4.916-.899a1.703 1.703 0 0 0-1.419-.761h-5.835v10.179h-.797V0H0v14.694h4.57v3.244h2.793c-.001.035-.003.069-.003.104a3.348 3.348 0 0 0 6.696 0c0-.035-.001-.07-.003-.104h9.81l-.002.104a3.348 3.348 0 0 0 6.696 0c0-.035-.002-.07-.003-.104h2.872v-7.429c0-.335-.098-.662-.283-.94l-2.985-4.503z"></path>
      </svg>    )
  }
}