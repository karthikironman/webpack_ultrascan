import React from 'react';
import "../../css/BottomButton.css"
import { withRouter } from "react-router-dom";
class BottomButton extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            isMenuPage: false,
        };
    }
    getBg = () => {
        let className = ""
        if(this.props.route === window.location.pathname && this.props.route != 'null'){
            // console.log(this.props.route,window.location.pathname)
            className += 'black'
        }
        if(this.props.active){
            className += " black"
        }
   return className;
    }
    handleEvent = (data,temp,tempData) => {
        // console.log(window.location.pathname)
        if(window.location.pathname !== data && this.props.route != 'null'){
            this.props.history.push(data);
        }
        // window.location.replace(data);
        if(temp){
            this.props.callBackBottomNavBar();
        }
        if(tempData){
            this.props.callFullScreenMode(); 
        }
    };
    render() {
        return (
        <div id="bottomButton" className={this.props.bg ?"grey": this.getBg()} onClick={() => this.handleEvent(this.props.route,this.props.callback,this.props.fullScreenMode)}>
            <img src={this.props.image} />
           {!this.props.noLine &&   <div className="sideLine"></div>} 
         
        </div>)
    }
}
export default withRouter(BottomButton)
