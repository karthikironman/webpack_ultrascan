import store from "../redux/store";
//import the actions
import { crossSectionGraph } from "../redux/actions/crossSectionGraph.action";
import { heatmapGraph } from "../redux/actions/heatmap.action";
import { updateTrendWalls } from "../redux/actions/trend.action";
import dataGathering from "./DataGathering";
let id = 1;
let transducer = 5;
let wallCount = 4;
let innerRadius = 20;
let outerRadius = 100;
let dataGather = dataGathering.makeSimulator(id, transducer, wallCount, outerRadius, innerRadius);
//import the api_services

//use promise to make the centralUpdater synchronous
//usually promise is not needed when doing actual api call to device
//since the simulator is not promise based class/function we return promise
const crossSectionGraphUpdater = async (key) => {
  if (key) {
    return new Promise((resolve, reject) => {
      //make api call
      //check the value of key assigned to it
      //update the values in store
      let dg_instance = dataGather.getData();
      let data = dg_instance.transducerThicknesses();
      let waterTemp = dg_instance.waterTemp();
      let pingRate = dg_instance.pingRate();
      // let avgForAllLayers = dg_instance.getAvgWallForAllLayers();
      let count = 4;
      let ringCount = 3
      let average = dg_instance.transducerPositionsAndThicknesses();
      let wallData = dg_instance.wall_data;
      let transducerRow = new Array(transducer); 
      //an array of size transistor count
      for(let a=0;a<transducer;a++){
          transducerRow[a]=[]; 
          //each element will be an empty array
      }
       for (let a = 0; a < transducer; a++) { 
         //for transistor length
           for(let b=0;b<wallCount;b++){ 
             //push wall data inside
              transducerRow[a][b] = dg_instance.getThicknessAt(a,b)
           }
           //output will be in the format
           // t1[w1,w2,w3..],t2[w1,w2,w3..],...
       }
      let transducerWallData = JSON.parse(JSON.stringify(transducerRow));
      let wallAverageThickness = dg_instance.wallAverageThicknesses();
      let pgs = dg_instance.PGS();
      let maxWall = dg_instance.wallMaxThicknesses();
      let minWall = dg_instance.wallMinThicknesses();
      let conc = dg_instance.concentricities();
      let data_obj = { outerRadius, innerRadius, data, count, ringCount, average, wallData,transducerWallData, wallAverageThickness, waterTemp, pingRate, pgs, maxWall, minWall, conc };
      store.dispatch(crossSectionGraph(data_obj));
      //updates the trendGraph reducer
      store.dispatch(updateTrendWalls(wallAverageThickness,transducerWallData));
      resolve('success');
    })
  } else {
    // console.log('turned off')
  }
}

const heatmapGraphUpdater = async (key) => {
  if (key) {
    return new Promise((resolve, reject) => {
      //make api call
      //check the value of key assigned to it
      //update the values in store
      let dg_waveforms = dataGather.getWaveforms();
      let data = dg_waveforms.data;
      store.dispatch(heatmapGraph(data));
      // console.log(data,store.getState().heatmapGraph);
      resolve('success')
    })
  } else {
    // console.log('turned off')
  }
}


//main function that does the update in synchronous manner
const centralUpdater = async () => {
  let key = store.getState().updateKey.cross_section_graph;
  await crossSectionGraphUpdater(key);
  //  key = store.getState().updateKey.heat_map;
  await heatmapGraphUpdater(true);
};

export default centralUpdater;
