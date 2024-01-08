import React from 'react';

export interface Props {
  className?: string;
}


export default class Koken extends React.Component<Props> {
  render() {
    return (
        <svg className={this.props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 91.55"><defs></defs>
            <g id="Livello_2" data-name="Livello 2"><g id="CATEGORIE">
            <path className="cls-1" d="M90.61,90.14V88.73H9.39a6.59,6.59,0,0,1-6.57-6.57V9.39A6.59,6.59,0,0,1,9.39,2.82H90.61a6.59,6.59,0,0,1,6.57,6.57V82.16a6.59,6.59,0,0,1-6.57,6.57v2.82A9.42,9.42,0,0,0,100,82.16V9.39A9.42,9.42,0,0,0,90.61,0H9.39A9.42,9.42,0,0,0,0,9.39V82.16a9.42,9.42,0,0,0,9.39,9.39H90.61Z"></path>
            <path className="cls-1" d="M70.89,69.72V68.31H29.11a6.59,6.59,0,0,1-6.57-6.58V48.13a6.59,6.59,0,0,1,6.57-6.58H70.89a6.59,6.59,0,0,1,6.57,6.58v13.6a6.59,6.59,0,0,1-6.57,6.58v2.82a9.42,9.42,0,0,0,9.39-9.4V48.13a9.42,9.42,0,0,0-9.39-9.4H29.11a9.42,9.42,0,0,0-9.39,9.4v13.6a9.42,9.42,0,0,0,9.39,9.4H70.89Z"></path>
            <polyline className="cls-1" points="1.24 23.59 98.42 23.59 98.42 20.78 1.24 20.78"></polyline>
            <rect className="cls-1" x="47.9" y="10.39" width="5.28" height="5.28"></rect></g></g>
        </svg>
    )
  }
}