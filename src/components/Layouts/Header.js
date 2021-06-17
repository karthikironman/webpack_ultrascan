import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "react-bootstrap";
import LangDrop from "../widgets/langDrop";
import logo from "../../assets/UltrascanLogo.png";
import icon_logo from "../../assets/icon_logo.png";
import robot_icon from "../../assets/robot_icon.png";
import "../../css/Headers.css";
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date:""
    };
  }
  getStyle = (inputStyle) => {
    switch (inputStyle) {
      case "headerRow":
        return { color: "white" };
      case "headercolLeft":
        return { textAlign: "left" };
      case "headercolCenter":
        return { textAlign: "center", fontSize: "16px" };
      case "headercolRight":
        return { textAlign: "right", fontSize: "12px" };
      default:
        return;
    }
  };
  componentDidUpdate(prev){
    if ( prev.wallAverageThickness != this.props.wallAverageThickness) {
   let DateArray = [...this.props.timeLabel]
   this.setState({
     date:DateArray[99]
   })
  }
  }
  render() {
    return (
      <div id="container">
        <Row className="mt-0 pt-0" style={this.getStyle("headerRow")}>
          <Col
            className="p-0 m-0 mt-2 pt-1 pl-2 mr-5"
            sm={3}
            style={this.getStyle("headercolLeft")}
          >
            <img className="com_logo" src={icon_logo}></img>
            <img class="logo mt-2 pt-2" src={logo}></img>
            {/* <div className="btn_text mt-2 pt-2">{` DataPro 5000 `}</div> */}
          </Col>
          <Col
            className="p-0 m-0 ml-n5"
            sm={6}
            style={this.getStyle("headercolCenter")}
          >
            <div className="btn_text mt-2 pt-2">{` CONTROLLER DASHBOARD `}</div>
          </Col>
          <Col
            className="p-0 m-0"
            sm={3}
            style={this.getStyle("headercolRight")}
          >
            <LangDrop device_info={true} date={this.state.date} />
            {/* <div className="simulatedInfo">
              <img src={robot_icon}></img>
            </div> */}
            {this.props.simulationMode === true && (
              <div className="simulatedInfo">
                <img src={robot_icon}></img>
              </div>
            )} 
          </Col>
        </Row>
        {/* <ToastContainer /> */}
        {/* <Navbar collapseOnSelect expand="lg" bg="#3F3F3F" variant="dark">
          <Navbar.Brand href="#home">
            <img class="com_logo" src={icon_logo}></img>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto"></Nav>
            <Nav>
              <Nav.Link>
                <Nav className="mr-auto cntrl_btns">
                  <text class="btn_text mt-3">{` CONTROLLER DASHBOARD `}</text>
                </Nav>
                {this.props.simulationMode === "Enabled" && (
                  <div className="simulatedInfo">
                    <img src={robot_icon}></img>
                  </div>
                )}
                <LangDrop device_info={true} />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar> */}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const {
    wallAverageThickness //importing wall thickness because to trigger compdidupdate functin
  } = state.crossSectionGraph.transducer;
  const {cross_section_graph} = state.updateKey
  const  {timeLabel } = state.trendGraph;
  return {
     timeLabel,
     wallAverageThickness,
     simulationMode:cross_section_graph
  };
};
export default  connect(mapStateToProps)(Header);
