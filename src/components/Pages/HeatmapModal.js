import React, { Component } from "react";
import { Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import spectrograms from "../../assets/spectrogram.png"
import "../../css/heatmap.css";
class HeatmapModal extends Component {
//   constructor(props) {
//     super(props)
    
//   }
    render() {

        return (
            <div>
                <Modal 
                    style={{opacity:1}} 
                    show={this.props.show} 
                    onHide={() => this.props.onHide()}  
                    backdrop="static"   
                    dialogClassName = "modal-dialog"
                    contentClassName = "modal-size"    
                   >

                    <Modal.Header closeButton>
                        <Modal.Title>
                            <p className="spectrogram-header-white"> Spectrogram info</p>
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p className="modal-text-font"> 
                        Each horizontal slice of this spectrogram represents one processed waveform capture. The spectrogram shows a history
                        of up to 240 waveform captures (that were previously displayed on the webpage). Brighter colors represent greater processed magnitudes.
                        </p>
                        <img src= {spectrograms} alt="info" className="img-scale"></img>
                    </Modal.Body>

                    <Modal.Footer>
                        {/* <Button variant="primary" onClick={() => this.props.onHide()}>Close</Button> */}
                    </Modal.Footer>
                </Modal>
            </div>
        )
    };
}

export default HeatmapModal; 