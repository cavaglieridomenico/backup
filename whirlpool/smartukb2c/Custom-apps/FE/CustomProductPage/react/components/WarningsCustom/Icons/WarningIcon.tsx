import React from 'react';

export interface Props {
  className?: string;
}


export default class WarningIcon extends React.Component<Props> {
  render() {
    return (
            <svg className={this.props.className} style={{fill:"#ff5d00"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M19.64 16.36L11.53 2.3A1.85 1.85 0 0 0 10 1.21 1.85 1.85 0 0 0 8.48 2.3L.36 16.36C-.48 17.81.21 19 1.88 19h16.24c1.67 0 2.36-1.19 1.52-2.64zM11 16H9v-2h2zm0-4H9V6h2z"/>
            </svg>
    )
  }
}