import React from 'react';

export interface Props {
  className?: string;
}

export default class Barcode extends React.Component<Props> {
  render() {
    return (
        <svg className={this.props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 24"><defs>
            <style></style></defs>
            <title>barcode</title><g id="Livello_2" data-name="Livello 2">
                <g id="NAV_BAR" data-name="NAV BAR">
                    <path className="cls-1" d="M5,0H1A1,1,0,0,0,0,1V5A1,1,0,0,0,.89,6,1,1,0,0,0,2,5V2H5a1,1,0,0,0,1-.89A1,1,0,0,0,5,0Z"></path>
                    <path className="cls-1" d="M28,19v3H25a1,1,0,0,0-1,.89A1,1,0,0,0,25,24h4a1,1,0,0,0,1-1V19a1,1,0,0,0-1.11-1A1,1,0,0,0,28,19Z"></path>
                    <path className="cls-1" d="M29,0H25a1,1,0,0,0-1,.89A1,1,0,0,0,25,2h3V5a1,1,0,0,0,.89,1A1,1,0,0,0,30,5V1A1,1,0,0,0,29,0Z"></path>
                    <path className="cls-1" d="M5,22H2V19a1,1,0,0,0-.89-1A1,1,0,0,0,0,19v4a1,1,0,0,0,1,1H5a1,1,0,0,0,1-1.11A1,1,0,0,0,5,22Z"></path>
                    <rect className="cls-1" x="4" y="4" width="2" height="16"></rect>
                    <rect className="cls-1" x="8" y="4" width="2" height="12"></rect>
                    <rect className="cls-1" x="12" y="4" width="2" height="12"></rect>
                    <rect className="cls-1" x="16" y="4" width="2" height="16"></rect>
                    <rect className="cls-1" x="20" y="4" width="2" height="12"></rect>
                    <rect className="cls-1" x="24" y="4" width="2" height="16"></rect>
                    <rect className="cls-1" x="8" y="18" width="2" height="2"></rect>
                    <rect className="cls-1" x="12" y="18" width="2" height="2"></rect>
                    <rect className="cls-1" x="20" y="18" width="2" height="2"></rect>
                </g></g>
        </svg>
    )
  }
}