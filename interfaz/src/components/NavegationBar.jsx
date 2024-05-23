import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import SellProduct from './SellProduct'; // Asegúrate de tener el componente SellProduct importado

const NavigationBar = () => {
    const userSession = localStorage.getItem('userSession');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userSession');
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">
                <img
                    src="./logo-anteproyecto.png"
                    height="50"
                    className="d-inline-block align-top"
                    alt="Refootwear logo"
                />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {!userSession && (
                        <>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link as={Link} to="/register">Register</Nav.Link>
                        </>
                    )}
                    {userSession && (
                        <>
                            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                            <SellProductButton /> {/* Button for opening SellProduct modal */}
                            <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

// Separate component for the SellProduct button
const SellProductButton = () => {
    const [showModal, setShowModal] = React.useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    return (
        <>
            <Nav.Link as={Button} onClick={handleShow}>Sell Product</Nav.Link>
            <SellProduct showModal={showModal} handleClose={handleClose} />
        </>
    );
};

export default NavigationBar;
