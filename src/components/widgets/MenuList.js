//libraries and packages
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Modal } from 'react-bootstrap';
//css 
import "../../css/menuList.css"
//assets 
import AboutImage from "../../assets/about_icon.png";
import CloseImage from "../../assets/cancel.png";
import DiagnosticsImage from "../../assets/icon_diagnostics.png"
import SettingsImage from "../../assets/icon_settings.png";
import UploadImage from "../../assets/icon_upload.png";
import RecipeNavImage from "../../assets/icon_recipe_navigator.png";
import ProductCenImage from "../../assets/cross_section.png";
import ReportsImage from "../../assets/icon_reports.png"
import UserImage from "../../assets/icon_user.png";
import CalibrationImage from "../../assets/icon_calibration.png";
import GeneralImage from "../../assets/icon_general.png"
import ClockImage from "../../assets/icon_clock.png";
import BranchImage from "../../assets/icon_branch.png";
//components
import NamesMenu from "./names_menu.js"
import AboutModal from "./AboutModal.js";

class MenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      splitView: false,
      secondaryData: [],
      splitHeading: "",
      show: false, //sub - modal show flag
      subModalTitle: "",//sub - modal title 
      subModalBreadcrumb: "" //breadcrumb for one level deep navigation
    };
  }
  callBackRoute = () => {
    this.props.callBackRoute();
  };
  toggleSplitView = () => {
    let splitView = !this.state.splitView;
    this.setState({ splitView });
  }
  showSubMenu = (secondaryData, splitHeading) => {
    this.toggleSplitView()
    this.setState({ secondaryData, splitHeading })
  }
  handlePrimaryMenuClick = (x) => {
    // console.log(x)
    if (x.submenu) {
      this.showSubMenu(x.menu, x.name)
    } else {
      if(this.state.splitView !== true){
      this.handleModal(true, x.name)
      }else{
        this.toggleSplitView()
      }
      //do nothing
    }
  }
  handleModal = (show, subModalTitle = "", subModalBreadcrumb = "") => {
    this.setState({ show, subModalTitle, subModalBreadcrumb });
  }
  highlightCss = (boxTitle) => {
    // console.log('from hightlight css', boxTitle, this.state.splitHeading)
    if (boxTitle != this.state.splitHeading && this.state.splitView == true) {
      return " non-hightlight-box"
    } else if (boxTitle == this.state.splitHeading && this.state.splitView == true) {
      return " hightlight-box"
    }
  }
  splitViewCss = () => {
    if (this.state.splitView) {
      return "splitview"
    }
  }
 
  animateSecSplit = () => {
    if (this.state.splitView) {
      return " secSplitView"
    }
  }
  getModalBody = () => {
    console.log(this.state.subModalTitle,this.state.subModalBreadcrumb)
    if(this.state.subModalTitle == 'names' || this.state.subModalBreadcrumb == 'names'){
      return <NamesMenu/>
    }else{
      return <div>dev in progress</div>
    }
  }
  render() {
    let menu = [
      {
        name: "diagnostics",
        icon: DiagnosticsImage,
        submenu: true,
        menu: [
          {
            name: 'power',
            icon: GeneralImage,
            url: ''
          },
          {
            name: 'capture',
            icon: GeneralImage,
            url: ''
          },
          {
            name: 'waveform',
            icon: GeneralImage,
            url: ''
          }
        ]
      },
      {
        name: "settings",
        url: "",
        icon: SettingsImage,
        submenu: true,
        menu: [
          {
            name: 'clock setup',
            icon: ClockImage,
            url: ''
          },
          {
            name: 'backup',
            icon: GeneralImage,
            url: ''
          },
          {
            name: 'restore',
            icon: GeneralImage,
            url: ''
          },
          {
            name: 'ethernet',
            icon: GeneralImage,
            url: ''
          },
          {
            name: 'names',
            icon: GeneralImage,
            url: ''
          },
          {
            name: 'thresholds',
            icon: GeneralImage,
            url: ''
          },
          {
            name: 'measurement',
            icon: GeneralImage,
            url: ''
          },
          {
            name: 'high speed',
            icon: GeneralImage,
            url: ''
          },
          {
            name: 'tolerancing (hst)',
            icon: GeneralImage,
            url: ''
          },
          {
            name: 'gauge/sensors',
            icon: GeneralImage,
            url: ''
          }
        ]
      },
      {
        name: "product centering",
        url: "",
        icon: ProductCenImage,
        submenu: false
      },
      {
        name: "calibration",
        url: "",
        icon: CalibrationImage,
        submenu: false
      },
      {
        name: "reports",
        url: "",
        icon: ReportsImage,
        submenu: false
      },
      {
        name: "recipe navigator ",
        url: "",
        icon: RecipeNavImage,
        submenu: false
      },
      {
        name: "update",
        url: "",
        icon: UploadImage,
        submenu: false
      },
      {
        name: "user",
        url: "",
        icon: UserImage,
        submenu: false
      }, {
        name: "about",
        url: "",
        icon: AboutImage,
        submenu: true,
        menu: [
          {
            name: 'version',
            icon: GeneralImage,
            url: ''
          },
          {
            name: 'foss',
            icon: GeneralImage,
            url: ''
          },
          {
            name: 'common files',
            icon: GeneralImage,
            url: ''
          }
        ]
      }
    ]
    return (
      <div className="wrapper">
        <div className="heading_menu_list">
          <p>MENU</p>
          <img className="closebutton" src={CloseImage} onClick={() => this.callBackRoute()} />
        </div>
        <div className="containers">
          <div className={"rows " + this.splitViewCss()}>
            {
              //main menu starts
              //will loop the primary objects
              menu.map((x, i) => {
                return (
                  <div className={"menu-card " + this.highlightCss(x.name)} onClick={() => { this.handlePrimaryMenuClick(x) }}>
                    <div className="menu-content">
                      <div className="menu-details">
                        <div>
                          <img className="menu_images" src={x.icon} />
                        </div>
                        <div className="menu_name_list">
                          <p>{x.name}</p>
                        </div>
                      </div>
                      {x.submenu && 
                      <img className="branch-indicator" src={BranchImage} />}
                    </div>
                  </div>
                )
              })
              // main menu ends
            }
          </div>
        </div>
        {this.state.splitView && <><div className="menu-back-button" onClick={() => { this.toggleSplitView() }}>
          <img className="closebutton" src={CloseImage} />
        </div>
          <p className="splitHeading">{this.state.splitHeading}</p> </>}
        {
          this.state.splitView && <div className={"sub-containers" + this.animateSecSplit()}>
            {
              //secondary menu starts
              //will loop the secondary objects
              this.state.secondaryData.map((x, i) => {
                return (
                  <div className="sub-menu-card" onClick={() => this.handleModal(true, this.state.splitHeading, x.name)} >
                    
                    <img className="menu_images" src={x.icon} />
                    <p>{x.name}</p>
                  </div>
                )
              })
              // secondary menu ends
            }
          </div>
        }
        {/* //start of modal design */}
        {this.state.show && <>
          <div className="custom-modal-Custom-Wrapper">
          </div>
          <div className="custom-modal-dialog">
            <div className="custom-modal-header">
              <img className="custom-modal-closebutton" src={CloseImage} onClick={() => this.handleModal(false)} />
              {/* if sub menu is active show breadcrumb title as heading 
              els show title sub modal title as heading */}
              {this.state.subModalBreadcrumb != "" && <p className="custom-modal-title"> {this.state.subModalBreadcrumb}</p>}
              {this.state.subModalBreadcrumb == "" && <p className="custom-modal-title">{this.state.subModalTitle}</p>}
              {/* breadcrumb design */}
              {/* 1 level deep */}
              {this.state.subModalBreadcrumb != "" && <div className="breadcrumb-wrapper">
                <p className="parent-navigation" onClick={() => { this.handleModal(false) }}>{this.state.subModalTitle}</p>
                <p className="current-navigation"> {this.state.subModalBreadcrumb}</p>
              </div>}
              {/* end of breadcrumb design */}
              <div className="custom-modal-body">
                   {this.getModalBody()}
              </div>
            </div>
          </div>
        </>}
        {/* end of modal design */}
      </div>

    );
  }
}

export default withRouter(MenuList);
