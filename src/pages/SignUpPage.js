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
            type: 'POST',
            data: JSON.stringify(user),
            success: function (data) {
                this.setState({
                    username: "",
                    password: "",
                    passwordConfirm: ""
                });
                this.context.router.push("/");
                // TODO don't use reload
                window.location.reload();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error("Error registration", xhr.responseText);
                console.error("Error registration status", status);
                console.error("Error registration err", err);
                this.setState({
                    username: "",
                    password: "",
                    passwordConfirm: ""
                });
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
                /><br /><br />
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