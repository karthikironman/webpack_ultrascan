import { UPDATE_NAMES } from '../actionTypes';

const initialstate = {
    line_name: 'Ultrascan',
    reel_number:0
};

export default function updateKey(state = initialstate, action) {
    switch (action.type) {
        case UPDATE_NAMES: {
            return {
                ...state,
               ...action.payload
            }
        }
        default:
            return state
    }
}

