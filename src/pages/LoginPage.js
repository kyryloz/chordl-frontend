import React from "react";
import * as $ from "jquery";
import colors from "../colors";
import BasePageTemplate from "./BasePageTemplate";
import api from "../api";
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    link: {
        color: colors.defaultPrimaryColor
    }
};

export default class LoginPage extends BasePageTemplate {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            passwordConfirm: ""
        }
    }

    login = () => {
        const loginForm = `username=${this.state.username}&password=${this.state.password}`;
        $.ajax({
            url: `${api.auth}/login`,
            dataType: 'json',
            type: 'POST',
            data: loginForm,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (data) {
                console.log("Login success", data);
                this.context.router.push("/");
                // TODO
                window.location.reload();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, xhr);
            }
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
                    onTouchTap={this.login}/>
            </div>
        )
    }
}

LoginPage.contextTypes = {
    router: React.PropTypes.object
};