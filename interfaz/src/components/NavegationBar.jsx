import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">Navbar</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;
