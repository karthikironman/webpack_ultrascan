import React from 'react';
import Plot from 'react-plotly.js';
import "../../css/heatmap.css";

class PlotlyHeatmap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      z_data: this.props.dataFromParent, //parent is HeatMap.js
      data: [
        {
          z: this.props.dataFromParent,
          type: 'heatmap',
          // colorscale:spectogramColors,
          showscale: false

        },

      ],
      layout: {
        // title: '2D heatmap',
        // autosize: false,
        /*  width: 1600,*/
        height: 400,
        margin: {
          l: 10,
          r: 10,
          b: 50,
          t: 30,
        },
        paper_bgcolor: "rgba(0,0,0,0)" //transparent
      }
    }

    this.onChangeValue = this.onChangeValue.bind(this);
  }

  componentDidUpdate(prev) {
    if(prev.dataFromParent !== this.props.dataFromParent){
      this.setState({
        z_data: this.props.dataFromParent, //parent is HeatMap.js
        data: [
          { ...this.state.data[0],
            z: this.props.dataFromParent,
            // colorscale:spectogramColors,
            showscale: false
  
          },
  
        ],
        layout: {
          // title: '2D heatmap',
          // autosize: false,
          /*  width: 1600,*/
          height: 400,
          margin: {
            l: 40,
            r: 20,
            b: 50,
            t: 30,
          },
          paper_bgcolor: "rgba(0,0,0,0)" //transparent
        }
      })
    }
    
  }
  // if 2D or 3D
  onChangeValue(event) {
    if (event.target.value === "2D") {
      this.setState({

        data: [
          {
            z: this.state.z_data,
            //z: [[30, 1, 60], [20, 1, 60], [1, 60, 30]],
            type: 'heatmap',
            // colorscale:spectogramColors,
            showscale: false

          },

        ],

      });
    }
    else {
      this.setState({
        data: [
          {
            z: this.state.z_data,
            type: 'surface',
            // colorscale:spectogramColors,
            showscale: false

          },
        ],

      });

    }
  }
  render() {

    return (
      <div >
        <div onChange={this.onChangeValue} style={{ marginTop: 10 }}>
          <input type="radio" value="2D" name="heatmap" onChange={this.handleChange} defaultChecked />
          <label htmlFor="2D" className="radio-btn-text">2D</label>
          <input type="radio" value="3D" name="heatmap" onChange={this.handleChange} style={{ marginLeft: 10 }} />
          <label htmlFor="3D" className="radio-btn-text">3D</label>
        </div>
        <Plot
          data={this.state.data}
          layout={this.state.layout}
          style={{ width: "90vw", height: "100%" }} //need both style and config to make the plot responsive to the window's size.
          config={{ responsive: true }}
        />
      </div>
    );
  }
}

export default PlotlyHeatmap;