import React from "react";
import screenfull from "screenfull";
import "../../css/bottomNav.css";
import fourDots from "../../assets/four_dots.png";
import icon1 from "../../assets/icon1.png";
import iconPlay from "../../assets/icon_play.png"
import iconStop from "../../assets/icon_stop.png"
import iconReel from "../../assets/icon_reel.png";
import crossSectionIcon from "../../assets/cross_section.png"
import ExitScreenImage from "../../assets/icon_full_screen.png";
import FullScreenImage from "../../assets/icon_exit_full_screen.png";
import BottomButton from "../../components/widgets/BottomButton.js";
import { connect } from "react-redux";
import {updateNames} from "../../redux/actions/names.action"
import { updateKey } from "./../../redux/actions/updateKey.action";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class bottomNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFullscreen: false,
    };
  }
  callBackRoute = () => {
    this.props.callBackRoute();
  };
  toggleFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  };
  updateReelNumber = () => {
   let prevState = this.props.reel_number;
   prevState ++;
   this.props.updateNames({reel_number:prevState})
   toast("Reel Number updated")
  }
  stopSimulation = () => {
      this.props.updateKey({ cross_section_graph: false });
  }
  startSimulation = () => {
    this.props.updateKey({ cross_section_graph: true });
}
  componentDidMount() {
    if (screenfull.isEnabled) {
      screenfull.on("change", () => {
        this.setState({
          isFullscreen: screenfull.isFullscreen,
        });
      });
    }
  }
  render() {
    return (
      <div id="bottomNav">
        <ToastContainer/>
        <BottomButton
          image={fourDots}
          noLine={true}
          callback={true}
          bg={true}
          callBackBottomNavBar={this.callBackRoute}
        />
        <BottomButton  image={crossSectionIcon} route={"/"} />
        <BottomButton image={icon1} route={"/heatmap"} />
        <BottomButton  image={iconReel} route={"null"}  callBackBottomNavBar={this.updateReelNumber}  callback={true}/>
        <BottomButton image={iconPlay} route={"null"} active={this.props.cross_section_graph} callBackBottomNavBar={this.startSimulation} callback={true}/>
        <BottomButton classNames={"iconStop"} image={iconStop} route={"null"} active={!this.props.cross_section_graph} callBackBottomNavBar={this.stopSimulation} callback={true}/>
        {/* <BottomButton image={icon1} route={'/three'}/> */}
        {this.state.isFullscreen === true ? (
          <BottomButton
            fullScreenMode={true}
            image={FullScreenImage}
            callFullScreenMode={this.toggleFullScreen}
          />
        ) : (
          <BottomButton
            fullScreenMode={true}
            image={ExitScreenImage}
            callFullScreenMode={this.toggleFullScreen}
          />
        )}
      </div>
    );
  }
}
const mapDispatchToProps =  {
  updateNames,updateKey
};
const mapStateToProps = (state) => {
  const {
    line_name,
    reel_number 
  } = state.names;
  const {
   cross_section_graph
  } = state.updateKey;
  return {
    cross_section_graph,
      line_name,
      reel_number 
  };
};
export default  connect(mapStateToProps,mapDispatchToProps)(bottomNav);
