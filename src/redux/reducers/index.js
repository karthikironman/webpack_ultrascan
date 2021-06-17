import { combineReducers } from "redux";

import example from "./exampleReducer";
import updateKey from "./updateKey.reducer";
import crossSectionGraph from "./crossSectionGraph.reducer";
import heatmapGraph from "./heatmap.reducer";
import trendGraph from "./trend.reducer";
import names from "./names.reducer"

export default combineReducers({
 example,
updateKey,
crossSectionGraph,
heatmapGraph,
trendGraph,
names
});
