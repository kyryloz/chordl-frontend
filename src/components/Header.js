import React from "react";
import {Link} from "react-router";
import {Modal, Button, Navbar, Nav, NavItem, FormGroup, FormControl, NavDropdown, MenuItem} from "react-bootstrap/lib";

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

    handleDialogClose = () => {
        this.setState({
            showLoginDialog: false
        })
    };

    renderAddButton = () => {
        if (!this.props.history.isActive("add")) {
            return <NavItem onClick={this.handleAddPress}>Add new song</NavItem>;
        } else {
            return <div></div>;
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

    renderLoginDialog = () => {
        // TODO make tooltip
        return (
            <Modal show={this.state.showLoginDialog} onHide={this.handleDialogClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Authenticate</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>To add song you should login with your Facebook account.</p>
                    <p>We do not post anything on your page.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{width: 120}} onClick={this.handleDialogClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    };

    render() {
        return (
            <Navbar fixedTop={true} inverse>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">Chords database</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    {this.renderLoginDialog()}
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