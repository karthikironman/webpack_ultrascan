import {UPDATE_CSG} from '../actionTypes';

export function crossSectionGraph(data){
    return {
        type : UPDATE_CSG,
        payload : data
        //_______data structure______________
        // {
        //     average: [],
        //     count: 8,
        //     data: [],
        //     ringCount: 5
        // }
        //____________________________________
    }
}