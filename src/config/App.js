import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as actionCreators from "../actions/actionCreators";
import MainContainer from "../components/MainContainer";

function mapStateToProps(state) {
    return {
        user: state.auth.user,
        loginLoading: state.auth.loginLoading
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const App = connect(mapStateToProps, mapDispatchToProps)(MainContainer);

export default App;