import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../../css/CrossSectionGraph.css";
import "../../css/CrossSectionGraphlable.css";
import IconFlip from "../../assets/icon_double-arrow.png";
import IconZoomIn from "../../assets/icon_zoom-in.png";
import IconZoomOut from "../../assets/icon_zoom-out.png";
import Checkbox from "react-custom-checkbox";
import TransLabel from "../widgets/transLabel";
import NamesBar from "../../components/widgets/namesBar"
import {
  Container,
  Row,
  Col,
  Form,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import LineChart from "../widgets/RealTimeLineChart";
import CrossSectionMap3D from "./CrossSectionMap3D.js";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import { connect } from "react-redux";
import { updateKey } from "./../../redux/actions/updateKey.action";
import jsxToString from "jsx-to-string";
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class CrossSectionMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkBoxMap: Array(10).fill(true),
      isZoomCount: 0,
      isFlipOption: false,
      twistAngleValue: null,
      twistAngleValueTemp: 0,
      circleCXXY: [],
      tempCircleCXXY: [],
      tempCirclePositionArray: [],
      circlePositionArrayMin: [],
      circlePositionArrayMax: [],
      circlePositionArray3D: [],
      crossSection3DSVG: ``,
      crossSection3DDepth: "",
      checked3DValue: false,
      show3DCrossSectionMap: false,
      timeInterval: 0,
      valueArray: [
        { name: "Lx Avg", value: 0.4112 },
        { name: "%Conc", value: 0.4312 },
        { name: "Lx Min", value: 0.5342 },
        { name: "Water Temp", value: 0.4212 },
        { name: "Lx MAX", value: 0.5123 },
        { name: "PGS", value: 0.5212 },
        { name: "Options", value: 0.4512 },
        { name: "Pings per Second", value: 0.4312 },
      ],
      circlePositionArray: [],
      circlePositionArrayMax: [],
      lablesArray: [],
      layerSelected: 1, //should be hooked with the layer selection buttons
    };
  }
  componentDidUpdate(prev) {
    let {
      show_csg,
      average,
      transducerWallData,
      count,
      data,
      ringCount,
      wallData,
      wallAverageThickness,
      waterTemp,
      pingRate,
      pgs,
      maxWall,
      minWall,
      conc,
    } = this.props;
    if (prev.average && prev.average != average) {
      average = average.map((x) => {
        return {
          angle: x.angle,
          thickness: x.thickness.toFixed(4),
        };
      });
      average.forEach((element) => {
        let x =
          parseInt(element.angle) + parseInt(this.state.twistAngleValueTemp);
        let y = Math.round(x / 10) * 10;
        if (y > 355) {
          element.angle = parseInt(y) - 360;
        } else if (y > -355 && y < 0) {
          element.angle = parseInt(y) + 360;
        } else {
          if (y == -360) {
            element.angle = parseInt(y) + 360;
          } else {
            element.angle = parseInt(y);
          }
        }
      });
      this.setState({ lablesArray: average });
      //update tiles
      let tt = this.state.valueArray;
      if (this.state.layerSelected <= this.props.count) {
        tt[0].name = "L" + this.state.layerSelected + " Avg";
        tt[0].value =
          wallAverageThickness[this.state.layerSelected - 1].toFixed(3);

        tt[1].name = "L" + this.state.layerSelected + " Conc";
        tt[1].value = conc[this.state.layerSelected - 1].toFixed(3);

        tt[2].name = "L" + this.state.layerSelected + " Min";
        tt[2].value = minWall[this.state.layerSelected - 1];

        tt[3].name = "Water Temp";
        tt[3].value = waterTemp;

        tt[4].name = "L" + this.state.layerSelected + " Max";
        tt[4].value = maxWall[this.state.layerSelected - 1];
      }
      tt[5].value = pgs;
      tt[7].value = pingRate;
      this.setState({ valueArray: tt });
      let counts = [];
      average.forEach((element) => {
        counts.push(element.angle);
      });
      const goal = 0;
      let output = counts.reduce((prev, curr) =>
        Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
      );
      let tempIndex = 0;
      tempIndex = counts.indexOf(output);
      if (this.state.isFlipOption) {
        average.forEach((element) => {
          let x = 360 - parseInt(element.angle);
          let y = Math.round(x / 10) * 10;
          if (y >= 360) {
            element.angle = parseInt(y) - 360;
          } else {
            element.angle = parseInt(y);
          }
        });
      }
      // if (this.state.isFlipOption) {
      //   let pivot = tempIndex;
      //   let num_of_swaps;
      //   if (average.length % 2 == 0) {
      //     num_of_swaps = Math.floor(average.length / 2) - 1;
      //   } else {
      //     num_of_swaps = Math.floor(average.length / 2);
      //   }
      //   let tempData = Array.from(average);
      //   let tempData1 = Array.from(transducerWallData);
      //   for (let i = 0; i < num_of_swaps; i++) {
      //     let start = pivot - 1 - i;
      //     let end = pivot + 1 + i;
      //     if (end > average.length - 1) {
      //       end = end - average.length;
      //     }
      //     if (start < 0) {
      //       start = average.length + start;
      //     }
      //     tempData[start] = average[end];
      //     tempData[end] = average[start];
      //     tempData1[start] = transducerWallData[end];
      //     tempData1[end] = transducerWallData[start];
      //   }
      //   average = tempData;
      //   transducerWallData = tempData1;
      // }
      this.setState({ lablesArray: average });
      this.setState({ lablesArraySubValue: transducerWallData });
      this.getTempRadiusFromSimulator(wallData);
    }
  }
  getTempRadiusFromSimulator = (data) => {
    this.state.tempCirclePositionArray = [];
    this.state.tempCircleCXXY = [];
    for (let i = 0; i < data[0].length; i++) {
      let tempRad = 0;
      for (let j = 0; j < data.length; j++) {
        tempRad += data[j][i] / data.length;
      }
      this.state.tempCirclePositionArray.push(tempRad);
      this.state.tempCircleCXXY.push(tempRad);
    }
    let tempData = this.state.tempCirclePositionArray;
    for (let i = 0; i < this.state.tempCirclePositionArray.length; i++) {
      if (i == 0) {
        tempData[i] = tempData[i] + this.props.innerRadius;
      } else {
        tempData[i] = tempData[i] + tempData[i - 1];
      }
    }
    this.setState({
      tempCirclePositionArray: tempData,
    });
    let tempDataTemp = data;
    for (let i = 0; i < tempDataTemp.length; i++) {
      for (let j = 0; j < tempDataTemp[0].length; j++) {
        tempDataTemp[i][j] = this.state.tempCircleCXXY[j] - tempDataTemp[i][j];
      }
    }
    this.setState({
      circleCXXY: tempDataTemp,
    });
    this.getRadiusFromSimulator(this.state.tempCirclePositionArray);
  };
  getRadiusFromSimulator = (data) => {
    let tempMin = 139 / this.props.outerRadius;
    let tempMax = 200 / this.props.outerRadius;
    let temp3D = 100 / this.props.outerRadius;
    this.state.circlePositionArrayMin = [];
    this.state.circlePositionArrayMax = [];
    this.state.circlePositionArray3D = [];
    this.state.circlePositionArrayMin.push(this.props.innerRadius * tempMin);
    this.state.circlePositionArrayMax.push(this.props.innerRadius * tempMax);
    this.state.circlePositionArray3D.push(this.props.innerRadius * temp3D);
    for (let i = 0; i < data.length; i++) {
      this.state.circlePositionArrayMin.push(data[i] * tempMin);
      this.state.circlePositionArrayMax.push(data[i] * tempMax);
      this.state.circlePositionArray3D.push(data[i] * temp3D);
    }
    this.getCircleRadius3D();
  };
  getCircleRadius3D = () => {
    let tempArrayDepth = [10, 20, 35, 50, 65, 80, 95, 115];
    this.setState({
      crossSection3DDepth:
        tempArrayDepth[this.state.circlePositionArray3D.length - 2],
    });
    let data = ``;
    data = jsxToString(
      <svg width="230" height="230">
        <g>
          {this.state.circlePositionArray3D.map((el, index) => (
            <circle
              cx={this.setCircleCX3D(
                this.state.circlePositionArray3D.length - 1 - index
              )}
              cy={this.setCircleCY3D(
                this.state.circlePositionArray3D.length - 1 - index
              )}
              r={this.setCircleRadius3D(
                this.state.circlePositionArray3D.length - 1 - index
              )}
            />
          ))}
          {this.state.circlePositionArray3D.length > 0 && (
            <line
              x1={this.setLinePosition3Dx(+0)}
              y1={this.setLinePosition3Dy(-5)}
              x2={this.setLinePosition3Dx(+0)}
              y2={this.setLinePosition3Dy(+5)}
              stroke="#000"
              strokeWidth="2"
            />
          )}
          {this.state.circlePositionArray3D.length > 0 && (
            <line
              x1={this.setLinePosition3Dx(-5)}
              y1={this.setLinePosition3Dy(+0)}
              x2={this.setLinePosition3Dx(+5)}
              y2={this.setLinePosition3Dy(+0)}
              stroke="#000"
              strokeWidth="2"
            />
          )}
        </g>
      </svg>
    );
    this.setState({
      crossSection3DSVG: `${data}`,
    });
  };
  setCircleRadiusMin = (value) => {
    if (!this.state.checkBoxMap[value]) {
      return "0";
    } else if (value == 0) {
      let data = 139;
      // this.state.isZoomCount * 30 + 139;
      return `${data}`;
    } else {
      let data =
        // this.state.isZoomCount * 30 +
        this.state.circlePositionArrayMin[
          this.props.wallData[0].length - value
        ];
      return `${data}`;
    }
  };
  setCircleCXMin = (value) => {
    let tempReturn = 0;
    let tempData = 0;
    let positionCX = [
      +0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      +0, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1,
    ];
    if (0 == value) {
      return "200";
    } else {
      for (let i = 0; i < this.state.lablesArray.length; i++) {
        tempData =
          tempData +
          this.state.circleCXXY[i][value - 1] *
            (positionCX[Math.round(this.state.lablesArray[i].angle / 10)] *
              this.state.isZoomCount);
      }
      tempReturn = 200 + tempData;
      return `${tempReturn}`;
    }
  };
  setCircleCYMin = (value) => {
    let tempReturn = 0;
    let tempData = 0;
    let positionCY = [
      +0, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1,
      +0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    ];
    if (0 == value) {
      return "170";
    } else {
      for (let i = 0; i < this.state.lablesArray.length; i++) {
        tempData =
          tempData +
          this.state.circleCXXY[i][value - 1] *
            (positionCY[Math.round(this.state.lablesArray[i].angle / 10)] *
              this.state.isZoomCount);
      }
      tempReturn = 170 + tempData;
      return `${tempReturn}`;
    }
  };
  setLinePositionMinx = (dataValue) => {
    let tempReturn = 0;
    let tempData = 0;
    let positionCX = [
      +0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      +0, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1,
    ];
    for (let i = 0; i < this.state.lablesArray.length; i++) {
      tempData =
        tempData +
        this.state.circleCXXY[i][
          this.state.circlePositionArrayMin.length - 1 - 1
        ] *
          (positionCX[Math.round(this.state.lablesArray[i].angle / 10)] *
            this.state.isZoomCount);
    }
    tempReturn = 200 + tempData + dataValue;
    return `${tempReturn}`;
  };
  setLinePositionMiny = (dataValue) => {
    let tempReturn = 0;
    let tempData = 0;
    let positionCY = [
      +0, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1, +1,
      +0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    ];
    for (let i = 0; i < this.state.lablesArray.length; i++) {
      tempData =
        tempData +
        this.state.circleCXXY[i][
          this.state.circlePositionArrayMin.length - 1 - 1
        ] *
          (positionCY[Math.round(this.state.lablesArray[i].angle / 10)] *
            this.state.isZoomCount);
    }
    tempReturn = 170 + tempData + dataValue;
    return `${tempReturn}`;
  };
  setLinePositionMaxx = (dataValue) => {
    let tempReturn = 0;
    let tempData = 0;
    let positionCX = [
      +0, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5,
      -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, +0, +1.5, +1.5, +1.5, +1.5, +1.5,
      +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5,
    ];
    for (let i = 0; i < this.state.lablesArray.length; i++) {
      tempData =
        tempData +
        this.state.circleCXXY[i][
          this.state.circlePositionArrayMin.length - 1 - 1
        ] *
          (positionCX[Math.round(this.state.lablesArray[i].angle / 10)] *
            this.state.isZoomCount);
    }
    tempReturn = 250 + tempData + dataValue;
    return `${tempReturn}`;
  };
  setLinePositionMaxy = (dataValue) => {
    let tempReturn = 0;
    let tempData = 0;
    let positionCY = [
      +0, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5,
      +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +0, -1.5, -1.5, -1.5, -1.5, -1.5,
      -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5,
    ];
    for (let i = 0; i < this.state.lablesArray.length; i++) {
      tempData =
        tempData +
        this.state.circleCXXY[i][
          this.state.circlePositionArrayMin.length - 1 - 1
        ] *
          (positionCY[Math.round(this.state.lablesArray[i].angle / 10)] *
            this.state.isZoomCount);
    }
    tempReturn = 200 + tempData + dataValue;
    return `${tempReturn}`;
  };
  setLinePosition3Dx = (dataValue) => {
    let tempReturn = 0;
    let tempData = 0;
    let positionCX = [
      +0, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75,
      -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, +0, +0.75, +0.75, +0.75,
      +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75,
      +0.75, +0.75, +0.75, +0.75,
    ];
    for (let i = 0; i < this.state.lablesArray.length; i++) {
      tempData =
        this.state.circleCXXY[i][
          this.state.circlePositionArray3D.length - 1 - 1
        ] *
        (positionCX[Math.round(this.state.lablesArray[i].angle / 10)] *
          (this.state.isZoomCount * 0.75));
    }
    tempReturn = 50 + tempData + dataValue;
    return `${tempReturn}`;
  };
  setLinePosition3Dy = (dataValue) => {
    let tempReturn = 0;
    let tempData = 0;
    let positionCY = [
      +0, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75,
      +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0, -0.75, -0.75, -0.75,
      -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75,
      -0.75, -0.75, -0.75, -0.75,
    ];
    for (let i = 0; i < this.state.lablesArray.length; i++) {
      tempData =
        this.state.circleCXXY[i][
          this.state.circlePositionArray3D.length - 1 - 1
        ] *
        (positionCY[Math.round(this.state.lablesArray[i].angle / 10)] *
          (this.state.isZoomCount * 0.75));
    }
    tempReturn = 50 + tempData + dataValue;
    return `${tempReturn}`;
  };
  setCircleCXMax = (value) => {
    let tempReturn = 0;
    let tempData = 0;
    let positionCX = [
      +0, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5,
      -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, +0, +1.5, +1.5, +1.5, +1.5, +1.5,
      +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5,
    ];
    if (0 == value) {
      return "250";
    } else {
      for (let i = 0; i < this.state.lablesArray.length; i++) {
        tempData =
          tempData +
          this.state.circleCXXY[i][value - 1] *
            (positionCX[Math.round(this.state.lablesArray[i].angle / 10)] *
              (this.state.isZoomCount * 1.5));
      }
      tempReturn = 250 + tempData;
      return `${tempReturn}`;
    }
  };
  setCircleCYMax = (value) => {
    let tempReturn = 0;
    let tempData = 0;
    let positionCY = [
      +0, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +1.5,
      +1.5, +1.5, +1.5, +1.5, +1.5, +1.5, +0, -1.5, -1.5, -1.5, -1.5, -1.5,
      -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5,
    ];
    if (0 == value) {
      return "200";
    } else {
      for (let i = 0; i < this.state.lablesArray.length; i++) {
        tempData =
          tempData +
          this.state.circleCXXY[i][value - 1] *
            (positionCY[Math.round(this.state.lablesArray[i].angle / 10)] *
              (this.state.isZoomCount * 1.5));
      }
      tempReturn = 200 + tempData;
      return `${tempReturn}`;
    }
  };
  setCircleCX3D = (value) => {
    let tempReturn = 0;
    let tempData = 0;
    let positionCX = [
      +0, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75,
      -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, +0, +0.75, +0.75, +0.75,
      +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75,
      +0.75, +0.75, +0.75, +0.75,
    ];
    if (0 == value) {
      return "50";
    } else {
      for (let i = 0; i < this.state.lablesArray.length; i++) {
        tempData =
          tempData +
          this.state.circleCXXY[i][this.props.wallData[0].length - value] *
            (positionCX[Math.round(this.state.lablesArray[i].angle / 10)] *
              (this.state.isZoomCount * 0.75));
      }
      tempReturn = 50 + tempData;
      return `${tempReturn}`;
    }
  };
  setCircleCY3D = (value) => {
    let tempReturn = 0;
    let tempData = 0;
    let positionCY = [
      +0, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75,
      +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0.75, +0, -0.75, -0.75, -0.75,
      -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75,
      -0.75, -0.75, -0.75, -0.75,
    ];
    if (0 == value) {
      return "50";
    } else {
      for (let i = 0; i < this.state.lablesArray.length; i++) {
        tempData =
          tempData +
          this.state.circleCXXY[i][this.props.wallData[0].length - value] *
            (positionCY[Math.round(this.state.lablesArray[i].angle / 10)] *
              (this.state.isZoomCount * 0.75));
      }
      tempReturn = 50 + tempData;
      return `${tempReturn}`;
    }
  };
  setCircleRadiusMax = (value) => {
    if (!this.state.checkBoxMap[value]) {
      return "0";
    } else if (value == 0) {
      let data = 200;
      // this.state.isZoomCount * 40 + 200;
      return `${data}`;
    } else {
      let data =
        // this.state.isZoomCount * 40 +
        this.state.circlePositionArrayMax[
          this.props.wallData[0].length - value
        ];
      return `${data}`;
    }
  };
  setCircleRadius3D = (value) => {
    if (!this.state.checkBoxMap[value]) {
      return "0";
    } else if (0 == value) {
      let data = 100;
      // this.state.isZoomCount * 20 + 100;
      return `${data}`;
    } else {
      let data =
        // this.state.isZoomCount * 20 +
        this.state.circlePositionArray3D[this.props.wallData[0].length - value];
      return `${data}`;
    }
  };
  setCircleColor = (value) => {
    if (value == 0) {
      return "#d99669";
    } else if (this.state.circlePositionArrayMin.length - 1 == value) {
      return "#9d5d18";
    } else if (value == 1) {
      return "#cb6a61";
    } else if (value == 2) {
      return "#c75054";
    } else if (value == 3) {
      return "#d5cf35";
    } else if (value == 4) {
      return "#c19d35";
    } else if (value == 5) {
      return "#9e8b31";
    } else if (value == 6) {
      return "#ac6947";
    } else if (value == 7) {
      return "#ba744f";
    }
  };
  getStyle = (inputStyle) => {
    switch (inputStyle) {
      case "crossSection2dGraphDiv":
        return { textAlign: "center", padding: "0px 0px", margin: "auto" };
      case "crossSection2dGraphSVGMin":
        return { height: "330px", width: "400px" };
      case "crossSection2dGraphSVGMax":
        return { height: "430px", width: "500px" };
      case "cardValueBorderCol":
        return { borderRight: "1px solid #6d6e70" };
      case "cardValueBorderRow":
        return { background: "rgb(255 255 255 / 10%)" };
      case "lineChartHeight":
        return { height: "37vh", marginRight: "8px" };
      case "crossSectionMapHeight":
        return { width: "100%", height: "50vh" };
      default:
        return;
    }
  };
  handleChecke2DValue = (data) => {
    if (data.target.checked) {
      this.setState({ show3DCrossSectionMap: true, checked3DValue: true });
    } else {
      this.setState({ show3DCrossSectionMap: false, checked3DValue: false });
    }
  };
  handleToggleCSG = (data) => {
    this.props.updateKey({ cross_section_graph: data });
  };
  changeTwistAngleValue = (event) => {
    if (
      Number(event.target.value) >= -360 &&
      Number(event.target.value) <= 360 &&
      event.target.value
    ) {
      this.setState({
        twistAngleValue: event.target.value,
      });
      if (event.target.value % 10 == 0) {
        this.setState({
          twistAngleValueTemp: event.target.value,
        });
      }
    } else {
      if (event.target.value < -360 || event.target.value > 360) {
        this.setState({
          twistAngleValue: 0,
        });
      } else {
        this.setState({
          twistAngleValue: null,
        });
      }
      this.setState({
        twistAngleValueTemp: 0,
      });
    }
  };
  handleFlipOption = () => {
    if (this.state.isFlipOption) {
      this.setState({
        isFlipOption: false,
      });
    } else {
      this.setState({
        isFlipOption: true,
      });
    }
  };
  handleZoonInOption = () => {
    if (this.state.isZoomCount < 4) {
      let tempData = this.state.isZoomCount;
      tempData++;
      this.setState({
        isZoomCount: tempData,
      });
    }
  };
  handleZoomOutOption = () => {
    if (this.state.isZoomCount > 0) {
      let tempData = this.state.isZoomCount;
      tempData--;
      this.setState({
        isZoomCount: tempData,
      });
    }
  };
  legendCheckBoxClick = (index, value) => {
    let prevState = JSON.parse(JSON.stringify(this.state.checkBoxMap));
    prevState[this.state.circlePositionArrayMin.length - 2 - index] = value;
    this.setState({ checkBoxMap: prevState });
  };
  render() {
    return (
      <div>
        <Row
          className="mt-0 pt-0"
          style={this.getStyle("crossSectionMapHeight")}
        >
          <Col sm={7} className="ml-5 pl-5">
            {this.state.show3DCrossSectionMap ? (
              <Row className="crossSection2dGraphRow">
                <div style={this.getStyle("crossSection2dGraphDiv")}>
                  {this.state.circlePositionArray3D.length > 0 && (
                    <div className="twistAngleCss3D">
                      <div className="mt-3 mb-1 crossSectionButtonHeading">
                        Twist Angle
                      </div>
                      <InputGroup>
                        <FormControl
                          value={this.state.twistAngleValue}
                          type="number"
                          onChange={(e) => this.changeTwistAngleValue(e)}
                          placeholder=""
                          style={{ fontSize: "16px" }}
                        />
                        <InputGroup.Append>
                          <InputGroup.Text style={{ fontSize: "16px" }}>
                            &#176;
                          </InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                    </div>
                  )}
                  {this.state.circlePositionArray3D.length > 0 && (
                    <div className="buttonOptionCss3D">
                      <div className="mt-3 mb-1 crossSectionButtonHeading">
                        Flip Angle
                      </div>
                      <div
                        className="py-1 buttonClassCss crossSectionButton"
                        onClick={() => this.handleFlipOption()}
                      >
                        <img className="my-2 imageCssClass" src={IconFlip} />
                      </div>
                      <div className="mt-3 mb-1 crossSectionButtonHeading">
                        ZoomIn
                      </div>
                      <div
                        className="py-1 buttonClassCss crossSectionButton"
                        onClick={() => this.handleZoonInOption()}
                      >
                        <img className="my-2 imageCssClassZoom" src={IconZoomIn} />
                      </div>
                      <div className="mt-3 mb-1 crossSectionButtonHeading">
                        ZoomOut
                      </div>
                      <div
                        className="py-1 buttonClassCss crossSectionButton"
                        onClick={() => this.handleZoomOutOption()}
                      >
                        <img className="my-2 imageCssClassZoom" src={IconZoomOut} />
                      </div>
                      <div className="mt-3 mb-1 crossSectionButtonHeading">
                        Zoom Level
                      </div>
                      <div className="py-2 buttonClassCss crossSectionButton">
                        <span>{this.state.isZoomCount}x</span>
                      </div>
                    </div>
                  )}
                  <CrossSectionMap3D
                    crossSection3DSVG={this.state.crossSection3DSVG}
                    crossSection3DDepth={this.state.crossSection3DDepth}
                  />
                  {/* style={this.getStyle("crossSection2dGraphSVG")} */}
                  {this.state.lablesArray.map((item, index) => (
                    <span className={`imgClasss${item.angle}`} key={index}>
                      <span className="crossSection2dGraphlablesRatio">
                        <TransLabel
                          average={"T" + (index + 1) + ":" + item.thickness}
                          tableData={this.state.lablesArraySubValue}
                          index={index}
                        />
                      </span>
                    </span>
                  ))}
                  {this.state.circlePositionArray3D.length > 0 && (
                    <div className="FilterCheckBox3D">
                      {this.state.circlePositionArray3D.map((x, a) => {
                        if (a != this.state.circlePositionArray3D.length - 1) {
                          return (
                            <Checkbox
                              key={
                                "Wall -" +
                                (this.state.circlePositionArray3D.length -
                                  2 -
                                  a)
                              }
                              borderColor={this.setCircleColor(
                                this.state.circlePositionArray3D.length - 2 - a
                              )}
                              checked={
                                this.state.checkBoxMap[
                                  this.state.circlePositionArray3D.length -
                                    2 -
                                    a
                                ]
                              }
                              style={{ cursor: "pointer" }}
                              labelStyle={{
                                marginLeft: 5,
                                userSelect: "none",
                              }}
                              label={"Wall -" + (a + 1)}
                              onChange={(value) => {
                                this.legendCheckBoxClick(a, value);
                              }}
                            />
                          );
                        }
                      })}
                    </div>
                  )}
                </div>
              </Row>
            ) : (
              <span>
                <Row className="crossSection2dGraphRow minScreen">
                  <div style={this.getStyle("crossSection2dGraphDiv")}>
                    {this.state.circlePositionArrayMin.length > 0 && (
                      <div className="twistAngleCss">
                        <div className="mt-3 mb-1 crossSectionButtonHeading">
                          Twist Angle
                        </div>
                        <InputGroup>
                          <FormControl
                            type="number"
                            value={this.state.twistAngleValue}
                            onChange={(e) => this.changeTwistAngleValue(e)}
                            placeholder=""
                            style={{ fontSize: "16px" }}
                          />
                          <InputGroup.Append>
                            <InputGroup.Text style={{ fontSize: "16px" }}>
                              &#176;
                            </InputGroup.Text>
                          </InputGroup.Append>
                        </InputGroup>
                      </div>
                    )}
                    {this.state.circlePositionArrayMin.length > 0 && (
                      <div className="buttonOptionCss">
                        <div className="mt-3 mb-1 crossSectionButtonHeading">
                          Flip Angle
                        </div>
                        <div
                          className="py-1 buttonClassCss crossSectionButton"
                          onClick={() => this.handleFlipOption()}
                        >
                          <img className="my-2 imageCssClass" src={IconFlip} />
                        </div>
                        <div className="mt-3 mb-1 crossSectionButtonHeading">
                          ZoomIn
                        </div>
                        <div
                          className="py-1 buttonClassCss crossSectionButton"
                          onClick={() => this.handleZoonInOption()}
                        >
                          <img
                            className="my-2 imageCssClassZoom"
                            src={IconZoomIn}
                          />
                        </div>
                        <div className="mt-3 mb-1 crossSectionButtonHeading">
                          ZoomOut
                        </div>
                        <div
                          className="py-1 buttonClassCss crossSectionButton"
                          onClick={() => this.handleZoomOutOption()}
                        >
                          <img
                            className="my-2 imageCssClassZoom"
                            src={IconZoomOut}
                          />
                        </div>
                        <div className="mt-3 mb-1 crossSectionButtonHeading">
                          Zoom Level
                        </div>
                        <div className="py-2 buttonClassCss crossSectionButton">
                          <span>{this.state.isZoomCount}x</span>
                        </div>
                      </div>
                    )}
                    <svg style={this.getStyle("crossSection2dGraphSVGMin")}>
                      <g>
                        {this.state.circlePositionArrayMin.map((el, index) => (
                          <circle
                            key={index}
                            cx={this.setCircleCXMin(index)}
                            cy={this.setCircleCYMin(index)}
                            r={this.setCircleRadiusMin(index)}
                            stroke="#000"
                            strokeWidth="0.5"
                            fill={this.setCircleColor(index)}
                          />
                        ))}
                        {this.state.circlePositionArrayMin.length > 0 && (
                          <line
                            x1={this.setLinePositionMinx(+0)}
                            y1={this.setLinePositionMiny(-7)}
                            x2={this.setLinePositionMinx(+0)}
                            y2={this.setLinePositionMiny(+13)}
                            stroke="#000"
                            strokeWidth="2"
                          />
                        )}
                        {this.state.circlePositionArrayMin.length > 0 && (
                          <line
                            x1={this.setLinePositionMinx(-10)}
                            y1={this.setLinePositionMiny(+3)}
                            x2={this.setLinePositionMinx(+10)}
                            y2={this.setLinePositionMiny(+3)}
                            stroke="#000"
                            strokeWidth="2"
                          />
                        )}
                      </g>
                    </svg>
                    {this.state.lablesArray.map((item, index) => (
                      <span className={`imgClass${item.angle}`} key={index}>
                        <span className="crossSection2dGraphlablesRatio">
                          <TransLabel
                            average={"T" + (index + 1) + ":" + item.thickness}
                            tableData={this.state.lablesArraySubValue}
                            index={index}
                          />
                        </span>
                      </span>
                    ))}
                    {this.state.circlePositionArrayMin.length > 0 && (
                      <div className="FilterCheckBox2D">
                        {this.state.circlePositionArrayMin.map((x, a) => {
                          if (
                            a !=
                            this.state.circlePositionArrayMin.length - 1
                          ) {
                            return (
                              <Checkbox
                                key={
                                  "Wall -" +
                                  (this.state.circlePositionArrayMin.length -
                                    2 -
                                    a)
                                }
                                borderColor={this.setCircleColor(
                                  this.state.circlePositionArrayMin.length -
                                    2 -
                                    a
                                )}
                                checked={
                                  this.state.checkBoxMap[
                                    this.state.circlePositionArrayMin.length -
                                      2 -
                                      a
                                  ]
                                }
                                style={{ cursor: "pointer" }}
                                labelStyle={{
                                  marginLeft: 5,
                                  userSelect: "none",
                                }}
                                label={"Wall -" + (a + 1)}
                                onChange={(value) => {
                                  this.legendCheckBoxClick(a, value);
                                }}
                              />
                            );
                          }
                        })}
                      </div>
                    )}
                  </div>
                </Row>
                <Row className="crossSection2dGraphRowMax maxScreen">
                  <div style={this.getStyle("crossSection2dGraphDiv")}>
                    {this.state.circlePositionArrayMax.length > 0 && (
                      <div className="twistAngleCss">
                        <div className="mt-3 mb-1 crossSectionButtonHeading">
                          Twist Angle
                        </div>
                        <InputGroup>
                          <FormControl
                            type="number"
                            value={this.state.twistAngleValue}
                            onChange={(e) => this.changeTwistAngleValue(e)}
                            placeholder=""
                            style={{ fontSize: "16px" }}
                          />
                          <InputGroup.Append>
                            <InputGroup.Text style={{ fontSize: "16px" }}>
                              &#176;
                            </InputGroup.Text>
                          </InputGroup.Append>
                        </InputGroup>
                      </div>
                    )}
                    {this.state.circlePositionArrayMax.length > 0 && (
                      <div className="buttonOptionCss">
                        <div className="mt-3 mb-1 crossSectionButtonHeading">
                          Flip Angle
                        </div>
                        <div
                          className="py-1 buttonClassCss crossSectionButton"
                          onClick={() => this.handleFlipOption()}
                        >
                          <img className="my-2 imageCssClass" src={IconFlip} />
                        </div>
                        <div className="mt-3 mb-1 crossSectionButtonHeading">
                          ZoomIn
                        </div>
                        <div
                          className="py-1 buttonClassCss crossSectionButton"
                          onClick={() => this.handleZoonInOption()}
                        >
                          <img
                            className="my-2 imageCssClassZoom"
                            src={IconZoomIn}
                          />
                        </div>
                        <div className="mt-3 mb-1 crossSectionButtonHeading">
                          ZoomOut
                        </div>
                        <div
                          className="py-1 buttonClassCss crossSectionButton"
                          onClick={() => this.handleZoomOutOption()}
                        >
                          <img
                            className="my-2 imageCssClassZoom"
                            src={IconZoomOut}
                          />
                        </div>
                        <div className="mt-3 mb-1 crossSectionButtonHeading">
                          Zoom Level
                        </div>
                        <div className="py-2 buttonClassCss crossSectionButton">
                          <span>{this.state.isZoomCount}x</span>
                        </div>
                      </div>
                    )}
                    <svg style={this.getStyle("crossSection2dGraphSVGMax")}>
                      <g>
                        {this.state.circlePositionArrayMax.map((el, index) => (
                          <circle
                            key={index}
                            cx={this.setCircleCXMax(index)}
                            cy={this.setCircleCYMax(index)}
                            r={this.setCircleRadiusMax(index)}
                            stroke="#000"
                            strokeWidth="0.5"
                            fill={this.setCircleColor(index)}
                          />
                        ))}
                        {this.state.circlePositionArrayMax.length > 0 && (
                          <line
                            x1={this.setLinePositionMaxx(+0)}
                            y1={this.setLinePositionMaxy(-18)}
                            x2={this.setLinePositionMaxx(+0)}
                            y2={this.setLinePositionMaxy(+16)}
                            stroke="#000"
                            strokeWidth="2"
                          />
                        )}
                        {this.state.circlePositionArrayMax.length > 0 && (
                          <line
                            x1={this.setLinePositionMaxx(-17)}
                            y1={this.setLinePositionMaxy(-2)}
                            x2={this.setLinePositionMaxx(+17)}
                            y2={this.setLinePositionMaxy(-2)}
                            stroke="#000"
                            strokeWidth="2"
                          />
                        )}
                      </g>
                    </svg>
                    {this.state.lablesArray.map((item, index) => (
                      <span className={`imgClass${item.angle}`} key={index}>
                        <span className="crossSection2dGraphlablesRatio">
                          <div>
                            <TransLabel
                              average={"T" + (index + 1) + ":" + item.thickness}
                              tableData={this.state.lablesArraySubValue}
                              index={index}
                            />
                          </div>
                        </span>
                      </span>
                    ))}
                    {this.state.circlePositionArrayMax.length > 0 && (
                      <div className="FilterCheckBox2D">
                        {this.state.circlePositionArrayMax.map((x, a) => {
                          if (
                            a !=
                            this.state.circlePositionArrayMax.length - 1
                          ) {
                            return (
                              <Checkbox
                                key={
                                  "Wall -" +
                                  (this.state.circlePositionArrayMax.length -
                                    2 -
                                    a)
                                }
                                borderColor={this.setCircleColor(
                                  this.state.circlePositionArrayMax.length -
                                    2 -
                                    a
                                )}
                                checked={
                                  this.state.checkBoxMap[
                                    this.state.circlePositionArrayMax.length -
                                      2 -
                                      a
                                  ]
                                }
                                style={{ cursor: "pointer" }}
                                labelStyle={{
                                  marginLeft: 5,
                                  userSelect: "none",
                                }}
                                label={"Wall -" + (a + 1)}
                                onChange={(value) => {
                                  this.legendCheckBoxClick(a, value);
                                }}
                              />
                            );
                          }
                        })}
                      </div>
                    )}
                  </div>
                </Row>
              </span>
            )}
          </Col>
          <Col sm={5} className="ml-n5">
            <Row style={this.getStyle("cardValueBorderRow")}>
              {this.state.valueArray.map((item, index) => (
                <Col
                  key={index}
                  sm={6}
                  style={
                    index % 2 == 0
                      ? this.getStyle("cardValueBorderCol")
                      : this.getStyle("")
                  }
                >
                  <div
                    className={
                      index % 2 == 0
                        ? "cardValueEven text-center"
                        : "cardValueOdd text-center"
                    }
                  >
                    {item.name !== "Options" ? (
                      <div>
                        <div className="cardValueHeading">{item.name}</div>
                        <div className="cardValueText">
                          <span>{item.value}</span>
                          {/* <span className="cardValueTextSub ml-1">{item.unit}</span> */}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="cardValueHeading">Graph Options</div>
                        <Row className="cardValueHeading">
                          <Col>2D/3D</Col>
                          <Col>
                            <Toggle
                              defaultChecked={this.state.checked3DValue}
                              icons={false}
                              onChange={(e) => this.handleChecke2DValue(e)}
                            />
                          </Col>
                        </Row>
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
            <Row className="toggleButton">
              {/* {this.props.show_csg === true ? (
                <BounceLoader
                  css={override}
                  size={30}
                  color={"grey  "}
                  loading={true}
                />
              ) : (
                <></>
              )} */}

              {/* {this.props.show_csg === true ? (
                <button
                  onClick={() => {
                    this.handleToggleCSG(false);
                  }}
                >
                  Stop Simulation
                </button>
              ) : (
                <button
                  onClick={() => {
                    this.handleToggleCSG(true);
                  }}
                >
                  Start Simulation
                </button>
              )} */}
            </Row>
          </Col>
        </Row>
        <NamesBar/>
        <div style={this.getStyle("lineChartHeight")}>
          <LineChart />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const {
    average,
    count,
    data,
    ringCount,
    wallData,
    innerRadius,
    outerRadius,
    wallAverageThickness,
    waterTemp,
    pingRate,
    transducerWallData,
    pgs,
    maxWall,
    minWall,
    conc,
  } = state.crossSectionGraph.transducer;
  const { cross_section_graph } = state.updateKey;
  return {
    wallData,
    average,
    count,
    data,
    ringCount,
    outerRadius,
    innerRadius,
    transducerWallData,
    wallAverageThickness,
    show_csg: cross_section_graph,
    waterTemp,
    pingRate,
    pgs,
    maxWall,
    minWall,
    conc,
  };
};
const mapDispatchToProps = {
  updateKey,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CrossSectionMap));
