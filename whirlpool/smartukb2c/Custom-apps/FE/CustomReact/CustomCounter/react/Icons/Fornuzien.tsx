import React from 'react';

export interface Props {
  className?: string;
}

export default class Fornuzien extends React.Component<Props> {
  render() {
    return (
        <svg className={this.props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.5 29.5">
            <g id="Livello_2" data-name="Livello 2"><g id="Livello_1-2" data-name="Livello 1">
                <path className="cls-1" d="M34.17,29v-.5H3.33a2.28,2.28,0,0,1-1.64-.69A2.28,2.28,0,0,1,1,26.17V3.33a2.28,2.28,0,0,1,.69-1.64A2.28,2.28,0,0,1,3.33,1H34.17a2.28,2.28,0,0,1,1.64.69,2.28,2.28,0,0,1,.69,1.64V26.17a2.36,2.36,0,0,1-2.33,2.33v1a3.34,3.34,0,0,0,3.33-3.33V3.33A3.34,3.34,0,0,0,34.17,0H3.33A3.34,3.34,0,0,0,0,3.33V26.17A3.34,3.34,0,0,0,3.33,29.5H34.17Z"></path>
                <polyline className="cls-1" points="0.6 21.13 36.6 21.54 36.61 20.54 0.61 20.13"></polyline><path className="cls-1" d="M14.77,11h-.5a4.16,4.16,0,0,1-7.11,2.95A4.17,4.17,0,1,1,13.05,8a4.15,4.15,0,0,1,1.22,3h1a5.17,5.17,0,1,0-5.16,5.17A5.17,5.17,0,0,0,15.27,11Z"></path>
                <path className="cls-1" d="M32.05,11h-.5a4.16,4.16,0,0,1-7.11,2.95A4.17,4.17,0,1,1,30.33,8a4.15,4.15,0,0,1,1.22,3h1a5.17,5.17,0,1,0-5.16,5.17A5.17,5.17,0,0,0,32.55,11Z"></path><circle className="cls-1" cx="10.11" cy="25.63" r="1.25">
            </circle><circle className="cls-1" cx="27.11" cy="25.63" r="1.25"></circle></g></g></svg>
    )
  }
}