import { UPDATE_HEATMAP } from '../actionTypes';

const initialstate = {
     data: []
};
export default function heatmapGraph(state = initialstate, action) {
    switch (action.type) {
        case UPDATE_HEATMAP: {
            const data = action.payload;
            return {
                data
            }
        }
        default:
            return state
    }
}