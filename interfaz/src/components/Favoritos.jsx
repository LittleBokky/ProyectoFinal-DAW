import React, { useEffect, useState } from 'react';
import { Container, Card, ListGroup, Row, Col } from 'react-bootstrap';

const Favoritos = () => {
    const [favoritos, setFavoritos] = useState([]);

    useEffect(() => {
        fetchFavoritos();
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

    return (
        <Container>
            <h2>Mis Favoritos</h2>
            <Row>
            {favoritos.map((favorito) => (
                <Col xs={4} key={favorito.id}>
                <Card className="mb-4">
                    <Card.Img variant="top" src={favorito.zapatilla_image} />
                    <Card.Body>
                        <Card.Title>{favorito.zapatilla_name}</Card.Title>
                        <Card.Text>
                            Marca: {favorito.zapatilla_marca}
                        </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item>Precio: ${favorito.zapatilla_price}</ListGroup.Item>
                        <ListGroup.Item>Talla: {favorito.zapatilla_size}</ListGroup.Item>
                        <ListGroup.Item>Vendido por: {favorito.zapatilla_user}</ListGroup.Item>
                    </ListGroup>
                </Card>
                </Col>
            ))}
            </Row>
        </Container>
    );
};

export default Favoritos;
