/* global FB */
import React from "react";
import {Link} from "react-router";
import {OverlayTrigger, Popover, Navbar, Nav, NavItem, FormGroup, FormControl, NavDropdown} from "react-bootstrap/lib";

export default class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: "",
            showLoginDialog: false
        }
    }

    componentDidMount() {
        this.props.authGetUserAsync();
    }

    handleLogin = () => {
        FB.login((response) => {
            const authData = {
                userId: response.authResponse.userID,
                socialToken: response.authResponse.accessToken
            };
            this.props.authUser(authData);
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
        } else {
            this.setState({
                showLoginDialog: true
            });
        }
    };

    renderAddButton = () => {
        if (!this.context.router.isActive("add")) {
            return (
                this.props.user
                    ?
                    this.renderAddNewSong()
                    :
                    <OverlayTrigger trigger={["hover", "focus"]} placement="bottom" overlay={this.renderLoginPopover()}>
                        {this.renderAddNewSong()}
                    </OverlayTrigger>
            )
        } else {
            return null;
        }
    };

    renderAddNewSong() {
        return <NavItem onClick={this.handleAddPress}>Add new song</NavItem>;
    }

    renderLoginBlock() {
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
            <Navbar fixedTop={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">Chords database</Link>
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
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

Header.contextTypes = {
    router: React.PropTypes.object
};