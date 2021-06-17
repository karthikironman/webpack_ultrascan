import {EXAMPLE_ACTION_DONE} from '../actionTypes';

export function exampleAction(data){
    return {
        type : EXAMPLE_ACTION_DONE,
        payload : {
            variable1 : data
        }
    }
}