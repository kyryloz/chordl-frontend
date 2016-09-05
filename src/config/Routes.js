import React from "react";
import {Router, Route, IndexRoute} from "react-router";
import AddNewSongPage from "../pages/AddNewSongPage";
import PerformerPage from "../pages/PerformerPage";
import SongPage from "../pages/SongPage";
import HomePage from "../pages/HomePage";
import EditPerformerPage from "../pages/EditPerformerPage";
import EditSongPage from "../pages/EditSongPage";
import SearchPage from "../pages/SearchPage";
import NotFoundPage from "../pages/NotFoundPage";
import {Provider} from "react-redux";
import App from "./App";
import store, {history} from "../store/store";
import {UserAuthWrapper} from "redux-auth-wrapper";

const onlyAuthenticated = UserAuthWrapper({
    authSelector: state => state.auth.user,
    wrapperDisplayName: "OnlyAuthenticated",
    failureRedirectPath: "/",
    allowRedirectBack: false,
});

const onlyAdmin = UserAuthWrapper({
    authSelector: state => state.auth.user,
    wrapperDisplayName: 'OnlyAdmin',
    failureRedirectPath: "/",
    allowRedirectBack: false,
    predicate: user => user ? user.authorities.indexOf("ROLE_ADMIN") >= 0 : false
});

export default class Routes extends React.Component {

    handleUpdate() {
        const {action} = this.state.location;

        if (action === "PUSH") {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return (
            <div>
                <Provider store={store}>
                    <Router history={history} onUpdate={this.handleUpdate}>
                        <Route path='/' component={App}>
                            <IndexRoute component={HomePage}/>
                            <Route path='/add' component={onlyAuthenticated(AddNewSongPage)}/>
                            <Route path='/performer/:id' component={PerformerPage}/>
                            <Route path='/performer/:id/edit' component={onlyAdmin(EditPerformerPage)}/>
                            <Route path='/song/:id' component={SongPage}/>
                            <Route path='/song/:id/edit' component={EditSongPage}/>
                            <Route path='/search' component={SearchPage}/>
                            <Route path='*' component={NotFoundPage}/>
                        </Route>
                    </Router>
                </Provider>
            </div>
        )
    }
}