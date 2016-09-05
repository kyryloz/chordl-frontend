import React from "react";
import {Link} from "react-router";
import {
    OverlayTrigger,
    Popover,
    Modal,
    Button,
    Navbar,
    Nav,
    NavItem,
    FormGroup,
    FormControl,
    NavDropdown,
    MenuItem
} from "react-bootstrap/lib";

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
            return (
                !this.props.user
                    ?
                    <OverlayTrigger trigger={["hover", "focus"]} placement="bottom" overlay={this.renderLoginPopover()}>
                        <NavItem onClick={this.handleAddPress}>Add new song</NavItem>
                    </OverlayTrigger>
                    :
                    <NavItem onClick={this.handleAddPress}>Add new song</NavItem>
            )
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

    renderLoginPopover = () => {
        if (this.props.user) {
            return <div></div>
        } else {
            return (
                <Popover title="Authenticate">
                    <p>To add song you should login with your Facebook account.</p>
                    <p>We do not post anything on your page.</p>
                </Popover>
            );
        }

    };

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