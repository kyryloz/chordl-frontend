import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as actionCreators from "../actions/actionCreators";
import MainContainer from "./MainContainer";

function mapStateToProps(state) {
    console.log("map state to props:", state);
    return {
        user: state.authReducer.user
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const App = connect(mapStateToProps, mapDispatchToProps)(MainContainer);

export default App;