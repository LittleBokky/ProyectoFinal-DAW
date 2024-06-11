import React, { useEffect, useState } from 'react';
import { Container, Card, ListGroup, Row, Col, Button, Modal } from 'react-bootstrap';
import { newCompras } from '../utils/comprasUtils';
import { BagPlus, BagPlusFill, Shop, Trash } from 'react-bootstrap-icons';

const Favoritos = () => {
    const [favoritos, setFavoritos] = useState([]);
    const [compras, setCompras] = useState([]);
    const [zapatillasDisponibles, setZapatillasDisponibles] = useState([]);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [selectedZapatilla, setSelectedZapatilla] = useState(null);

    useEffect(() => {
        fetchFavoritos();
        fetchCompras();
        fetchZapatillasDisponibles();
    }, []);

    const fetchFavoritos = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData"));
            const response = await fetch('http://localhost:8000/favorito/get', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userData.id }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch favoritos');
            }

            const data = await response.json();
            setFavoritos(data);
        } catch (error) {
            console.error('Error fetching favoritos:', error);
        }
    };

    const fetchCompras = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData"));
            const response = await fetch('http://localhost:8000/compras/get', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userData.id }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch compras');
            }
            const data = await response.json();
            setCompras(data);
        } catch (error) {
            console.error('Error fetching compras:', error);
        }
    };

    const fetchZapatillasDisponibles = async () => {
        try {
            const response = await fetch('http://localhost:8000/zapatillas/not-bought');
            if (!response.ok) {
                throw new Error('Failed to fetch zapatillas disponibles');
            }
            const data = await response.json();
            setZapatillasDisponibles(data);
        } catch (error) {
            console.error('Error fetching zapatillas disponibles:', error);
        }
    };

    const removeFromFavoritos = async (zapatillaId) => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData"));
            const response = await fetch('http://localhost:8000/favorito/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userData.id, zapatilla_id: zapatillaId }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove favorito');
            }

            // Refrescar la lista de favoritos después de eliminar uno
            fetchFavoritos();
        } catch (error) {
            console.error('Error removing favorito:', error);
        }
    };

    const handleBuy = (zapatilla) => {
        setSelectedZapatilla(zapatilla);
        setShowBuyModal(true);
    };

    const handleAcceptBuy = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData"));
            await newCompras(selectedZapatilla.zapatilla_id, userData.id);

            // Refrescar la lista de favoritos y zapatillas disponibles después de la compra
            fetchFavoritos();
            fetchZapatillasDisponibles();
            fetchCompras();
            setShowBuyModal(false);
        } catch (error) {
            console.error('Error buying zapatilla:', error);
        }
    };

    return (
        <Container>
            <h2>Mis Favoritos</h2>
            <Row>
                {favoritos.map((favorito) => {
                    // Verificar si la zapatilla está en la lista de compras de cualquier usuario
                    const isComprada = compras.some(compra => compra.zapatilla_id === favorito.zapatilla_id);
                    // Verificar si la zapatilla está disponible para comprar
                    const isDisponible = zapatillasDisponibles.some(zapatilla => zapatilla.id === favorito.zapatilla_id);
                    // Si la zapatilla está comprada o no está disponible, no la mostramos en favoritos
                    if (isComprada || !isDisponible) {
                        return null;
                    }
                    return (
                        <Col xs={6} md={4} key={favorito.id}>
                            <Card className="mb-4">
                                <Card.Img variant="top" src={favorito.zapatilla_image} />
                                <Card.Body>
                                    <Card.Title>{favorito.zapatilla_name}</Card.Title>
                                    <Card.Text>
                                        Marca: {favorito.zapatilla_marca}
                                    </Card.Text>
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroup.Item>Precio: {favorito.zapatilla_price}€</ListGroup.Item>
                                    <ListGroup.Item>Talla: {favorito.zapatilla_size}</ListGroup.Item>
                                    <ListGroup.Item>Vendido por: {favorito.zapatilla_user}</ListGroup.Item>
                                </ListGroup>
                               <Row className='justify-content-between' style={{ margin: '10px' }}>
                                    <Col>
                                        <Button variant="danger" onClick={() => removeFromFavoritos(favorito.zapatilla_id)}>
                                            <Trash/> 
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button variant="primary" onClick={() => handleBuy(favorito)}>
                                            <BagPlusFill/> 
                                        </Button>
                                    </Col>
                               </Row>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {/* Modal de Confirmación de Compra */}
            {selectedZapatilla && (
                <Modal show={showBuyModal} onHide={() => setShowBuyModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmar Compra</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Marca: {selectedZapatilla.zapatilla_marca}</p>
                        <p>Modelo: {selectedZapatilla.zapatilla_name}</p>
                        <p>Talla: {selectedZapatilla.zapatilla_size}</p>
                        <p>Precio: {selectedZapatilla.zapatilla_price}€</p>
                        <p>Vendido por: {selectedZapatilla.zapatilla_user}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowBuyModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleAcceptBuy}>
                            Aceptar Compra
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
}

export default Favoritos;
