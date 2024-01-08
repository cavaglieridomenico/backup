import React from 'react';
import styles from './styles.css'

export interface Props {
  image?: any;
  title?: string;
  quantity?: number;
  href?: any;
}

export default class MenuReusable extends React.Component<Props> {
  render() {
    return (
          <div className={styles.reusableMain}>
            <a className={styles.reusableA} href={this.props.href}>
            <img src={this.props.image} />
            <div className={styles.titleQuantity}>
                <p>{this.props.title}</p>
                <p>({this.props.quantity})</p>
            </div>
            </a>
          </div>
    )
  }
}