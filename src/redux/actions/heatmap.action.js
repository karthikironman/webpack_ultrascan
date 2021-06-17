import {UPDATE_HEATMAP} from '../actionTypes';

export function heatmapGraph(data){
    return {
        type : UPDATE_HEATMAP,
        payload : data
        
    }
}