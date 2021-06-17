import { UPDATE_CSG } from '../actionTypes';

const initialstate = {
    transducer: {
        average: [],
        count: 8,
        data: [],
        ringCount: 5,
        wallData:[],
        wallAverageThickness:[],
        innerRadius:0,
        outerRadius:0,
        waterTemp:20,
        pingRate:2000,
        transducerWallData:[]
    }
};

export default function crossSectionGraph(state = initialstate, action) {
    switch (action.type) {
        case UPDATE_CSG: {
            const {average,count,data,ringCount,wallData,innerRadius,outerRadius,wallAverageThickness,waterTemp,pingRate,pgs,maxWall,minWall,conc,transducerWallData} = action.payload;
            // console.log('DESTRUCTED COUNT',ringCount)
            // console.log(state)
            return {
                transducer: {
                    ...state.transducer,
                    average,count,data,ringCount,wallData,outerRadius,innerRadius,wallAverageThickness,waterTemp,pingRate,pgs,maxWall,minWall,conc,transducerWallData
                }
            }
        }
        default:
            return state
    }
}

