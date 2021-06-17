import { UPDATE_NAMES } from '../actionTypes';

export function updateNames(data) {
    return {
        type: UPDATE_NAMES,
        payload: data
    }
}