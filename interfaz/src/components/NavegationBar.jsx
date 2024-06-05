import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/NavegationBar.css';
import SellProduct from './SellProduct'; 

const NavigationBar = () => {
    const userSession = localStorage.getItem('userSession');
    const userName = localStorage.getItem('userName');
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('userSession');
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userData');
        navigate('/login');
    };

    React.useEffect(() => {
        if (!userSession && location.pathname === '/') {
            navigate('/login');
        }
    }, [userSession, navigate, location]);

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand as={Link} to="/">
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
                    <Nav.Link as={Link} to="/news">News</Nav.Link>
                    {!userSession && (
                        <>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link as={Link} to="/register">Register</Nav.Link>
                        </>
                    )}
                    {userSession && (
                        <>
                            <SellProductButton />
                            <Nav.Link as={Button} onClick={handleLogout}>Logout</Nav.Link>
                            <Nav.Item className="ml-2">
                            <Nav.Link as={Link} to="/profile">{userSession}</Nav.Link>
                            </Nav.Item>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

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
