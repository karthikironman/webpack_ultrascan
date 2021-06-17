import React from 'react';
import Plot from 'react-plotly.js';
import "../../css/heatmap.css";
import Checkbox from "react-custom-checkbox";

class Waveform extends React.Component {
  constructor(props) {
    super(props);
    
    this.state={
      trace1:{
        x: this.props.x_data,
        y: this.props.raw_data,
        name: 'Raw Data',
        marker: {
        color: 'red',
        },
        type: 'scatter',
        Color: 'red'
      },
      trace2:{
        x: this.props.x_data,
        y: this.props.processed_data,
        name: 'Processed Data',
        marker: {
        color: 'blue',//rgb(255, 217, 102)',
        },
        type: 'scatter'
      },

      trace3:{
        x: this.props.x_data,
        y: this.props.filtered_data,
        name: 'Filtered Data',
        marker: {
        color: 'green',      
        },
        type: 'scatter',
      },

      trace4:{
            type: 'scatter',
            x: [],//this.props.measurement_peak_data[0],// x: [19097, 18601, 15595, 13546, 12026, 7434, 5419],
            y: [],//this.props.measurement_peak_data[1],// [43, 47, 56, 80, 86, 93, 80],
            mode: 'markers',
            name: 'Measurement Peak',
            marker: {
              color: 'rgb (144,238,144)',
              line: {
                color: 'rgb (144,238,144)',
                width: 1,
              },
              symbol: 'star',
              size: 16
            }  
      },
      trace5:{
       x: [],
       y: [],
        fill: 'tozeroy',
        fillcolor:'rgba (255,255,0,0.3)',  
        mode:'line+text', 
        text:"A",
        textposition: 'outside',
        //width: ww,
        color:'rgb (255,255,0)',
        name:'Ignore Area',
        type:'bar',
        marker:{
          color:'rgba (255,255,0,0.3)'
        },
        cliponaxis: false
      },
      peakX:[],
      peakY :[],
    //  data:[this.props.trace1,this.props.trace2,this.props.trace3,this.props.trace4],
      data:[],
      sample_rate:this.props.sample_rate,
      addShaddedAreaFlag:true,
      selectedTraces:[true,true,true,true,true],
      layout:{
      // title: '2D heatmap',
       // autosize: false,
       /*  width: 1600,*/
        height: 350,
        margin: {
          l: 60,
          r: 20,
          b: 40,
          t: 30,
        },
        xaxis: {
          title: {
            text: 'Time (5 ns units)',
            font: {
              family: 'Courier New, monospace',
              size: 18,
            }
          },
          color: 'white'
        },
        yaxis: {
          title: {
            text: 'Amplitude',
            font: {
              family: 'Courier New, monospace',
              size: 18,
            
            }
          },
          color: 'black',
          Range:[0,1500],
          type: 'linear'
        },
        
        paper_bgcolor: "rgba(0,0,0,0)" //transparent
       // paper_bgcolor: "black" ,//transparent
        
      }, 
     
    }
    
 
  }
  getPeakData_X_Y = () => {
    let xx = [];
    let yy = [];
    for (let i = 0; i < this.props.measurement_peak_data.length; i++) {
      xx.push(this.props.measurement_peak_data[i].x);
      yy.push(this.props.measurement_peak_data[i].y);
    }
    this.setState({ peakX: xx, peakY: yy });
  };
  

  addIgnoreRegion = () => {
    let ww = this.props.end - this.props.start;
    
    let array_data1 = this.state.trace1.y;
    let array_data2 = this.state.trace2.y;
    let array_data3 = this.state.trace3.y;
    let array_data4 = this.state.trace4.y;
   
    let max1 = Math.max(...array_data1); //spread operator (...) spreads the array of numbers into individual numbers
    let max2 = Math.max(...array_data2);
    let max3 = Math.max(...array_data3);
    let max4 = Math.max(...array_data4);
     let maxy = Math.max(max1,max2,max3,max4);
    let yMax = Math.round(maxy) * 1.1 ; //give some extra space
     this.setState(
     {
        trace5:{
         // x: [start,end],
          x0:this.props.start + ww/2,
        //dx:30,
         // type:'scatter',
          y: [yMax], //should be the max of the y axis?
          fill: 'tozeroy',
          fillcolor:'rgba (255,255,0,0.3)',  
          mode:'line+text', 
          text:"A",
          textposition: 'outside',
          width: ww,
          color:'rgb (255,255,0)',
          name:'Ignore Area',
          type:'bar',
          marker:{
            color:'rgba (255,255,0,0.3)'
         },
         cliponaxis: false
        }

     }) ;

  }
  removeIgnoreRegion = () => {
      this.setState(
      {
         trace5:{
           x: [],
           y: [],          
         }
 
      }) ;
   }
  
  showHideIgnore = ()=>{
    this.setState(({addShaddedAreaFlag}) => (
      {
          addShaddedAreaFlag:!addShaddedAreaFlag,
      }
    ));
   
  }
  componentDidUpdate(prev) {
    if(prev.row_data !== this.props.row_data || prev.x_data !== this.props.x_data||prev.filtered_data!==this.props.filtered_data 
      || prev.processed_data!==this.props.processed_data
      || prev.measurement_peak_data!==this.props.measurement_peak_data
      ||prev.start !== this.props.start){

      this.getPeakData_X_Y();
      this.setState(
      {
          trace1:{
            x: this.props.x_data,    
            y: this.props.raw_data,
            name: 'Raw Data',
            marker: {
              color: 'red',
              //   size: 12
            },
            type: 'scatter',
            Color: 'red'
          },

          trace2:{
            x: this.props.x_data,// x: [39317, 37236, 35650, 30066, 29570, 27159, 23557, 21046, 18007],
            y: this.props.processed_data,//[33, 20, 13, 19, 27, 19, 49, 44, 38],
            name: 'Processed Data',
            marker: {
            color: 'blue',//rgb(255, 217, 102)',
            },
            type: 'scatter'
          },
    
          trace3:{
            x: this.props.x_data,
            y: this.props.filtered_data,//[23, 42, 54, 89, 14, 99, 93, 70],
            name: 'Filtered Data',
            marker: {
              color: 'green',      
            },
            type: 'scatter',
          },
    
          trace4:{
               // type: 'scatter',
                x: this.state.peakX,// x: [19097, 18601, 15595, 13546, 12026, 7434, 5419],
                y: this.state.peakY,// [43, 47, 56, 80, 86, 93, 80],
              mode: 'markers',
              name: 'Measurement Peak',
              marker: {
               // color: 'rgba(156, 165, 196, 0.95)',
                color: 'rgb (144,238,144)',
                line: {
                  color: 'rgb (144,238,144)',
                  width: 1,
                },
                symbol: 'star',
               // symbol:{ALetter},
                size: 16
              }  
          },

        layout: {
          xaxis: {
            title: {
              text: 'Time ('+ 1 / this.props.sample_rate * 1000 + ' ns units)',         
            },       
          },
        }
      })
     
      this.addIgnoreRegion();
     // if (this.state.addShaddedAreaFlag)
      // if (this.state.selectedTraces[1])
      // {
      //   this.addIgnoreRegion();
      // }
      // else
      // {
      //   this.removeIgnoreRegion();
      // }
 
      let tdata = [];
      let traces = [this.state.trace1,this.state.trace2,this.state.trace3,this.state.trace4,this.state.trace5];
      for (let i = 0; i < this.state.selectedTraces.length; i++)
      {
        if (this.state.selectedTraces[i])
        {
          tdata.push(traces[i]);  
        }

      }
      
        // this.setState({
        //   data:[ this.state.trace1, this.state.trace2,this.state.trace3,this.state.trace4,this.state.trace5]
        // })
 
        this.setState({
          data:tdata
        })
    }    
  }
 
  render() {
    return (
      <div id='myDiv'>
       <Plot
        data={this.state.data}
        layout={this.state.layout}
        style={{ width: "90vw", height: "100%" }} //need both style and config to make the plot responsive to the window's size.
        config={{responsive:true}}
       /> 
       {/* <button onClick={() => this.showHideIgnore()}>Show Shadded Area</button> */}
       <Checkbox              
                name="my-input"
                checked={true}
                onChange={(value) => {
                  this.setState(this.state.selectedTraces[0] = value)
                }}
                label={"Raw Data"}             
                borderColor="#D7C629"
                style={{ cursor: "pointer" }}
                labelStyle={{ marginLeft: 5, userSelect: "none",color:"white" }}  
              />
              <Checkbox              
                name="my-input"
                checked={true}
                onChange={(value) => {
                  this.setState(this.state.selectedTraces[1] = value)
                }}
                label={"Processed Data"}             
                borderColor="#D7C629"
                style={{ cursor: "pointer" }}
                labelStyle={{ marginLeft: 5, userSelect: "none",color:"white" }}  
              />
              <Checkbox              
                name="my-input"
                checked={true}
                onChange={(value) => {
                  this.setState(this.state.selectedTraces[2] = value)
                }}
                label={"Filtered Data"}             
                borderColor="#D7C629"
                style={{ cursor: "pointer" }}
                labelStyle={{ marginLeft: 5, userSelect: "none",color:"white" }}  
              />
              <Checkbox              
                name="my-input"
                checked={true}
                onChange={(value) => {
                  this.setState(this.state.selectedTraces[3] = value)
                }}
                label={"Measurement Peak"}             
                borderColor="#D7C629"
                style={{ cursor: "pointer" }}
                labelStyle={{ marginLeft: 5, userSelect: "none",color:"white" }}  
              />
              <Checkbox              
                name="my-input"
                checked={true}
                onChange={(value) => {
                  this.setState(this.state.selectedTraces[4] = value)
                }}
                label={"Ignore Region"}             
                borderColor="#D7C629"
                style={{ cursor: "pointer" }}
                labelStyle={{ marginLeft: 5, userSelect: "none",color:"white" }}  
              />
              
      </div>
    );
  }
}

export default Waveform; 