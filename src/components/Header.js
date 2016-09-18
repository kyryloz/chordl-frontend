/* global FB */
import React from "react";
import {Link} from "react-router";
import {Button, Alert, OverlayTrigger, Popover, Navbar, Nav, NavItem, FormGroup, FormControl, NavDropdown} from "react-bootstrap/lib";

export default class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: "",
            showLoginWarning: false
        }
    }

    componentDidMount() {
        this.props.authGetUserAsync();

        // debug stuff

        // this.props.authLoginUser({
        //     username: "John Doe",
        //     authorities: ["ROLE_ADMIN"],
        //     facebookLink: "link",
        //     facebookUserId: "123"
        // });
    }

    handleLogin = (rerequest) => {
        this.setState({
            showLoginWarning: false
        });

        FB.login((response) => {
            if (response.authResponse) {
                const {userID, accessToken, grantedScopes} = response.authResponse;
                const scopesArr = grantedScopes.split(',');

                if (scopesArr.indexOf("email") < 0) {
                    this.setState({
                        showLoginWarning: true
                    });
                    return;
                }

                const authData = {
                    userId: userID,
                    socialToken: accessToken,
                    scopes: scopesArr
                };
                this.props.authUser(authData);
            }
        }, rerequest === true ? {
            scope: "email,public_profile",
            return_scopes: true,
            auth_type: "rerequest"
        } : {
            scope: "email,public_profile",
            return_scopes: true
        });
    };

    handleLogout = () => {
        this.props.authLogoutUser();
    };

    handleSearch = (e) => {
        e.preventDefault();
        this.context.router.push("/search/?query=" + this.state.searchQuery);
    };

    handleSearchQueryChange = (e) => {
        this.setState({
            searchQuery: e.target.value
        });
    };

    handleAddPress = (e) => {
        e.preventDefault();
        if (this.props.user) {
            this.context.router.push("/add");
        }
    };

    handleAboutPress = (e) => {
        e.preventDefault();
        this.context.router.push("/about");
    };

    handleAlertDismiss = () => {
        this.setState({
            showLoginWarning: false
        });
    };

    renderLoginWarning = () => {
        if (this.state.showLoginWarning) {
            return (
                <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
                    <h4>Oh snap!</h4>
                    <p>Sorry, but we need your email in order to authenticate you.</p>
                    <p>
                        <Button onClick={this.handleLogin.bind(null, true)} bsStyle="danger">Add email</Button>
                        <span> or </span>
                        <Button onClick={this.handleAlertDismiss}>Go to hell</Button>
                    </p>
                </Alert>
            );
        }
    };

    renderAddButton = () => {
        return (
            this.props.user
                ?
                this.renderAddNewSong()
                :
                <OverlayTrigger trigger={["hover", "focus"]} placement="bottom" overlay={this.renderLoginPopover()}>
                    {this.renderAddNewSong()}
                </OverlayTrigger>
        )
    };

    renderAddNewSong() {
        return <NavItem onClick={this.handleAddPress}>Add new song</NavItem>;
    }

    renderLoginBlock() {
        if (this.props.loginLoading) {
            return (
                <NavItem>Loading...</NavItem>
            )
        } else {
            if (this.props.user) {
                return (
                    <NavDropdown title={`Hello, ${this.props.user.username}`} id="basic-nav-dropdown">
                        <NavItem onClick={this.handleLogout}>Log out</NavItem>
                    </NavDropdown>
                )
            } else {
                return (
                    <NavItem onClick={this.handleLogin}>Log in with Facebook</NavItem>
                )
            }
        }
    }

    renderLoginPopover = () => {
        return (
            <Popover title="Authenticate" id="authenticate-popover">
                <p>In order to add a song you should login with your Facebook account first.</p>
                <p>We don't post anything on your page.</p>
            </Popover>
        );
    };

    render() {
        return (
            <div>
                <Navbar fixedTop={true}>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/">Chords Library <sup>beta</sup></Link>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            {this.renderLoginBlock()}
                        </Nav>
                        <form onSubmit={this.handleSearch}>
                            <Navbar.Form pullRight>
                                <FormGroup>
                                    <FormControl
                                        style={{width: 280, marginRight: 16}}
                                        onChange={this.handleSearchQueryChange}
                                        value={this.state.searchQuery}
                                        type="text"
                                        placeholder="Search"/>
                                </FormGroup>
                            </Navbar.Form>
                        </form>
                        <Nav pullRight>
                            {this.renderAddButton()}
                            <NavItem onClick={this.handleAboutPress}>About this project</NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                {this.renderLoginWarning()}
            </div>
        )
    }
}

Header.contextTypes = {
    router: React.PropTypes.object
};