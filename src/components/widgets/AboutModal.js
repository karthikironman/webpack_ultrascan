import React, { Component }  from 'react';
import { Modal} from 'react-bootstrap';
import CloseImage from "../../assets/cancel.png";
import "../../css/tabs.css"

class AboutModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }
  handleModal(data) {
    this.setState({ show: data })
  }
  render() {
    const { show } = this.state;
    return (
      <div>
        <p className="buttonLink" onClick={() => this.handleModal(true)}>{this.props.name}</p>
        <Modal show={show} class="modal">
          <Modal.Header>
            About
            <img class="closebutton" src={CloseImage} onClick={() => this.handleModal(false)}></img>
          </Modal.Header>
          <Modal.Body>
            <p>Content</p>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}
export default AboutModal;