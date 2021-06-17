import React from 'react';
import { connect } from "react-redux";
import { updateNames } from "../../redux/actions/names.action"
import "../../css/names_menu.css";

import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

class namesMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            line_name: "",
            reel_number: ""
        }
    }
    componentDidMount() {
       this.fetchValues()
    }
    fetchValues = () => {
        let{line_name, reel_number} = this.props;
        console.log('fetchiing from store',line_name,reel_number
        )
        this.setState({line_name, reel_number})
    }
    changeName = (value) => {
        console.log('oinchange',value.target.value)
        let line_name = value.target.value;
        this.setState({line_name});
    }
    changeReel = (value) => {
        console.log('oinchange',value.target.value)
        let reel_number = value.target.value;
        this.setState({reel_number});
    }
    applyValue = () => {
        let {line_name,reel_number} = this.state;
        this.props.updateNames({line_name,reel_number});
        toast("Names values updated")
    }
    render() {
        return (
            <>
            <ToastContainer/>
                <div className="names-menu">
                    <div>
                        <p1 className="names-menu-label">Line Name</p1>
                        <input className="names-menu-input" value={this.state.line_name} onChange={(value)=>{this.changeName(value)}}></input>
                    </div>
                    <div>
                        <p2 className="names-menu-label">Reel Number</p2>
                        <input className="names-menu-input" type="number" value={this.state.reel_number} onChange={(value)=>{this.changeReel(value)}}></input>
                    </div>

                    <button className="names-menu-button" onClick={()=>{this.applyValue()}}>APPLY</button>
                </div>
            </>
        )
    }
}
const mapDispatchToProps = {
    updateNames
};
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
export default connect(mapStateToProps, mapDispatchToProps)(namesMenu);