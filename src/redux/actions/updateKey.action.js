import { CSG_Key } from '../actionTypes';

export function updateKey(data) {
    // console.log('update key',data)
    return {
        type: CSG_Key,
        payload: data
   
    }
}