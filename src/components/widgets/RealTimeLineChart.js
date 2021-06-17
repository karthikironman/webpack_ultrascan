import React from 'react';
import { Line } from 'react-chartjs-2';
import "../../css/RealTimeLineChart.css"
import { connect } from "react-redux";
import Checkbox from "react-custom-checkbox";

class RealTimeLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        labels: Array(100).fill(" "),
        datasets: [
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        hover: { animationDuration: 0 },
        responsiveAnimationDuration: 300,
        tooltips: {
          enabled: false
        },
        legend: {
          labels: {
            //   fontColor: "white",
            //   fontSize:10,
            //   font: {
            //     size: 10
            // }
          },
          display: false
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                // labelString: "Time",
                fontColor: "white",
                fontSize: 10
              },
              ticks: { fontColor: "white" }
            }
          ],
          yAxes: [
            {
              id: "A",
              type: "linear",
              position: "left",
              scaleLabel: {
                display: true,
                labelString: "Wall Thickness ",
                fontColor: "white",
                fontSize: 13
              },
              gridLines: {
                display: false
              },
              ticks: {
                fontColor: "white",
                suggestedMax: -1000,
                suggestedMin: 1000
              }
            }
          ]
        }
      },
      waveColor: [
        "#d99669",
        "#cb6a61",
        "#c75054",
        "#d5cf35",
        "#c19d35",
        "#9e8b31",
        "#ac6947",
        "#d99669",
        "#cb6a61",
        "#c75054",
        "#d5cf35",
        "#c19d35",
        "#9e8b31",
        "#ac6947"
      ],
      legendCheckBox: Array(20).fill(true), //20 predefined variable to hold the checkbox legend value,
      legendCheckBoxTransducer: Array(20).fill(true) //20 predefined variable to hold the checkboxes of transducer value
    }
  }
  showTransistorFilter = () => {
    let countTrue = 0;
    let expectedCount = 1;
    let index = 0;
    for (let a = 0; a < this.props.wallAverageThickness.length; a++) {
      if (this.state.legendCheckBox[a] === true) {
        countTrue++;
        index = a + 1;
      }
    }
    if (countTrue == expectedCount) {
      return index;  //if the number is non zero, the numbered wall's transduer data need to be displayed
    } else {
      return 0  // multiple walls are selected
    }
  }
  refresh = () => {
    let wall_count = this.props.wallAverageThickness.length; //get the total number of walls
    let datasetArray = [];
    let WallSelected = this.showTransistorFilter();
    if (WallSelected == 0) {
      for (let a = 0; a < wall_count; a++) {
        datasetArray.push({
          label: "Wall-" + a,
          yAxisID: "A",
          fill: "none",
          backgroundColor: '#faff70',
          pointRadius: 0,
          borderColor: this.state.legendCheckBox[a] === true ? this.state.waveColor[wall_count - a] : '#66000000',
          borderWidth: 2,
          lineTension: 0,
          data: this.state.legendCheckBox[a] === true ? [...this.props[`wall${a + 1}`]] : Array(100).fill(null)
        })
      }
    }
    else {
      let transducer_count = this.props.transducerWallData.length;
      for (let a = 0; a <transducer_count; a++) {
        datasetArray.push({
          label: "Transducer-" + a,
          yAxisID: "A",
          fill: "none",
          backgroundColor: '#faff70',
          pointRadius: 0,
          borderColor: this.state.legendCheckBoxTransducer[a] === true ? this.state.waveColor[transducer_count - a] : '#66000000',
          borderWidth: 2,
          lineTension: 0,
          data: this.state.legendCheckBoxTransducer[a] === true ? [...this.props[`transducer${a+1}wall${WallSelected}`]] : Array(100).fill(null)
        })
      }
    }

    this.setState({
      data: {
        ...this.state.data,
        labels: this.props.timeLabel,
        datasets: datasetArray
      }
    });
  }
  componentDidUpdate(prev) {
    if (prev.wallAverageThickness != this.props.wallAverageThickness) {
      this.refresh();
    }

  }
  legendCheckBoxClick = (index, value) => {
    let prevState = JSON.parse(JSON.stringify(this.state.legendCheckBox));
    prevState[index] = value;
    this.setState({ legendCheckBox: prevState })
  }
  legendCheckBoxClickTransducer = (index, value) => {
    let prevState = JSON.parse(JSON.stringify(this.state.legendCheckBoxTransducer));
    prevState[index] = value;
    this.setState({ legendCheckBoxTransducer: prevState })
  }
  convertPXToVH = (px) => {
    return px * (100 / document.documentElement.clientHeight);
  }
  getDynamicHeight = () => {
    //this style is used to place the checkbox card always on the top
    //but when the size is overflowing it will go up without hiding inside bottom nav
    let heightInCss = 32;
    let filterBox = document.getElementById('FilterBox');
    let elHeight = filterBox !== null ? filterBox.clientHeight : '0';
    elHeight = this.convertPXToVH(elHeight);
    //check if the digit is overflowing
    // if overflowing return css-height to get the subtraction result zero
    if (elHeight > heightInCss) {
      elHeight = heightInCss;
    }
    let style = { bottom: 'calc(' + heightInCss + 'vh - ' + elHeight + 'vh)' };
    if (this.showTransistorFilter()) {
      style.right = '9vw';
    }
    return style
  }
  componentDidMount() {
    this.refresh();
  }
  render() {
    let wall_count = this.props.wallAverageThickness.length;
    return (
      <div className="line-chart">
        <Line
          data={this.state.data}
          options={this.state.options}
          width={100}
          height={100}
        />
        <div id="FilterBox" style={this.getDynamicHeight()}>
          {this.props.wallAverageThickness.map((x, a) => {
            return (<Checkbox
              key={"Wall -" + (a + 1)}
              borderColor={this.state.waveColor[wall_count - a]}
              checked={this.state.legendCheckBox[a]}
              style={{ cursor: "pointer" }}
              labelStyle={{ marginLeft: 5, userSelect: "none" }}
              label={"Wall -" + (a + 1)}
              onChange={(value) => {
                this.legendCheckBoxClick(a, value)
              }}
            />)
          })}
        </div>
        {this.showTransistorFilter() != 0 &&  <div id="FilterBoxTransducer" >
          {this.props.transducerWallData.map((x, a) => {
            return (<Checkbox
              key={"Transistor -" + (a + 1)}
              borderColor={this.state.waveColor[wall_count - a]}
              checked={this.state.legendCheckBoxTransducer[a]}
              style={{ cursor: "pointer" }}
              labelStyle={{ marginLeft: 5, userSelect: "none" }}
              label={"Transducer -" + (a + 1)}
              size={28}
              onChange={(value) => {
                this.legendCheckBoxClickTransducer(a, value)
              }}
            />)
          })}
        </div>}
       

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    wallAverageThickness,
    transducerWallData,
  } = state.crossSectionGraph.transducer;
  const { wall1, wall2, wall3, wall4, wall5, wall6, wall7, wall8, timeLabel,
    transducer1wall1, transducer1wall2, transducer1wall3, transducer1wall4, transducer1wall5, transducer1wall6, transducer1wall7, transducer1wall8,
    transducer2wall1, transducer2wall2, transducer2wall3, transducer2wall4, transducer2wall5, transducer2wall6, transducer2wall7, transducer2wall8,
    transducer3wall1, transducer3wall2, transducer3wall3, transducer3wall4, transducer3wall5, transducer3wall6, transducer3wall7, transducer3wall8,
    transducer4wall1, transducer4wall2, transducer4wall3, transducer4wall4, transducer4wall5, transducer4wall6, transducer4wall7, transducer4wall8,
    transducer5wall1, transducer5wall2, transducer5wall3, transducer5wall4, transducer5wall5, transducer5wall6, transducer5wall7, transducer5wall8,
    transducer6wall1, transducer6wall2, transducer6wall3, transducer6wall4, transducer6wall5, transducer6wall6, transducer6wall7, transducer6wall8,
    transducer7wall1, transducer7wall2, transducer7wall3, transducer7wall4, transducer7wall5, transducer7wall6, transducer7wall7, transducer7wall8,
    transducer8wall1, transducer8wall2, transducer8wall3, transducer8wall4, transducer8wall5, transducer8wall6, transducer8wall7, transducer8wall8 } = state.trendGraph;
  return {
    wallAverageThickness,
    transducerWallData,
    wall1, wall2, wall3, wall4, wall5, wall6, wall7, wall8, timeLabel,
    transducer1wall1, transducer1wall2, transducer1wall3, transducer1wall4, transducer1wall5, transducer1wall6, transducer1wall7, transducer1wall8,
    transducer2wall1, transducer2wall2, transducer2wall3, transducer2wall4, transducer2wall5, transducer2wall6, transducer2wall7, transducer2wall8,
    transducer3wall1, transducer3wall2, transducer3wall3, transducer3wall4, transducer3wall5, transducer3wall6, transducer3wall7, transducer3wall8,
    transducer4wall1, transducer4wall2, transducer4wall3, transducer4wall4, transducer4wall5, transducer4wall6, transducer4wall7, transducer4wall8,
    transducer5wall1, transducer5wall2, transducer5wall3, transducer5wall4, transducer5wall5, transducer5wall6, transducer5wall7, transducer5wall8,
    transducer6wall1, transducer6wall2, transducer6wall3, transducer6wall4, transducer6wall5, transducer6wall6, transducer6wall7, transducer6wall8,
    transducer7wall1, transducer7wall2, transducer7wall3, transducer7wall4, transducer7wall5, transducer7wall6, transducer7wall7, transducer7wall8,
    transducer8wall1, transducer8wall2, transducer8wall3, transducer8wall4, transducer8wall5, transducer8wall6, transducer8wall7, transducer8wall8
  };
};


export default connect(
  mapStateToProps
)(RealTimeLineChart);