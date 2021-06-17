
import React from 'react';
import "../../css/transLabel.css";
import pinIcon from "../../assets/pin.png"
class transLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggle: false,
            pin: false
        }
    }
    toggleExpand = () => {
        if (!this.state.pin) {
            let toggle = !this.state.toggle;
            this.setState({ toggle })
        }
    }
    togglePin = () => {
        let pin = !this.state.pin;
        this.setState({ pin });
        console.log(this.props.tableData)
    }
    getBoxColor = () => {
        return "hightlighted"
    }
    render() {
        return (<div className="trans-label-wrapper" 
        onClick={() => { this.togglePin() }} 
        onMouseOut={() => { this.toggleExpand() }}  onMouseOver={() => { this.toggleExpand() }}>
            <div className=
                {"trans-label-average-box" + this.getBoxColor()}
               
            >
                {this.props.average}
                {
                    this.state.pin && <div className="pin-icon-wrapper">
                        <img src={pinIcon}></img>
                    </div>
                }
            </div>
            {this.state.toggle && <div className="trans-label-expandable">
                {this.props.tableData[this.props.index].map((x, i) => {
                    return <div key={i}>{x}</div>
                })}
            </div>}

        </div>)


    }
}

export default transLabel