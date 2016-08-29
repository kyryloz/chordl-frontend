import React from "react";
import * as $ from "jquery";
import colors from "../colors";
import BasePageTemplate from "./BasePageTemplate";
import api from "../api";
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Store from "../store/store";

const styles = {
    link: {
        color: colors.defaultPrimaryColor
    }
};

const store = new Store;

export default class LoginPage extends BasePageTemplate {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            passwordConfirm: ""
        }
    }

    loginJwt = () => {
        const loginData = {
            username: this.state.username,
            password: this.state.password
        };

        $.ajax({
            url: `${api.auth}/auth`,
            type: "POST",
            data: JSON.stringify(loginData),
            success: function (data, textStatus, jqXHR) {
                store.setJwtToken(data.jwtToken);
                console.log("Login success", data);
                this.context.router.push("/");
            }.bind(this),
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                    alert("Error!");
                } else {
                    throw new Error("an unexpected error occured: " + errorThrown);
                }
            }.bind(this)
        });
    };

    handleEditUsername = (event) => {
        this.setState({
            username: event.target.value
        });
    };

    handleEditPassword = (event) => {
        this.setState({
            password: event.target.value
        });
    };

    renderHeader() {
        return <h3>Login</h3>
    }

    renderMenu() {
        return null;
    }

    renderContent() {
        return (
            <div>
                <TextField
                    hintText="Username"
                    floatingLabelText="Username"
                    value={this.state.username}
                    onChange={this.handleEditUsername}
                /><br />
                <TextField
                    hintText="Password"
                    floatingLabelText="Password"
                    type="password"
                    value={this.state.password}
                    onChange={this.handleEditPassword}
                /><br /><br />
                <RaisedButton
                    label="Login"
                    primary={true}
                    onTouchTap={this.loginJwt}/>
            </div>
        )
    }
}

LoginPage.contextTypes = {
    router: React.PropTypes.object
};