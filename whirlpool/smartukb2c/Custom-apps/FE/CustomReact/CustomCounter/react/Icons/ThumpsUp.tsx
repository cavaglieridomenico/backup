import React from 'react';

export interface Props {
  className?: string;
}
 
export default class ThumpsUp extends React.Component<Props> {
  render() {
    return (
      <svg className={this.props.className} style={{fill:"#deb01a",height: "28px"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
      <g fill="none" fill-rule="evenodd">
        <path fill="#0090d0" d="M10.907 0C5.09 0 .377 4.714.377 10.53c0 5.818 4.714 10.532 10.53 10.532 5.815 0 10.53-4.714 10.53-10.532C21.437 4.714 16.722 0 10.907 0z"></path>
        <path className="no-fill" fill="#FFF" d="M9.667 16.185l-4.841-4.841 1.63-1.627 3.057 3.056 5.773-6.928 1.771 1.474z"></path>
      </g>
    </svg>
    )
  }
}