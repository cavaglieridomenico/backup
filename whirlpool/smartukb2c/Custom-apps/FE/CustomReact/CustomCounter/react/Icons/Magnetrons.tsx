import React from 'react';

export interface Props {
  className?: string;
}


export default class Magnetrons extends React.Component<Props> {
  render() {
    return (
        <svg className={this.props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.5 25.5">
            <g id="Livello_2" data-name="Livello 2">
                <g id="Livello_1-2" data-name="Livello 1">
                    <path className="cls-1" d="M32.17,25v-.5H3.33a2.28,2.28,0,0,1-1.64-.69A2.28,2.28,0,0,1,1,22.17V3.33a2.28,2.28,0,0,1,.69-1.64A2.28,2.28,0,0,1,3.33,1H32.17a2.28,2.28,0,0,1,1.64.69,2.28,2.28,0,0,1,.69,1.64V22.17a2.36,2.36,0,0,1-2.33,2.33v1a3.34,3.34,0,0,0,3.33-3.33V3.33A3.34,3.34,0,0,0,32.17,0H3.33A3.34,3.34,0,0,0,0,3.33V22.17A3.34,3.34,0,0,0,3.33,25.5H32.17Z"></path>
                    <rect className="cls-1" x="29.75" y="15.02" width="1.88" height="1.88"></rect>
                    <rect className="cls-1" x="29.75" y="19.35" width="1.88" height="1.88"></rect>
                    <polyline className="cls-1" points="25.44 0.88 25.44 24.96 26.44 24.96 26.44 0.88"></polyline>
                </g>
            </g>
        </svg>
    )
  }
}
