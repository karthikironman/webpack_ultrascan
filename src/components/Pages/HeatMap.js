import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../../css/heatmap.css";
import HeatmapModal from './HeatmapModal'
import PlotlyHeatmap from './PlotlyHeatmap'
import Waveform from './Waveform'
import { connect } from "react-redux";
//import Checkbox from "react-custom-checkbox";


class HeatMap extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      z_data: [],
      x_data: [],
     // raw_data: [4, 8.815617, -18.3516, 8.658275, 27.5859, 48.62691, 60.18013, 91.3286, -145.7109, 116.0653, 106.2662, 68.69447, 53.10596, 37.92797, 47.95942, -47.42691, 69.20731, 44.95468, -29.17197, 17.91674, 16.25515, 14.65559, 17.26048, 31.22245, 46.71704],
      raw_data: [],
      // filtered_data: [2, 30.4267, 33.47752, 44.80953, 62.47495, 77.43523, 104.2153, 102.7393, 137.0004, 186.0706, 219.3173, 181.7615, 120.9154, 143.1835, 82.40501, 48.47132, 74.71461, 60.0909, 7.073525, 6.089851, 6.53745, 6.666096, 7.306965, 5.73684, 3.625628],
      // processed_data: [4, 8.815617, 18.3516, 8.658275, 27.5859, 48.62691, 60.18013, 91.3286, 145.7109, 116.0653, 106.2662, 68.69447, 53.10596, 37.92797, 47.95942, 47.42691, 69.20731, 44.95468, 29.17197, 17.91674, 16.25515, 14.65559, 17.26048, 31.22245, 46.71704],
      // measurement_peak_data: [43, 47, 56, 80, 86, 93, 80],
      filtered_data: [],
      processed_data: [],
      measurement_peak_data:[],
      ignored_peak_data: [],
      sample_rate: 6,
      start:100,
      end:150,
     
    };
  }

  handleShow = () => {
    //  console.log('from handleShow function');
    this.setState({
      show: true,
    });

  }

  handleClose = () => {

    this.setState({
      show: false
    });

  };

  updateInputValue = (evt) => {
    this.setState({
      sample_rate: evt.target.value
    });
  }
  updateStartValue = (evt) => {
    let svalue = Number(evt.target.value);
  //  let eValue = svalue + 50;
    this.setState({
      start:svalue,
    //  end:eValue
    });
  }
  updateEndValue = (evt) => {
    let evalue = Number(evt.target.value);
    this.setState({
      end: evalue,
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.data && prevProps.data !== this.props.data) {
   
      let { data } = this.props;
      let array_data = [...this.state.z_data];
      let fd = [];
      let pd = [];
      if (array_data.length > 240 ) {
        array_data.shift();
      }
      array_data.push(data);
     
      for (let ii = 0; ii < data.length; ii++)
      {
        fd.push(data[ii] + 200);
        if (ii%10 == 0 && data[ii] !== 0)
        {
          let bb = {y:data[ii], x:ii}
          pd.push(bb);
        }
       
      }
       
     let aa = [];

     for (var index = 0; index < 500; index++)
      {
        aa.push(index); 
      }
      
      this.setState({ z_data: array_data, raw_data:data, x_data:aa, processed_data:aa,filtered_data:fd, measurement_peak_data:pd});   
    }
    
  }

  render() {
    return (
      <div className="heatmap">
        <div >
          <Waveform 
              x_data = {this.state.x_data} 
              raw_data={this.state.raw_data} 
              processed_data = {this.state.processed_data} 
              filtered_data = {this.state.filtered_data}
              measurement_peak_data = {this.state.measurement_peak_data}
              sample_rate = {this.state.sample_rate}
              start = {this.state.start}
              end = {this.state.end}
          />
          <raw>
            <label className="radio-btn-text">Sample Rate</label>
            <input onChange={this.updateInputValue}/>
            <label className="radio-btn-text">Start</label>
            <input onChange={this.updateStartValue}/>
            <label className="radio-btn-text">End</label>
            <input onChange={this.updateEndValue}/>
           
         </raw>
        </div>
        <div >
          <div id="spectrogram-header" className="xlate spectrogram-header-white" xlateid="Spectrogram">Spectrogram</div>
          <button className="glyphicon glyphicon-refresh btnsize" ></button>
          <button className="glyphicon glyphicon-question-sign btnsize" onClick={() => this.handleShow()}></button>
          <HeatmapModal
            show={this.state.show}
            onHide={this.handleClose} />
        </div >
        <div >
          <PlotlyHeatmap dataFromParent={this.state.z_data} />
        </div>

      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const {
    data
  } = state.heatmapGraph;
  return {
    data,
  };
};
export default connect(
  mapStateToProps
)(withRouter(HeatMap));
//export default withRouter(HeatMap);