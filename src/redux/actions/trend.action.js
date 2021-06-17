import {UPDATE_TREND_HOMEPAGE} from '../actionTypes';
import store from "./../store";

export function updateTrendWalls(data,transducerArray){
   // data structure is [wall1_thickness,wall2_thickness,...walln_thickness]
   // n can be max 8
   // transducer array is structure
   // t1[w1,w2,w3....],t2[w1,w2,w3...]....etc.,
    let prevState = store.getState().trendGraph;
    for(let a=0;a<data.length;a++){
        prevState[`wall${a+1}`].push(data[a]);
        prevState[`wall${a+1}`].shift();
    }
    for(let a=0;a<transducerArray.length;a++){  //looop for transducer
        for(let b=0;b<transducerArray[a].length;b++){//loop for walls
            //  console.log(prevState[`transducer${a+1}`][`wall${b+1}`]);
             prevState[`transducer${a+1}wall${b+1}`].push(transducerArray[a][b]);
                 prevState[`transducer${a+1}wall${b+1}`].shift();
        }}
    //to update the latest device time in the timelabel field
    let temp_ms = Date.now();
    let dayMs = 10;
    var new_date_ms = new Date(temp_ms + 100 * dayMs).toLocaleTimeString('it-IT');
    let label = prevState.timeLabel;
    label.shift();
    label.push(new_date_ms);
    prevState.timeLabel = label
    //end of the timelabel field update
     return {
         type : UPDATE_TREND_HOMEPAGE,
         payload : prevState
     }
}