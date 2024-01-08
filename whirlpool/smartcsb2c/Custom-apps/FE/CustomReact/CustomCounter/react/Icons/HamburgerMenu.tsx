import React from 'react';

export interface Props {
  className?: string;
  onClick?: ()=> void;
}

export default class HamburgerMenu extends React.Component<Props> {
  render() {
    return ( 
        <svg style={{width:"36px", height:"36px"}} onClick={this.props.onClick} className={this.props.className} aria-hidden="true"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path fill="#deb01a" d="M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z" />
        </svg>
    )
  }
}  