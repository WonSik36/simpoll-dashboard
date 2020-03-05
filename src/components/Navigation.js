import React from 'react';
import {Navbar} from 'react-bootstrap';
import './Navigation.css';

class Navigation extends React.Component {
    render() {
        return (
            <Navbar bg="primary" variant="dark">
                <Navbar.Brand href="#">{this.props.children}</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        Signed in as: 
                        <p className="nav-user">{this.props.user}</p>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        )
    }   
}

export default Navigation;