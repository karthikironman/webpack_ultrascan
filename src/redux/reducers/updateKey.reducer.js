import { CSG_Key } from '../actionTypes';

const initialstate = {
    cross_section_graph: true
};

export default function updateKey(state = initialstate, action) {
    switch (action.type) {
        case CSG_Key: {
            return {
                ...state,
               ...action.payload
            }
        }
        default:
            return state
    }
}

