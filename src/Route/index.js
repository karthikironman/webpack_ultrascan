import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CrossSectionMap from "../components/Pages/CrossSectionMap.js";
import HeatMap from "../components/Pages/HeatMap.js";
import BottomNav from "../components/Layouts/BottomNavBar.js"
// import CrossSectionMap3D from "../components/Pages/CrossSectionMap3D.js";
import MenuList from "../components/widgets/MenuList"
import Header from "../components/Layouts/Header";

class RoutePage extends Component {
  constructor(props) {
    super(props);
    this.state={
        isMenuPage: false,
    };
  }
  openMenuPage = () => {
    this.setState({
        isMenuPage: !this.state.isMenuPage
    });
  };
  closeMenuPage = () => {
    this.setState({
        isMenuPage: false
    });
  };
  render() {
    return (
      <Router>
        <div className="AppContainer">
          <Header />
          <Switch>
          {!this.state.isMenuPage && (<>
                       <Route exact path="/" component={CrossSectionMap} />
                       <Route exact path="/heatmap" component={HeatMap} />
                       </>
            )}
     
            {/* <Route exact path="/three" component={CrossSectionMap3D} /> */}
          </Switch>
          {this.state.isMenuPage && (
                <MenuList callBackRoute={this.closeMenuPage}/>
            )}
          <div className="BottomNavCss">
            <BottomNav callBackRoute={this.openMenuPage}/>
          </div>
        </div>
      </Router>
    );
  }
}

export default RoutePage;
