import React from "react";
import {Link} from "react-router";
import {Navbar, Nav, NavItem, FormGroup, FormControl, NavDropdown, MenuItem} from "react-bootstrap/lib";

export default class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: ""
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
        this.context.router.push("/add")
    };

    renderAddButton = () => {
        if (!this.props.history.isActive("add")) {
            if (this.props.user) {
                return <NavItem onClick={this.handleAddPress}>Add new song</NavItem>;
            } else {
                return <div></div>;
            }
        } else {
            return <div></div>
        }
    };

    renderLoginBlock() {
        if (this.props.user) {
            return (
                <NavDropdown title={`Hello, ${this.props.user.username}`} id="basic-nav-dropdown">
                    <MenuItem onClick={this.handleLogout}>Log out</MenuItem>
                </NavDropdown>
            )
        } else {
            return (
                <NavItem onClick={this.handleLogin}>Log in with Facebook</NavItem>
            )
        }
    }

    render() {
        return (
            <Navbar fixedTop={true} inverse>
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