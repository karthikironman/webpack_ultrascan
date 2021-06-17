import React from 'react';
import "../../css/namesBar.css";
import { connect } from "react-redux";
class namesBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const {line_name,reel_number} = this.props;
        return (
            <div className="namesBar">
                <div className="names-bar-row">
                    <div classname="names-bar-label"><b>Name</b></div>
                    <div classname="names-bar-value">{line_name}</div>
                </div>
                <div className="names-bar-row">
                    <div classname="names-bar-label"><b>Reel No</b></div>
                    <div classname="names-bar-value">{reel_number}</div>
                </div>

            </div>
        )
    }
}
const mapStateToProps = (state) => {
    const {
      line_name,
      reel_number 
    } = state.names;
    return {
        line_name,
        reel_number 
    };
  };
export default  connect(mapStateToProps)(namesBar);