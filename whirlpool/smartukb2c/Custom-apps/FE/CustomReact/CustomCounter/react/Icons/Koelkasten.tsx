import React from 'react';

export interface Props {
  className?: string;
}

export default class Koelkasten extends React.Component<Props> {
  render() {
    return (
        <svg  className={this.props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.5 48.34">
            <g id="Livello_2" data-name="Livello 2"><g id="Livello_1-2" data-name="Livello 1">
            <path className="cls-1" d="M19.17,47.84v-.5H3.33A2.36,2.36,0,0,1,1,45V3.33a2.28,2.28,0,0,1,.69-1.64A2.28,2.28,0,0,1,3.33,1H19.17a2.28,2.28,0,0,1,1.64.69,2.28,2.28,0,0,1,.69,1.64V45a2.36,2.36,0,0,1-2.33,2.34v1A3.35,3.35,0,0,0,22.5,45V3.33A3.34,3.34,0,0,0,19.17,0H3.33A3.34,3.34,0,0,0,0,3.33V45a3.35,3.35,0,0,0,3.33,3.34H19.17Z">
            </path>
            <rect className="cls-1" x="3.17" y="17.79" width="2" height="4.75"></rect>
            </g></g>
        </svg>

    )
  }
}