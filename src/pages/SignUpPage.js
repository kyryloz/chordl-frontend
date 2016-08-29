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

export default class SignUpPage extends BasePageTemplate {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            passwordConfirm: ""
        }
    }

    register = () => {
        const user = {
            username: this.state.username,
            password: this.state.password,
            passwordConfirm: this.state.passwordConfirm
        };
        $.ajax({
            url: `${api.auth}/register`,
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify(user),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.setState(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    };

    logout = () => {
        $.ajax({
            url: `${api.auth}/logout`,
            type: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                console.log("Logout success", data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err);
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

    handleEditPasswordConfirm = (event) => {
        this.setState({
            passwordConfirm: event.target.value
        });
    };

    renderHeader() {
        return <h3>Register new user</h3>
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
                /><br />
                <TextField
                    hintText="Confirm password"
                    floatingLabelText="Confirm password"
                    type="password"
                    value={this.state.passwordConfirm}
                    onChange={this.handleEditPasswordConfirm}
                /><br />
                <RaisedButton
                    label="Register"
                    primary={true}
                    onTouchTap={this.register}/>
            </div>
        )
    }
}

SignUpPage.contextTypes = {
    router: React.PropTypes.object
};