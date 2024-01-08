import React from "react";
import { Modal, Button } from "vtex.styleguide";


interface WindowGTM extends Window { dataLayer: any[]; }

interface idModal {
  time?: number;
  textButton?:string
  children?: React.Component;
//   campaign?:string
}
interface MyState {
  isModalOpen: boolean;
}

const dataLayer = (window as unknown as WindowGTM).dataLayer || [];
class ModalNewsletter extends React.Component<idModal, MyState> {
  constructor(props: idModal) {
    super(props);
    this.state = { isModalOpen: false };
    this.handleModalToggle = this.handleModalToggle.bind(this);
    this.modalClose = this.modalClose.bind(this)
  }

  componentDidMount(){
    if(this.props.time !== undefined){ //If the pop up must appear automatically
      this.handleModalToggle()
    }
  }

  handleModalToggle() {
    if(localStorage.getItem('isAlreadyOpen') == null){
        setTimeout(() => {
            this.setState({ isModalOpen: !this.state.isModalOpen });
            localStorage.setItem('isAlreadyOpen', 'true');
        }, ((this.props.time || 1)*60000));
    }
  }

  modalClose(){
    this.setState({ isModalOpen: !this.state.isModalOpen })
    if(!this.state.isModalOpen)
      dataLayer.push({
        event: "cta_click",
        eventCategory: "CTA Click",
        eventAction: "Catalog",
        eventLabel: "product-advice_top_box",
        link_url: window?.location?.pathname,
        link_text: "need advice",
        checkpoint: "1",
        area: "Catalog",
        type: "need advice"
      })
  }

  render() {
    return (
      <React.Fragment>
        {this.props.textButton !== undefined? (<Button onClick={this.modalClose}>{this.props.textButton}</Button>):null}
        <Modal
          centered
          isOpen={this.state.isModalOpen}
          onClose={this.modalClose}
        >
          {this.props.children}
        </Modal>
      </React.Fragment>
    );
  }
}

<ModalNewsletter />;

export default ModalNewsletter;
