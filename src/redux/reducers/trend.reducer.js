import { UPDATE_TREND_HOMEPAGE } from '../actionTypes';

const initialstate = {
    wall1: Array(100).fill(null),
    wall2: Array(100).fill(null),
    wall3: Array(100).fill(null),
    wall4: Array(100).fill(null),
    wall5: Array(100).fill(null),
    wall6: Array(100).fill(null),
    wall7: Array(100).fill(null),
    wall8: Array(100).fill(null),
    timeLabel: Array(100).fill(""),
    transducer1wall1: Array(100).fill(null),
    transducer1wall2: Array(100).fill(null),
    transducer1wall3: Array(100).fill(null),
    transducer1wall4: Array(100).fill(null),
    transducer1wall5: Array(100).fill(null),
    transducer1wall6: Array(100).fill(null),
    transducer1wall7: Array(100).fill(null),
    transducer1wall8: Array(100).fill(null),
    transducer2wall1: Array(100).fill(null),
    transducer2wall2: Array(100).fill(null),
    transducer2wall3: Array(100).fill(null),
    transducer2wall4: Array(100).fill(null),
    transducer2wall5: Array(100).fill(null),
    transducer2wall6: Array(100).fill(null),
    transducer2wall7: Array(100).fill(null),
    transducer2wall8: Array(100).fill(null),
    transducer3wall1: Array(100).fill(null),
    transducer3wall2: Array(100).fill(null),
    transducer3wall3: Array(100).fill(null),
    transducer3wall4: Array(100).fill(null),
    transducer3wall5: Array(100).fill(null),
    transducer3wall6: Array(100).fill(null),
    transducer3wall7: Array(100).fill(null),
    transducer3wall8: Array(100).fill(null),
    transducer4wall1: Array(100).fill(null),
    transducer4wall2: Array(100).fill(null),
    transducer4wall3: Array(100).fill(null),
    transducer4wall4: Array(100).fill(null),
    transducer4wall5: Array(100).fill(null),
    transducer4wall6: Array(100).fill(null),
    transducer4wall7: Array(100).fill(null),
    transducer4wall8: Array(100).fill(null),
    transducer5wall1: Array(100).fill(null),
    transducer5wall2: Array(100).fill(null),
    transducer5wall3: Array(100).fill(null),
    transducer5wall4: Array(100).fill(null),
    transducer5wall5: Array(100).fill(null),
    transducer5wall6: Array(100).fill(null),
    transducer5wall7: Array(100).fill(null),
    transducer5wall8: Array(100).fill(null),
    transducer6wall1: Array(100).fill(null),
    transducer6wall2: Array(100).fill(null),
    transducer6wall3: Array(100).fill(null),
    transducer6wall4: Array(100).fill(null),
    transducer6wall5: Array(100).fill(null),
    transducer6wall6: Array(100).fill(null),
    transducer6wall7: Array(100).fill(null),
    transducer6wall8: Array(100).fill(null),
    transducer7wall1: Array(100).fill(null),
    transducer7wall2: Array(100).fill(null),
    transducer7wall3: Array(100).fill(null),
    transducer7wall4: Array(100).fill(null),
    transducer7wall5: Array(100).fill(null),
    transducer7wall6: Array(100).fill(null),
    transducer7wall7: Array(100).fill(null),
    transducer7wall8: Array(100).fill(null),
    transducer8wall1: Array(100).fill(null),
    transducer8wall2: Array(100).fill(null),
    transducer8wall3: Array(100).fill(null),
    transducer8wall4: Array(100).fill(null),
    transducer8wall5: Array(100).fill(null),
    transducer8wall6: Array(100).fill(null),
    transducer8wall7: Array(100).fill(null),
    transducer8wall8: Array(100).fill(null)
};

export default function updateKey(state = initialstate, action) {
    switch (action.type) {
        case UPDATE_TREND_HOMEPAGE: {
            return {
                ...state,
                ...action.payload
            }
        }
        default:
            return state
    }
}

