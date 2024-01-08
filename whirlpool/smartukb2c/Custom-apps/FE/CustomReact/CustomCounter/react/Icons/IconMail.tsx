import React from 'react';

export interface Props {
  className?: string;
}

export default class IconMail extends React.Component<Props> {
  render() {
    return (
        <svg className={this.props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 23">
            <g  fillRule="evenodd" stroke="#000" strokeLinejoin="round" strokeWidth=".646" transform="translate(1 1)">
                <rect width="30" height="21" rx=".646"></rect>
                <path strokeLinecap="round" d="M.652.5l14.393 10L29.652.5"></path>
            </g>
        </svg>
    )
  }
} 