/** @format */

import React from "react";
import { Modal, Button } from "vtex.styleguide";

interface idModal {
	time?: number;
	textButton?: string;
	children?: React.Component;
}
interface MyState {
	isModalOpen: boolean;
}
class ModalNewsletter extends React.Component<idModal, MyState> {
	constructor(props: idModal) {
		super(props);
		this.state = { isModalOpen: false };
		this.handleModalToggle = this.handleModalToggle.bind(this);
		this.modalClose = this.modalClose.bind(this);
	}

	componentDidMount() {
		if (this.props.time !== undefined) {
			//If the pop up must appear automatically
			this.handleModalToggle();
		}
	}

	handleModalToggle() {
		if (localStorage.getItem("isAlreadyOpen") == null) {
			setTimeout(() => {
				this.setState({ isModalOpen: !this.state.isModalOpen });
				localStorage.setItem("isAlreadyOpen", "true");
			}, 15000);
		}
	}

	modalClose() {
		this.setState({ isModalOpen: !this.state.isModalOpen });
	}

	render() {
		return (
			<React.Fragment>
				{this.props.textButton !== undefined ? (
					<Button onClick={this.modalClose}>{this.props.textButton}</Button>
				) : null}
				<Modal
					centered
					isOpen={this.state.isModalOpen}
					onClose={this.modalClose}>
					{this.props.children}
				</Modal>
			</React.Fragment>
		);
	}
}

<ModalNewsletter />;

export default ModalNewsletter;
