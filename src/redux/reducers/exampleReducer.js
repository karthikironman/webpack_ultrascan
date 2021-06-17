import {EXAMPLE_ACTION_DONE} from '../actionTypes';

const initialstate = {
variable1:'0'
};

export default function example_reducer(state = initialstate , action){
    switch(action.type){
        case EXAMPLE_ACTION_DONE:{
            return {...state, ...action.payload }
        }
        default:
            return state
    }
}

