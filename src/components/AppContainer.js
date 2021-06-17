import { Provider, connect } from 'react-redux';
import store from '../redux/store';
import React from 'react';
import RouterPage from "../Route/index.js";
import centralUpdater from "../services/CentralUpdater"
class AppContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.interval_var = null;
    }
    componentDidMount() {
        this.interval_var = window.setInterval(() => {
            centralUpdater();
        }, 500)
    }
    componentWillUnmount(){
        clearInterval(this.interval_var)
    }
    render() {
        return (
            <Provider store={store}>
                <div id="AppContainer">
                    <RouterPage />
                </div>
            </Provider>
        )
    }
}
export default AppContainer