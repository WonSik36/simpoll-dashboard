import React from 'react';
import {Navbar} from 'react-bootstrap';
import './style/Navigation.css';

class Navigation extends React.Component {
    shouldComponentUpdate(newProps, newState){
        if(newProps.user === this.props.user)
            return false;
        else
            return true;
    }

    render() {
        return (
            <Navbar bg="primary" variant="dark">
                <Navbar.Brand href={this.props.href}>{this.props.children}</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        Signed in as: 
                        <p className="nav-user">{this.props.user.nickname}</p>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        )
    }   
}

export default Navigation;